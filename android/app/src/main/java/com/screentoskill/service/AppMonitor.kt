package com.screentoskill.service

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import android.os.Handler
import android.os.Looper
import androidx.core.app.NotificationCompat

object AppMonitor {

    private var handler: Handler? = null
    private var currentApp: String? = null
    private var contextRef: Context? = null

    private val unlockedApps = mutableSetOf<String>()
    private val lockedNowApps = mutableSetOf<String>()

    // 🔥 NEW: tracking time properly
    private val startTimeMap = mutableMapOf<String, Long>()
    private val remainingTimeMap = mutableMapOf<String, Long>()

    private const val CHANNEL_ID = "app_blocker_timer"
    private const val NOTIFICATION_ID = 1001

    fun handleAppChange(context: Context, pkg: String) {
        contextRef = context

        if (!isTodayAllowed(context, pkg)) return

        if (!isTargetApp(context, pkg)) {
            OverlayService.hide()
            return
        }

        // 🔥 already locked
        if (lockedNowApps.contains(pkg)) {
            OverlayService.show(context, pkg)
            return
        }

        if (currentApp == pkg) return

        currentApp = pkg
        handler?.removeCallbacksAndMessages(null)

        val totalTime = getAppTimer(context, pkg)
        val remaining = remainingTimeMap[pkg] ?: totalTime

        // 🔥 instant lock if no time left
        if (remaining <= 1000) {
            lockedNowApps.add(pkg)
            remainingTimeMap.remove(pkg)
            OverlayService.show(context, pkg)
            showLockedNotification(context, pkg)
            return
        }

        startTimeMap[pkg] = System.currentTimeMillis()

        showTimerNotification(context, pkg, remaining)

        handler = Handler(Looper.getMainLooper())
        handler?.postDelayed({

            if (currentApp == pkg) {
                lockedNowApps.add(pkg)
                remainingTimeMap.remove(pkg)
                OverlayService.show(context, pkg)
                showLockedNotification(context, pkg)
            }

        }, remaining)
    }

    fun onAppExit() {
        val context = contextRef ?: return

        currentApp?.let { pkg ->

            val start = startTimeMap[pkg] ?: return
            val used = System.currentTimeMillis() - start

            val total = getAppTimer(context, pkg)
            val remaining = (remainingTimeMap[pkg] ?: total) - used

            if (remaining > 0) {
                remainingTimeMap[pkg] = remaining
            } else {
                lockedNowApps.add(pkg)
                remainingTimeMap.remove(pkg)
            }

            startTimeMap.remove(pkg)
        }

        handler?.removeCallbacksAndMessages(null)
        currentApp = null
    }

    fun getLockedApps(context: Context): Set<String> {
        val prefs = context.getSharedPreferences("LOCKER", Context.MODE_PRIVATE)
        return prefs.getStringSet("locked_apps", emptySet()) ?: emptySet()
    }

    fun isTargetApp(context: Context, pkg: String): Boolean {
        if (unlockedApps.contains(pkg)) return false
        return getLockedApps(context).contains(pkg)
    }

    fun getAppTimer(context: Context, pkg: String): Long {
        val prefs = context.getSharedPreferences("LOCKER", Context.MODE_PRIVATE)
        return prefs.getLong(pkg, 10000)
    }

    fun getAppDays(context: Context, pkg: String): Set<String> {
        val prefs = context.getSharedPreferences("LOCKER", Context.MODE_PRIVATE)
        return prefs.getStringSet("${pkg}_days", emptySet()) ?: emptySet()
    }

    fun isTodayAllowed(context: Context, pkg: String): Boolean {
        val days = getAppDays(context, pkg)
        if (days.isEmpty()) return true

        val today = java.text.SimpleDateFormat("EEE", java.util.Locale.ENGLISH)
            .format(java.util.Date())

        return days.contains(today)
    }

    fun onUnlocked(pkg: String) {
        unlockedApps.add(pkg)
        lockedNowApps.remove(pkg)
        remainingTimeMap.remove(pkg)
        startTimeMap.remove(pkg)
        currentApp = null
    }

    fun relockApp(pkg: String) {
        unlockedApps.remove(pkg)
        lockedNowApps.remove(pkg)
        remainingTimeMap.remove(pkg)
        startTimeMap.remove(pkg)
    }

    // ------------------ NOTIFICATIONS ------------------

    private fun showTimerNotification(context: Context, pkg: String, timeMs: Long) {
        createNotificationChannel(context)

        val seconds = timeMs / 1000
        val appName = getAppName(context, pkg)

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_lock_idle_lock)
            .setContentTitle("⏱ Timer Active")
            .setContentText("$appName will lock in ${seconds}s")
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setOngoing(true)
            .build()

        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(NOTIFICATION_ID, notification)
    }

    private fun showLockedNotification(context: Context, pkg: String) {
        createNotificationChannel(context)

        val appName = getAppName(context, pkg)

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_lock_lock)
            .setContentTitle("🔒 App Locked")
            .setContentText("$appName is now locked. Solve to unlock.")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()

        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(NOTIFICATION_ID, notification)
    }

    private fun createNotificationChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "App Blocker Timer",
                NotificationManager.IMPORTANCE_LOW
            )

            val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    private fun getAppName(context: Context, pkg: String): String {
        return try {
            val pm = context.packageManager
            val appInfo = pm.getApplicationInfo(pkg, 0)
            pm.getApplicationLabel(appInfo).toString()
        } catch (e: Exception) {
            pkg
        }
    }
}