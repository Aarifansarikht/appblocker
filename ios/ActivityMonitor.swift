//
//  ActivityMonitor.swift
//  appblocker
//
//  Created by Arun Saini on 24/04/26.
//

import DeviceActivity
import ManagedSettings

class ActivityMonitor: DeviceActivityMonitor {

    let store = ManagedSettingsStore()

    override func intervalDidEnd(for activity: DeviceActivityName) {
        super.intervalDidEnd(for: activity)

        // 🔥 BLOCK SELECTED APPS
        store.shield.applications = SharedModel.shared.selectedApps
    }
}
