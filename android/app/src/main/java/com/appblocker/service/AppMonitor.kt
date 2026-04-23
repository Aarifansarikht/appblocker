package com.appblocker.service

import android.content.Context
import android.os.Handler
import android.os.Looper

object AppMonitor {

    private var handler: Handler? = null
    private var currentApp: String? = null

    private val unlockedApps = mutableSetOf<String>()
    private val lockedNowApps = mutableSetOf<String>()

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

        handler = Handler(Looper.getMainLooper())
        handler?.postDelayed({

            // 🔥 ensure still in same app
            if (currentApp == pkg) {
                lockedNowApps.add(pkg)
                OverlayService.show(context, pkg)
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
}