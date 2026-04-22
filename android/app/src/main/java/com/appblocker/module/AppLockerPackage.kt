package com.appblocker.module

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.*
import com.facebook.react.uimanager.ViewManager

class AppLockerPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext)
        = listOf(AppLockerModule(reactContext))

    override fun createViewManagers(reactContext: ReactApplicationContext)
        = emptyList<ViewManager<*, *>>()
}