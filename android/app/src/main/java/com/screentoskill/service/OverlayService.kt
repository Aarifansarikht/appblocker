package com.screentoskill.service

import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.os.IBinder
import android.provider.Settings
import android.view.*
import android.widget.*

import com.screentoskill.R
import com.screentoskill.module.AppLockerModule
import com.facebook.react.modules.core.DeviceEventManagerModule
import kotlin.random.Random

class OverlayService : Service() {

    private var windowManager: WindowManager? = null
    private var view: View? = null
    private var currentPkg: String? = null

    companion object {
        var instance: OverlayService? = null

        fun show(context: Context, pkg: String) {
            val inst = instance
            if (inst != null && inst.currentPkg == pkg) return

            val intent = Intent(context, OverlayService::class.java)
            intent.putExtra("pkg", pkg)
            context.startService(intent)
        }

        fun hide() {
            instance?.removeOverlay()
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {

        if (!Settings.canDrawOverlays(this)) {
            stopSelf()
            return START_NOT_STICKY
        }

        val pkg = intent?.getStringExtra("pkg") ?: return START_NOT_STICKY

        if (view != null && currentPkg == pkg) return START_NOT_STICKY

        instance = this
        currentPkg = pkg

        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager

        view = LayoutInflater.from(this).inflate(R.layout.overlay_layout, null)

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                    WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
            PixelFormat.TRANSLUCENT
        )

        windowManager?.addView(view, params)

        // 🔥 UI refs
        val questionView = view?.findViewById<TextView>(R.id.mathQuestion)
        val error = view?.findViewById<TextView>(R.id.errorText)

        val opt1 = view?.findViewById<Button>(R.id.option1)
        val opt2 = view?.findViewById<Button>(R.id.option2)
        val opt3 = view?.findViewById<Button>(R.id.option3)

        val random = Random

        // ✅ GENERATE SMART QUESTION
        var question = ""
        var correctAnswer = 0

        when (random.nextInt(4)) {

            // ➕ ADDITION
            0 -> {
                val a = random.nextInt(5, 50)
                val b = random.nextInt(5, 50)
                correctAnswer = a + b
                question = "$a + $b = ?"
            }

            // ➖ SUBTRACTION
            1 -> {
                val a = random.nextInt(10, 50)
                val b = random.nextInt(1, a)
                correctAnswer = a - b
                question = "$a - $b = ?"
            }

            // ✖ MULTIPLICATION
            2 -> {
                val a = random.nextInt(2, 12)
                val b = random.nextInt(2, 12)
                correctAnswer = a * b
                question = "$a × $b = ?"
            }

            // ➗ DIVISION
            3 -> {
                val b = random.nextInt(2, 10)
                val correct = random.nextInt(2, 10)
                val a = b * correct
                correctAnswer = correct
                question = "$a ÷ $b = ?"
            }
        }

        questionView?.text = question

        // ✅ GENERATE UNIQUE OPTIONS
        val optionsSet = mutableSetOf<Int>()
        optionsSet.add(correctAnswer)

        while (optionsSet.size < 3) {
            val fake = correctAnswer + random.nextInt(-10, 11)

            if (fake > 0 && fake != correctAnswer) {
                optionsSet.add(fake)
            }
        }

        val options = optionsSet.shuffled()

        opt1?.text = options[0].toString()
        opt2?.text = options[1].toString()
        opt3?.text = options[2].toString()

        // ✅ CLICK HANDLER
        fun handleClick(selected: Int) {
            if (selected == correctAnswer) {

                currentPkg?.let {
                    AppMonitor.onUnlocked(it)

                    AppLockerModule.reactContextRef
                        ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                        ?.emit("APP_UNLOCKED", it)
                }

                removeOverlay()

            } else {
                error?.visibility = View.VISIBLE
                error?.text = "Wrong answer. Try again"

                // 🔥 SHAKE ANIMATION
                error?.animate()?.translationX(10f)?.setDuration(50)?.withEndAction {
                    error.animate().translationX(-10f).setDuration(50).withEndAction {
                        error.animate().translationX(0f).setDuration(50).start()
                    }.start()
                }?.start()
            }
        }

        opt1?.setOnClickListener { handleClick(opt1.text.toString().toInt()) }
        opt2?.setOnClickListener { handleClick(opt2.text.toString().toInt()) }
        opt3?.setOnClickListener { handleClick(opt3.text.toString().toInt()) }

        return START_NOT_STICKY
    }

    private fun removeOverlay() {
        view?.let {
            windowManager?.removeView(it)
            view = null
        }

        currentPkg = null
        instance = null
        stopSelf()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}