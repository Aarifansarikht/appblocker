package com.screentoskill.service

import android.app.*
import android.content.Context
import android.content.Intent
import android.os.*
import androidx.core.app.NotificationCompat

class WatchdogService : Service() {

    private val handler = Handler(Looper.getMainLooper())
    private var lastForegroundApp: String? = null

    companion object {
        const val CHANNEL_ID = "watchdog_channel"
        const val NOTIFICATION_ID = 9999

        fun start(context: Context) {
            val intent = Intent(context, WatchdogService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent)
            } else {
                context.startService(intent)
            }
        }
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, buildNotification())
        startWatching()
    }

    private fun startWatching() {
        handler.post(object : Runnable {
            override fun run() {
                checkForegroundApp()
                handler.postDelayed(this, 500) // poll every 500ms
            }
        })
    }

    private fun checkForegroundApp() {
        val pkg = getForegroundApp() ?: return

        // 🔥 Skip our own app and system UI
        if (pkg == "com.screentoskill") return
        if (pkg.contains("systemui") || pkg.contains("launcher")) {
            if (lastForegroundApp != null) {
                AppMonitor.onAppExit()
                lastForegroundApp = null
            }
            return
        }

        if (pkg == lastForegroundApp) return
        lastForegroundApp = pkg

        AppMonitor.contextRef = this
        AppMonitor.handleAppChange(this, pkg)
    }

    private fun getForegroundApp(): String? {
        return try {
            val usageStatsManager =
                getSystemService(Context.USAGE_STATS_SERVICE) as android.app.usage.UsageStatsManager

            val time = System.currentTimeMillis()
            val stats = usageStatsManager.queryUsageStats(
                android.app.usage.UsageStatsManager.INTERVAL_DAILY,
                time - 5000,
                time
            )

            stats?.maxByOrNull { it.lastTimeUsed }?.packageName
        } catch (e: Exception) {
            null
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "App Blocker Active",
                NotificationManager.IMPORTANCE_MIN  // 🔥 MINIMUM = no sound, collapsed
            ).apply {
                setShowBadge(false)
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("App ScreenToSkill Running")
            .setContentText("Protecting your focus")
            .setSmallIcon(android.R.drawable.ic_lock_lock)
            .setPriority(NotificationCompat.PRIORITY_MIN)
            .setSilent(true)
            .build()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // 🔥 STICKY = Android restarts this after power save kill
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacksAndMessages(null)
    }
}