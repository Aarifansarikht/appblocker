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
    var contextRef: Context? = null

    // Still in-memory (these are session-only, intentional)

    private val startTimeMap = mutableMapOf<String, Long>()

    private const val CHANNEL_ID = "app_blocker_timer"
    private const val NOTIFICATION_ID = 1001

    // ─────────────────────────────────────────────
    // SharedPrefs helpers — replaces in-memory maps
    // ─────────────────────────────────────────────

    private fun getLockedNowApps(context: Context): MutableSet<String> {
        val prefs = context.getSharedPreferences("LOCKER", Context.MODE_PRIVATE)
        return prefs.getStringSet("locked_now_apps", mutableSetOf())?.toMutableSet()
                ?: mutableSetOf()
    }

    private fun saveLockedNowApps(context: Context, set: Set<String>) {
        context.getSharedPreferences("LOCKER", Context.MODE_PRIVATE)
                .edit()
                .putStringSet("locked_now_apps", set)
                .apply()
    }

    private fun getRemainingTime(context: Context, pkg: String): Long {
        return context.getSharedPreferences("LOCKER", Context.MODE_PRIVATE)
                .getLong("remaining_$pkg", getAppTimer(context, pkg))
    }

    private fun saveRemainingTime(context: Context, pkg: String, ms: Long) {
        context.getSharedPreferences("LOCKER", Context.MODE_PRIVATE)
                .edit()
                .putLong("remaining_$pkg", ms)
                .apply()
    }

    private fun clearRemainingTime(context: Context, pkg: String) {
        context.getSharedPreferences("LOCKER", Context.MODE_PRIVATE)
                .edit()
                .remove("remaining_$pkg")
                .apply()
    }

    // ─────────────────────────────────────────────
    // Core logic
    // ─────────────────────────────────────────────

    fun handleAppChange(context: Context, pkg: String) {
        contextRef = context

        if (!isTodayAllowed(context, pkg)) return

        if (!isTargetApp(context, pkg)) {
            OverlayService.hide()
            return
        }

        // Read locked state from SharedPrefs (survives app kill)
        val lockedNow = getLockedNowApps(context)
        if (lockedNow.contains(pkg)) {
            OverlayService.show(context, pkg)
            return
        }

        if (currentApp == pkg && handler != null) return

        currentApp = pkg
        handler?.removeCallbacksAndMessages(null)

        val remaining = getRemainingTime(context, pkg)

        // Instant lock if no time left
        if (remaining <= 1000) {
            val updated = lockedNow.toMutableSet().apply { add(pkg) }
            saveLockedNowApps(context, updated)
            clearRemainingTime(context, pkg)
            OverlayService.show(context, pkg)
            showLockedNotification(context, pkg)
            return
        }

        startTimeMap[pkg] = System.currentTimeMillis()

        showTimerNotification(context, pkg, remaining)

        handler = Handler(Looper.getMainLooper())
        handler?.postDelayed(
                {
                    if (currentApp == pkg) {
                        val set = getLockedNowApps(context).toMutableSet().apply { add(pkg) }
                        saveLockedNowApps(context, set)
                        clearRemainingTime(context, pkg)
                        OverlayService.show(context, pkg)
                        showLockedNotification(context, pkg)
                    }
                },
                remaining
        )
    }

    fun onAppExit() {
        val context = contextRef ?: return

        currentApp?.let { pkg ->
            val start = startTimeMap[pkg] ?: return
            val used = System.currentTimeMillis() - start
            val remaining = getRemainingTime(context, pkg) - used

            if (remaining > 0) {
                // Persist remaining time so it survives app kill
                saveRemainingTime(context, pkg, remaining)
            } else {
                val set = getLockedNowApps(context).toMutableSet().apply { add(pkg) }
                saveLockedNowApps(context, set)
                clearRemainingTime(context, pkg)
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

        val today =
                java.text.SimpleDateFormat("EEE", java.util.Locale.ENGLISH).format(java.util.Date())

        return days.contains(today)
    }

   fun onUnlocked(pkg: String) {
    val context = contextRef ?: return

    val set = getLockedNowApps(context).toMutableSet().apply { remove(pkg) }
    saveLockedNowApps(context, set)

    clearRemainingTime(context, pkg)

    // 🔥 IMPORTANT FIX
    handler?.removeCallbacksAndMessages(null)

    startTimeMap.remove(pkg)
    currentApp = null
}
   fun relockApp(pkg: String) {
    val context = contextRef ?: return

    val set = getLockedNowApps(context).toMutableSet().apply { remove(pkg) }
    saveLockedNowApps(context, set)

    clearRemainingTime(context, pkg)

    // 🔥 CRITICAL RESET
    handler?.removeCallbacksAndMessages(null)

    startTimeMap.remove(pkg)
    currentApp = null   // 👈 THIS FIXES YOUR BUG

    OverlayService.hide()
}

    // ─────────────────────────────────────────────
    // Notifications
    // ─────────────────────────────────────────────

    private fun showTimerNotification(context: Context, pkg: String, timeMs: Long) {
        createNotificationChannel(context)

        val seconds = timeMs / 1000
        val appName = getAppName(context, pkg)

        val notification =
                NotificationCompat.Builder(context, CHANNEL_ID)
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

        val notification =
                NotificationCompat.Builder(context, CHANNEL_ID)
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
            val channel =
                    NotificationChannel(
                            CHANNEL_ID,
                            "App Blocker Timer",
                            NotificationManager.IMPORTANCE_LOW
                    )
            val manager =
                    context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
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
