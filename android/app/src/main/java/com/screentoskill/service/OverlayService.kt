package com.screentoskill.service

import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.os.IBinder
import android.provider.Settings
import android.view.*
import android.widget.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.screentoskill.R
import com.screentoskill.module.AppLockerModule
import kotlin.random.Random

class OverlayService : Service() {

    private var windowManager: WindowManager? = null
    private var view: View? = null
    private var currentPkg: String? = null

    // ✅ Fix 1: declare a Random instance
    private val random = Random

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

        // ✅ Fix 3: find views after inflation
        val questionView = view?.findViewById<TextView>(R.id.questionText)
        val opt1 = view?.findViewById<Button>(R.id.option1)
        val opt2 = view?.findViewById<Button>(R.id.option2)
        val opt3 = view?.findViewById<Button>(R.id.option3)
        val errorView = view?.findViewById<TextView>(R.id.errorText)

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                    WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
            PixelFormat.TRANSLUCENT
        )
        windowManager?.addView(view, params)

        // ✅ Fix 2: call getSharedPreferences directly on the Service (it IS a Context)
        val prefs = getSharedPreferences("LOCKER", Context.MODE_PRIVATE)
        val subject = prefs.getString("block_subject", "math") ?: "math"

        // Helper to show error
        fun showError() {
            errorView?.visibility = View.VISIBLE
            errorView?.text = "Wrong answer. Try again"
            shakeView(errorView)
        }

        // Helper to unlock
        fun unlock(pkgName: String) {
            AppMonitor.onUnlocked(pkgName)
            AppLockerModule.reactContextRef
                ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                ?.emit("APP_UNLOCKED", pkgName)
            removeOverlay()
        }

        // Helper to bind string-answer questions
        fun bindStringQuestion(question: String, correct: String, opts: List<String>) {
            questionView?.text = question
            val buttons = listOf(opt1, opt2, opt3)
            opts.forEachIndexed { i, option ->
                buttons[i]?.text = option
                buttons[i]?.setOnClickListener {
                    if (option == correct) currentPkg?.let { unlock(it) } else showError()
                }
            }
        }

        when (subject) {

            "math" -> {
                var question = ""
                var correctAnswer = 0

                when (random.nextInt(4)) {
                    0 -> { val a = random.nextInt(5, 50); val b = random.nextInt(5, 50); correctAnswer = a + b; question = "$a + $b = ?" }
                    1 -> { val a = random.nextInt(10, 50); val b = random.nextInt(1, a); correctAnswer = a - b; question = "$a - $b = ?" }
                    2 -> { val a = random.nextInt(2, 12); val b = random.nextInt(2, 12); correctAnswer = a * b; question = "$a × $b = ?" }
                    3 -> { val b = random.nextInt(2, 10); val c = random.nextInt(2, 10); val a = b * c; correctAnswer = c; question = "$a ÷ $b = ?" }
                }

                val optSet = mutableSetOf(correctAnswer)
                while (optSet.size < 3) {
                    val fake = correctAnswer + random.nextInt(-10, 11)
                    if (fake > 0 && fake != correctAnswer) optSet.add(fake)
                }
                val options = optSet.shuffled()

                questionView?.text = question
                val buttons = listOf(opt1, opt2, opt3)
                options.forEachIndexed { i, value ->
                    buttons[i]?.text = value.toString()
                    buttons[i]?.setOnClickListener {
                        if (value == correctAnswer) currentPkg?.let { unlock(it) } else showError()
                    }
                }
            }

            "science" -> {
                val scienceQs = listOf(
                    Triple("What planet is closest to the Sun?", "Mercury", listOf("Mercury", "Venus", "Mars")),
                    Triple("How many bones in the human body?", "206", listOf("206", "185", "230")),
                    Triple("What gas do plants absorb?", "CO2", listOf("CO2", "O2", "N2")),
                    Triple("Speed of light (approx km/s)?", "300,000", listOf("300,000", "150,000", "450,000")),
                    Triple("What is H2O?", "Water", listOf("Water", "Salt", "Acid")),
                    Triple("Which organ pumps blood?", "Heart", listOf("Heart", "Lungs", "Liver")),
                    Triple("What force pulls objects down?", "Gravity", listOf("Gravity", "Friction", "Tension")),
                    Triple("What is the powerhouse of the cell?", "Mitochondria", listOf("Mitochondria", "Nucleus", "Ribosome")),
                )
                val q = scienceQs[random.nextInt(scienceQs.size)]
                bindStringQuestion(q.first, q.second, q.third.shuffled())
            }

            "english" -> {
                val englishQs = listOf(
                    Triple("Synonym of 'Happy'", "Joyful", listOf("Joyful", "Sad", "Angry")),
                    Triple("Opposite of 'Ancient'", "Modern", listOf("Modern", "Old", "Antique")),
                    Triple("Plural of 'Child'", "Children", listOf("Children", "Childs", "Childes")),
                    Triple("Past tense of 'Run'", "Ran", listOf("Ran", "Runned", "Running")),
                    Triple("Synonym of 'Big'", "Large", listOf("Large", "Tiny", "Slim")),
                    Triple("Opposite of 'Brave'", "Cowardly", listOf("Cowardly", "Bold", "Strong")),
                    Triple("Past tense of 'Eat'", "Ate", listOf("Ate", "Eated", "Eatten")),
                    Triple("Plural of 'Tooth'", "Teeth", listOf("Teeth", "Tooths", "Toothes")),
                )
                val q = englishQs[random.nextInt(englishQs.size)]
                bindStringQuestion(q.first, q.second, q.third.shuffled())
            }

            "history" -> {
                val historyQs = listOf(
                    Triple("Who was the first US President?", "Washington", listOf("Washington", "Lincoln", "Jefferson")),
                    Triple("In what year did WW2 end?", "1945", listOf("1945", "1939", "1950")),
                    Triple("Which empire built the Colosseum?", "Roman", listOf("Roman", "Greek", "Ottoman")),
                    Triple("Who discovered America in 1492?", "Columbus", listOf("Columbus", "Magellan", "Vespucci")),
                    Triple("Which country built the Great Wall?", "China", listOf("China", "Japan", "India")),
                    Triple("In what year did WW1 begin?", "1914", listOf("1914", "1918", "1905")),
                    Triple("Who wrote the Declaration of Independence?", "Jefferson", listOf("Jefferson", "Madison", "Hamilton")),
                    Triple("Which city was ancient Greece's capital?", "Athens", listOf("Athens", "Sparta", "Troy")),
                )
                val q = historyQs[random.nextInt(historyQs.size)]
                bindStringQuestion(q.first, q.second, q.third.shuffled())
            }
        }

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

    private fun shakeView(v: View?) {
        v?.animate()?.translationX(10f)?.setDuration(50)?.withEndAction {
            v.animate().translationX(-10f).setDuration(50).withEndAction {
                v.animate().translationX(0f).setDuration(50).start()
            }.start()
        }?.start()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}