package com.screentoskill.module

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.provider.Settings
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Base64

import java.io.ByteArrayOutputStream
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.screentoskill.service.AppMonitor

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

    // ✅ GET EXISTING APPS FIRST
    val existing = prefs.getStringSet("locked_apps", mutableSetOf())?.toMutableSet()
        ?: mutableSetOf()

    // ✅ ADD NEW APPS (MERGE, NOT REPLACE)
    for (i in 0 until apps.size()) {
        apps.getString(i)?.let { existing.add(it) }
    }

    prefs.edit().putStringSet("locked_apps", existing).apply()
}
    @ReactMethod
    fun setAppTimer(pkg: String, seconds: Int) {
        val prefs = reactContext.getSharedPreferences("LOCKER", Context.MODE_PRIVATE)
        prefs.edit().putLong(pkg, seconds * 1000L).apply()
    }
@ReactMethod
fun saveSchedule(pkg: String, days: ReadableArray) {
    val prefs = reactContext.getSharedPreferences("LOCKER", Context.MODE_PRIVATE)

    val set = mutableSetOf<String>()
    for (i in 0 until days.size()) {
        set.add(days.getString(i)!!)
    }

    prefs.edit().putStringSet("${pkg}_days", set).apply()
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

    // 1. Remove from locked_apps set
    val locked = prefs.getStringSet("locked_apps", mutableSetOf())?.toMutableSet() ?: mutableSetOf()
    locked.remove(pkg)
    prefs.edit().putStringSet("locked_apps", locked).apply()

    // 2. Remove timer for this pkg
    prefs.edit().remove(pkg).apply()

    // 3. Tell AppMonitor to stop blocking this pkg
    AppMonitor.relockApp(pkg) // reuses your existing relock logic to dismiss overlay
}
    @ReactMethod
    fun openAccessibilitySettings() {
        val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        reactContext.startActivity(intent)
    }

    @ReactMethod
    fun requestOverlayPermission() {
        val intent = Intent(
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
        val appOps = reactContext.getSystemService(Context.APP_OPS_SERVICE) as android.app.AppOpsManager
        val mode = appOps.checkOpNoThrow(
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
        val enabled = Settings.Secure.getInt(
            reactContext.contentResolver,
            Settings.Secure.ACCESSIBILITY_ENABLED
        ) == 1

        if (!enabled) {
            promise.resolve(false)
            return
        }

        val services = Settings.Secure.getString(
            reactContext.contentResolver,
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        ) ?: ""

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



}