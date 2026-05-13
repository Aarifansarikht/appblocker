package com.screentoskill.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.screentoskill.service.AppMonitor
import com.screentoskill.service.WatchdogService

class BootReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        when (intent.action) {
            Intent.ACTION_BOOT_COMPLETED,
            "android.os.action.POWER_SAVE_MODE_CHANGED" -> {
                // 🔥 Always restore context
                AppMonitor.contextRef = context

                // 🔥 Start foreground watchdog (survives power save)
                WatchdogService.start(context)
            }
        }
    }
}