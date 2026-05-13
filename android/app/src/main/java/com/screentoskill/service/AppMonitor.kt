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
    private var scheduleChecker: Handler? = null
    private val startTimeMap = mutableMapOf<String, Long>()
    private var scheduleStartChecker: Handler? = null
    private var isScheduleStartCheckerRunning = false
    private const val CHANNEL_ID = "app_blocker_timer"
    private const val NOTIFICATION_ID = 1001

    // ─────────────────────────────────────────────
    // SharedPrefs helpers — replaces in-memory maps
    // ─────────────────────────────────────────────
    fun startGlobalScheduleChecker(context: Context) {
    if (isScheduleStartCheckerRunning) return
    isScheduleStartCheckerRunning = true

    scheduleStartChecker = Handler(Looper.getMainLooper())
    scheduleStartChecker?.post(object : Runnable {
        override fun run() {
            // ✅ Run check on background thread, UI calls are posted inside
            Thread { checkAndEnforceSchedules(context) }.start()
            scheduleStartChecker?.postDelayed(this, 5_000)
        }
    })
}

    fun stopGlobalScheduleChecker() {
        scheduleStartChecker?.removeCallbacksAndMessages(null)
        scheduleStartChecker = null
        isScheduleStartCheckerRunning = false
    }
    private fun getForegroundApp(context: Context): String? {
        return try {
            val usageStatsManager =
                    context.getSystemService(Context.USAGE_STATS_SERVICE) as
                            android.app.usage.UsageStatsManager
            val now = System.currentTimeMillis()
            // ✅ Use a wider window (3 minutes) to reliably catch the foreground app
            val stats =
                    usageStatsManager.queryUsageStats(
                            android.app.usage.UsageStatsManager.INTERVAL_DAILY,
                            now - 180_000,
                            now
                    )
            stats
                    ?.filter { it.totalTimeInForeground > 0 }
                    ?.maxByOrNull { it.lastTimeUsed }
                    ?.packageName
        } catch (e: Exception) {
            null
        }
    }

    private fun checkAndEnforceSchedules(context: Context) {
        val lockedApps = getLockedApps(context)
        val lockedNow = getLockedNowApps(context).toMutableSet()
        var changed = false

        val cal = java.util.Calendar.getInstance()
        val today = java.text.SimpleDateFormat("EEE", java.util.Locale.ENGLISH).format(cal.time)
        val nowMins =
                cal.get(java.util.Calendar.HOUR_OF_DAY) * 60 + cal.get(java.util.Calendar.MINUTE)

        // ✅ Prefer currentApp (set by accessibility events) — fall back to UsageStats
        val foregroundPkg = currentApp ?: getForegroundApp(context)

        lockedApps.forEach { pkg ->
            val days = getAppDays(context, pkg)
            if (days.isEmpty() || !days.contains(today)) return@forEach

            val (fromMins, toMins) = getLockRange(context, pkg)
            if (fromMins < 0 || toMins < 0) return@forEach

            val insideWindow = nowMins in fromMins until toMins

            if (insideWindow && !lockedNow.contains(pkg)) {
                // Window just opened — mark as locked
                lockedNow.add(pkg)
                changed = true
                clearRemainingTime(context, pkg)
                startScheduleEndChecker(context, pkg)

                // ✅ Show overlay if this app is currently in foreground
                if (foregroundPkg == pkg) {
                    Handler(Looper.getMainLooper()).post {
                        OverlayService.show(context, pkg)
                        showLockedNotification(context, pkg)
                    }
                }
            }

            if (!insideWindow && lockedNow.contains(pkg)) {
                // Window closed — release
                lockedNow.remove(pkg)
                changed = true
                clearRemainingTime(context, pkg)
                if (foregroundPkg == pkg) {
                    Handler(Looper.getMainLooper()).post { OverlayService.hide() }
                }
            }
        }

        if (changed) saveLockedNowApps(context, lockedNow)
    }
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

    // ── Always track foreground app for schedule checker ──────────────────
    // Must happen BEFORE isTodayAllowed so global checker knows what's on screen
    if (isTargetApp(context, pkg)) {
        currentApp = pkg   // ← even if outside window, we need to know it's here
    } else {
        currentApp = null  // ← non-target took over, clear it
        OverlayService.hide()
        return
    }
    // ─────────────────────────────────────────────────────────────────────

    if (!isTodayAllowed(context, pkg)) {
        // Outside schedule window — release lock if it was active
        OverlayService.hide()
        val lockedNow = getLockedNowApps(context).toMutableSet()
        if (lockedNow.contains(pkg)) {
            lockedNow.remove(pkg)
            saveLockedNowApps(context, lockedNow)
        }
        return
    }

    val lockedNow = getLockedNowApps(context)
    if (lockedNow.contains(pkg)) {
        OverlayService.show(context, pkg)
        return
    }

    handler?.removeCallbacksAndMessages(null)

    // ── SCHEDULE-BASED: inside window → lock instantly ────────────────────
    val days = getAppDays(context, pkg)
    if (days.isNotEmpty()) {
        val updated = lockedNow.toMutableSet().apply { add(pkg) }
        saveLockedNowApps(context, updated)
        clearRemainingTime(context, pkg)
        OverlayService.show(context, pkg)
        showLockedNotification(context, pkg)
        startScheduleEndChecker(context, pkg)
        return
    }

    // ── TIMER-BASED ───────────────────────────────────────────────────────
    if (handler != null) return  // countdown already running for this app

    val remaining = getRemainingTime(context, pkg)
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
    handler?.postDelayed({
        if (currentApp == pkg) {
            val set = getLockedNowApps(context).toMutableSet().apply { add(pkg) }
            saveLockedNowApps(context, set)
            clearRemainingTime(context, pkg)
            OverlayService.show(context, pkg)
            showLockedNotification(context, pkg)
        }
    }, remaining)
}
    private fun startScheduleEndChecker(context: Context, pkg: String) {
        scheduleChecker?.removeCallbacksAndMessages(null)
        scheduleChecker = Handler(Looper.getMainLooper())

        scheduleChecker?.post(
                object : Runnable {
                    override fun run() {
                        if (!isTodayAllowed(context, pkg)) {
                            // Window is over — release the app
                            val set = getLockedNowApps(context).toMutableSet().apply { remove(pkg) }
                            saveLockedNowApps(context, set)
                            clearRemainingTime(context, pkg)
                            OverlayService.hide()
                            currentApp = null
                            scheduleChecker = null
                            return // stop polling
                        }
                        scheduleChecker?.postDelayed(this, 30_000)
                    }
                }
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

    fun getLockRange(context: Context, pkg: String): Pair<Int, Int> {
        val prefs = context.getSharedPreferences("LOCKER", Context.MODE_PRIVATE)
        val from = prefs.getInt("${pkg}_from", -1)
        val to = prefs.getInt("${pkg}_to", -1)
        return Pair(from, to)
    }

    fun isTodayAllowed(context: Context, pkg: String): Boolean {
        val days = getAppDays(context, pkg)
        if (days.isEmpty()) return true // no schedule = always active

        val cal = java.util.Calendar.getInstance()
        val today = java.text.SimpleDateFormat("EEE", java.util.Locale.ENGLISH).format(cal.time)

        if (!days.contains(today)) return false // wrong day

        val (fromMins, toMins) = getLockRange(context, pkg)
        if (fromMins < 0 || toMins < 0) return true // no time range saved = all day

        val nowMins =
                cal.get(java.util.Calendar.HOUR_OF_DAY) * 60 + cal.get(java.util.Calendar.MINUTE)
        return nowMins in fromMins until toMins // only lock within time window
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

        scheduleChecker?.removeCallbacksAndMessages(null) // ← add this
        scheduleChecker = null

        val set = getLockedNowApps(context).toMutableSet().apply { remove(pkg) }
        saveLockedNowApps(context, set)
        clearRemainingTime(context, pkg)
        handler?.removeCallbacksAndMessages(null)
        startTimeMap.remove(pkg)
        currentApp = null
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
