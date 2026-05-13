package com.screentoskill.service

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.content.Intent
import android.view.accessibility.AccessibilityEvent

class AppAccessibilityService : AccessibilityService() {

    private var lastPkg: String? = null

    companion object {
        var isRunning = false  // 🔥 static flag to detect if service is alive
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        isRunning = true
        AppMonitor.contextRef = this
        lastPkg = null

        // 🔥 Configure service info dynamically (more resilient than XML alone)
        val info = AccessibilityServiceInfo().apply {
            eventTypes = AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED or
                         AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED
            feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC
            flags = AccessibilityServiceInfo.FLAG_REPORT_VIEW_IDS or
                    AccessibilityServiceInfo.FLAG_RETRIEVE_INTERACTIVE_WINDOWS
            notificationTimeout = 100
        }
        serviceInfo = info
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event?.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return

        val pkg = event.packageName?.toString() ?: return

        if (pkg == "com.screentoskill") return
        if (pkg == lastPkg) return
        lastPkg = pkg

        AppMonitor.contextRef = this

        if (pkg.contains("systemui") || pkg.contains("launcher")) {
            OverlayService.hide()
            AppMonitor.onAppExit()
            return
        }

        AppMonitor.handleAppChange(this, pkg)
    }

    override fun onInterrupt() {}

    override fun onDestroy() {
        super.onDestroy()
        isRunning = false  // 🔥 Mark service as dead
        AppMonitor.contextRef = null
    }
}