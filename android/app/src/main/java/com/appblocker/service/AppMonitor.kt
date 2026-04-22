package com.appblocker.service

import android.content.Context
import android.os.Handler
import android.os.Looper

object AppMonitor {

    private var handler: Handler? = null
    private var currentApp: String? = null

    var userSelectedTime: Long = 10000

    private val unlockedApps = mutableSetOf<String>()

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

    fun startTimer(context: Context, pkg: String) {
        if (currentApp == pkg) return

        if (!isTargetApp(context, pkg)) return

        currentApp = pkg

        handler?.removeCallbacksAndMessages(null)

        val time = getAppTimer(context, pkg)

        handler = Handler(Looper.getMainLooper())
        handler?.postDelayed({
            OverlayService.show(context, pkg)
        }, time)
    }

    fun onUnlocked(pkg: String) {
        unlockedApps.add(pkg)
        currentApp = null
    }

    fun relockApp(pkg: String) {
        unlockedApps.remove(pkg)
    }
}