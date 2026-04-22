package com.appblocker.service

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent

class AppAccessibilityService : AccessibilityService() {

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        val pkg = event?.packageName?.toString() ?: return
        AppMonitor.startTimer(this, pkg)
    }

    override fun onInterrupt() {}
}