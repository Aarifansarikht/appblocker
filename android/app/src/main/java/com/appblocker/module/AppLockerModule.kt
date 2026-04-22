package com.appblocker.module

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.provider.Settings

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.appblocker.service.AppMonitor

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
    val pm = reactContext.packageManager

    val intent = Intent(Intent.ACTION_MAIN, null)
    intent.addCategory(Intent.CATEGORY_LAUNCHER)

    val resolveInfoList = pm.queryIntentActivities(intent, 0)

    val list = Arguments.createArray()

    for (resolveInfo in resolveInfoList) {
        val pkg = resolveInfo.activityInfo.packageName
        val name = resolveInfo.loadLabel(pm).toString()

        val map = Arguments.createMap()
        map.putString("name", name)
        map.putString("package", pkg)

        list.pushMap(map)
    }

    promise.resolve(list)
}

    @ReactMethod
    fun saveLockedApps(apps: ReadableArray) {
        val prefs = reactContext.getSharedPreferences("LOCKER", Context.MODE_PRIVATE)
        val set = mutableSetOf<String>()

        for (i in 0 until apps.size()) {
            set.add(apps.getString(i)!!)
        }

        prefs.edit().putStringSet("locked_apps", set).apply()
    }

    @ReactMethod
    fun setAppTimer(pkg: String, seconds: Int) {
        val prefs = reactContext.getSharedPreferences("LOCKER", Context.MODE_PRIVATE)
        prefs.edit().putLong(pkg, seconds * 1000L).apply()
    }

    @ReactMethod
    fun relockApp(pkg: String) {
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
        val intent = Intent(
            Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
            Uri.parse("package:${reactContext.packageName}")
        )
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        reactContext.startActivity(intent)
    }
}