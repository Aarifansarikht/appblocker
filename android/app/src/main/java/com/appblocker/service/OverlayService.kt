package com.appblocker.service

import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.os.IBinder
import android.provider.Settings
import android.view.*
import android.widget.Button

import com.appblocker.R
import com.appblocker.module.AppLockerModule
import com.facebook.react.modules.core.DeviceEventManagerModule

class OverlayService : Service() {

    private var windowManager: WindowManager? = null
    private var view: View? = null
    private var currentPkg: String? = null

    companion object {
        fun show(context: Context, pkg: String) {
            val intent = Intent(context, OverlayService::class.java)
            intent.putExtra("pkg", pkg)
            context.startService(intent)
        }
    }

    // ✅ CORRECT EVENT FUNCTION
    private fun sendUnlockEvent(pkg: String) {
        AppLockerModule.reactContextRef
            ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            ?.emit("APP_UNLOCKED", pkg)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {

        if (!Settings.canDrawOverlays(this)) {
            stopSelf()
            return START_NOT_STICKY
        }

        currentPkg = intent?.getStringExtra("pkg")

        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager

        view = LayoutInflater.from(this).inflate(R.layout.overlay_layout, null)

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
            PixelFormat.TRANSLUCENT
        )

        windowManager?.addView(view, params)

        val btn = view?.findViewById<Button>(R.id.btnUnlock)

        btn?.setOnClickListener {
            currentPkg?.let {
                AppMonitor.onUnlocked(it)

                // ✅ SEND EVENT TO REACT
                sendUnlockEvent(it)
            }
            removeOverlay()
        }

        return START_NOT_STICKY
    }

    private fun removeOverlay() {
        view?.let { windowManager?.removeView(it) }
        stopSelf()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}