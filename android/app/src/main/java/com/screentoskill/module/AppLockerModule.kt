package com.screentoskill.module

import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.net.Uri
import android.provider.Settings
import android.util.Base64
import com.facebook.react.bridge.*
import com.screentoskill.service.AppMonitor
import java.io.ByteArrayOutputStream

class AppLockerModule(private val reactContext: ReactApplicationContext) :
        ReactContextBaseJavaModule(reactContext) {

    companion object {
        var reactContextRef: ReactApplicationContext? = null
    }

    init {
        reactContextRef = reactContext
    }

    override fun getName() = "AppLocker"

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val pm = reactContext.packageManager

            val intent = Intent(Intent.ACTION_MAIN, null)
            intent.addCategory(Intent.CATEGORY_LAUNCHER)

            val resolveInfoList = pm.queryIntentActivities(intent, 0)

            val list = Arguments.createArray()

            for (resolveInfo in resolveInfoList) {
                val pkg = resolveInfo.activityInfo.packageName
                val name = resolveInfo.loadLabel(pm).toString()
                val iconDrawable = resolveInfo.loadIcon(pm)

                val base64Icon = drawableToBase64(iconDrawable)

                val map = Arguments.createMap()
                map.putString("name", name)
                map.putString("package", pkg)
                map.putString("icon", base64Icon)

                list.pushMap(map)
            }

            promise.resolve(list)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }

    private fun drawableToBase64(drawable: Drawable): String {
        val bitmap = drawableToBitmap(drawable)

        val stream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 80, stream)

        val byteArray = stream.toByteArray()
        val base64 = Base64.encodeToString(byteArray, Base64.NO_WRAP)

        return "data:image/png;base64,$base64"
    }

    private fun drawableToBitmap(drawable: Drawable): Bitmap {
        if (drawable is BitmapDrawable) {
            return drawable.bitmap
        }

        val width = drawable.intrinsicWidth.takeIf { it > 0 } ?: 64
        val height = drawable.intrinsicHeight.takeIf { it > 0 } ?: 64

        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)

        drawable.setBounds(0, 0, canvas.width, canvas.height)
        drawable.draw(canvas)

        return bitmap
    }

    @ReactMethod
    fun saveLockedApps(apps: ReadableArray) {
        val prefs = reactContext.getSharedPreferences("LOCKER", Context.MODE_PRIVATE)

        val existing =
                prefs.getStringSet("locked_apps", mutableSetOf())?.toMutableSet() ?: mutableSetOf()

        for (i in 0 until apps.size()) {
            apps.getString(i)?.let { existing.add(it) }
        }

        prefs.edit().putStringSet("locked_apps", existing).apply()

        // ✅ CLEAN STALE STATES FOR ALL APPS
        val lockedNow =
                prefs.getStringSet("locked_now_apps", mutableSetOf())?.toMutableSet()
                        ?: mutableSetOf()

        existing.forEach { pkg ->
            if (!prefs.contains("remaining_$pkg")) {
                lockedNow.remove(pkg)
            }
        }

        prefs.edit().putStringSet("locked_now_apps", lockedNow).apply()
    }
    @ReactMethod
    fun setAppTimer(pkg: String, seconds: Int) {
        val prefs = reactContext.getSharedPreferences("LOCKER", Context.MODE_PRIVATE)

        // ✅ ALWAYS RESET STATE
        prefs.edit()
                .putLong(pkg, seconds * 1000L) // base timer
                .putLong("remaining_$pkg", seconds * 1000L) // reset remaining
                .apply()

        // ❗ REMOVE FROM locked_now (VERY IMPORTANT)
        val lockedNow =
                prefs.getStringSet("locked_now_apps", mutableSetOf())?.toMutableSet()
                        ?: mutableSetOf()
        lockedNow.remove(pkg)
        prefs.edit().putStringSet("locked_now_apps", lockedNow).apply()
    }
    
    @ReactMethod
    fun saveSchedule(pkg: String, days: ReadableArray) {
        val prefs = reactContext.getSharedPreferences("LOCKER", Context.MODE_PRIVATE)

        val set = mutableSetOf<String>()
        for (i in 0 until days.size()) {
            set.add(days.getString(i)!!)
        }

        prefs.edit().putStringSet("${pkg}_days", set).apply()

        // ✅ RESET STATE WHEN SCHEDULE CHANGES
        prefs.edit().remove("remaining_$pkg").apply()

        val lockedNow =
                prefs.getStringSet("locked_now_apps", mutableSetOf())?.toMutableSet()
                        ?: mutableSetOf()
        lockedNow.remove(pkg)
        prefs.edit().putStringSet("locked_now_apps", lockedNow).apply()
    }
    @ReactMethod
    fun relockApp(pkg: String) {
        AppMonitor.relockApp(pkg)
    }

    @ReactMethod
    fun getSchedule(pkg: String, promise: Promise) {
        try {
            val prefs = reactContext.getSharedPreferences("LOCKER", Context.MODE_PRIVATE)
            val days = prefs.getStringSet("${pkg}_days", emptySet()) ?: emptySet()

            val list = Arguments.createArray()
            days.forEach { list.pushString(it) }

            promise.resolve(list)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }
    @ReactMethod
    fun unlockApp(pkg: String) {
        val prefs = reactContext.getSharedPreferences("LOCKER", Context.MODE_PRIVATE)

        // remove from locked_apps
        val locked =
                prefs.getStringSet("locked_apps", mutableSetOf())?.toMutableSet() ?: mutableSetOf()
        locked.remove(pkg)
        prefs.edit().putStringSet("locked_apps", locked).apply()

        // remove timers
        prefs.edit().remove(pkg).remove("remaining_$pkg").apply()

        // remove from locked_now (🔥 CRITICAL)
        val lockedNow =
                prefs.getStringSet("locked_now_apps", mutableSetOf())?.toMutableSet()
                        ?: mutableSetOf()
        lockedNow.remove(pkg)
        prefs.edit().putStringSet("locked_now_apps", lockedNow).apply()

        AppMonitor.relockApp(pkg)
    }
    @ReactMethod
    fun openAccessibilitySettings() {
        val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        reactContext.startActivity(intent)
    }

    @ReactMethod
    fun requestOverlayPermission() {
        val intent =
                Intent(
                        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:${reactContext.packageName}")
                )
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        reactContext.startActivity(intent)
    }
    @ReactMethod
    fun canDrawOverlays(promise: Promise) {
        try {
            val result = Settings.canDrawOverlays(reactContext)
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }
    @ReactMethod
    fun hasUsageAccess(promise: Promise) {
        try {
            val appOps =
                    reactContext.getSystemService(Context.APP_OPS_SERVICE) as
                            android.app.AppOpsManager
            val mode =
                    appOps.checkOpNoThrow(
                            android.app.AppOpsManager.OPSTR_GET_USAGE_STATS,
                            android.os.Process.myUid(),
                            reactContext.packageName
                    )
            promise.resolve(mode == android.app.AppOpsManager.MODE_ALLOWED)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }
    @ReactMethod
    fun isAccessibilityEnabled(promise: Promise) {
        try {
            val enabled =
                    Settings.Secure.getInt(
                            reactContext.contentResolver,
                            Settings.Secure.ACCESSIBILITY_ENABLED
                    ) == 1

            if (!enabled) {
                promise.resolve(false)
                return
            }

            val services =
                    Settings.Secure.getString(
                            reactContext.contentResolver,
                            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
                    )
                            ?: ""

            val isEnabled = services.contains(reactContext.packageName)
            promise.resolve(isEnabled)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }

    @ReactMethod
    fun openUsageAccessSettings() {
        val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        reactContext.startActivity(intent)
    }

    @ReactMethod
    fun getLockedApps(promise: Promise) {
        try {
            val prefs = reactContext.getSharedPreferences("LOCKER", Context.MODE_PRIVATE)

            val locked = prefs.getStringSet("locked_apps", emptySet()) ?: emptySet()
            val lockedNow = prefs.getStringSet("locked_now_apps", emptySet()) ?: emptySet()

            val result = Arguments.createMap()

            val lockedArray = Arguments.createArray()
            locked.forEach { lockedArray.pushString(it) }

            val lockedNowArray = Arguments.createArray()
            lockedNow.forEach { lockedNowArray.pushString(it) }

            result.putArray("locked", lockedArray)
            result.putArray("lockedNow", lockedNowArray)

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }
    @ReactMethod
    fun getFullState(promise: Promise) {
        try {
            val prefs = reactContext.getSharedPreferences("LOCKER", Context.MODE_PRIVATE)

            val locked = prefs.getStringSet("locked_apps", emptySet()) ?: emptySet()
            val lockedNow = mutableSetOf<String>()

            val result = Arguments.createMap()

            val lockedArr = Arguments.createArray()
            val lockedNowArr = Arguments.createArray()
            val timers = Arguments.createMap()

            val today =
                    java.text.SimpleDateFormat("EEE", java.util.Locale.ENGLISH)
                            .format(java.util.Date())

            locked.forEach { pkg ->
                lockedArr.pushString(pkg)

                val remaining = prefs.getLong("remaining_$pkg", prefs.getLong(pkg, 0))
                val days = prefs.getStringSet("${pkg}_days", emptySet()) ?: emptySet()

                // ✅ CASE 1: Timer based lock (quick block or used time finished)
                if (remaining <= 1000L && remaining != 0L) {
                    lockedNow.add(pkg)
                }

                // ✅ CASE 2: Instant block (timer = 0)
                if (remaining == 0L) {
                    lockedNow.add(pkg)
                }

                // 🔥 CASE 3: SCHEDULE BASED LOCK (THIS WAS MISSING)
                if (days.isNotEmpty() && days.contains(today)) {
                    lockedNow.add(pkg)
                }

                timers.putDouble(pkg, remaining / 1000.0)
            }

            // save updated state
            prefs.edit().putStringSet("locked_now_apps", lockedNow).apply()

            lockedNow.forEach { lockedNowArr.pushString(it) }

            result.putArray("locked", lockedArr)
            result.putArray("lockedNow", lockedNowArr)
            result.putMap("timers", timers)

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }
    

@ReactMethod
fun saveBlockSubject(subject: String) {
    val prefs = reactContext.getSharedPreferences("LOCKER", Context.MODE_PRIVATE)
    prefs.edit().putString("block_subject", subject).apply()
}
}
