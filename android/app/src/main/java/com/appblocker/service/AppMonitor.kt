package com.appblocker.service

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

    private val unlockedApps = mutableSetOf<String>()
    private val lockedNowApps = mutableSetOf<String>()

    private const val CHANNEL_ID = "app_blocker_timer"
    private const val NOTIFICATION_ID = 1001

    fun handleAppChange(context: Context, pkg: String) {

        if (!isTargetApp(context, pkg)) {
            OverlayService.hide()
            return
        }

        // 🔥 already locked → show instantly
        if (lockedNowApps.contains(pkg)) {
            OverlayService.show(context, pkg)
            return
        }

        // 🔥 prevent restarting timer
        if (currentApp == pkg) return

        currentApp = pkg

        handler?.removeCallbacksAndMessages(null)

        val time = getAppTimer(context, pkg)

        // 📢 Show notification that timer has started
        showTimerNotification(context, pkg, time)

        handler = Handler(Looper.getMainLooper())
        handler?.postDelayed({

            // 🔥 ensure still in same app
            if (currentApp == pkg) {
                lockedNowApps.add(pkg)
                OverlayService.show(context, pkg)

                // 📢 Update notification to show app is now locked
                showLockedNotification(context, pkg)
            }

        }, time)
    }

    fun onAppExit() {
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

    fun onUnlocked(pkg: String) {
        unlockedApps.add(pkg)
        lockedNowApps.remove(pkg)
        currentApp = null
    }

    fun relockApp(pkg: String) {
        unlockedApps.remove(pkg)
        lockedNowApps.remove(pkg)
    }

    // 📢 Notification: Timer started
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
            .setAutoCancel(false)
            .build()

        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(NOTIFICATION_ID, notification)
    }

    // 📢 Notification: App locked
    private fun showLockedNotification(context: Context, pkg: String) {
        createNotificationChannel(context)

        val appName = getAppName(context, pkg)

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_lock_lock)
            .setContentTitle("🔒 App Locked")
            .setContentText("$appName is now locked. Solve the challenge to unlock.")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .build()

        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(NOTIFICATION_ID, notification)
    }

    // 📢 Create notification channel (Android 8+)
    private fun createNotificationChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "App Blocker Timer",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Shows timer countdown and lock notifications"
            }

            val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    // 🏷 Get human-readable app name from package name
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