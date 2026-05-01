package com.screentoskill.service

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent

class AppAccessibilityService : AccessibilityService() {

    private var lastPkg: String? = null

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event?.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return

        val pkg = event.packageName?.toString() ?: return

        // 🔥 ignore OUR OWN APP (overlay triggers this)
        if (pkg == "com.screentoskill") return

        // 🔥 ignore duplicate events
        if (pkg == lastPkg) return
        lastPkg = pkg

        // 🔥 user left app → remove overlay
        if (pkg.contains("systemui") || pkg.contains("launcher")) {
            OverlayService.hide()
            AppMonitor.onAppExit()
            return
        }

        AppMonitor.handleAppChange(this, pkg)
    }

    override fun onInterrupt() {}
}