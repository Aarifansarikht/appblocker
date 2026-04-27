//
//  DeviceActivityMonitorExtension.swift
//  DeviceActivityMonitor
//
//  Created by Arun Saini on 27/04/26.
//

import DeviceActivity
import ManagedSettings
import FamilyControls
import Foundation

// 🔥 This extension runs in a SEPARATE PROCESS from the main app.
// It uses App Groups (group.com.appblocker) to share data with the main app.
class DeviceActivityMonitorExtension: DeviceActivityMonitor {

    let store = ManagedSettingsStore()

    override func intervalDidStart(for activity: DeviceActivityName) {
        super.intervalDidStart(for: activity)
        // Timer started — apps are FREE to use
        print("⏱ DeviceActivity interval started: \(activity.rawValue)")
    }

    override func intervalDidEnd(for activity: DeviceActivityName) {
        super.intervalDidEnd(for: activity)

        // 🔒 Timer ended — BLOCK the selected apps
        let defaults = UserDefaults(suiteName: "group.com.appblocker")

        if let data = defaults?.data(forKey: "saved_family_activity_selection"),
           let selection = try? JSONDecoder().decode(FamilyActivitySelection.self, from: data) {

            let appTokens = selection.applicationTokens
            let categoryTokens = selection.categoryTokens

            store.shield.applications = appTokens.isEmpty ? nil : appTokens
            store.shield.applicationCategories = categoryTokens.isEmpty ? nil : .specific(categoryTokens)

            print("🔒 DeviceActivity: Shield applied — Apps: \(appTokens.count), Categories: \(categoryTokens.count)")
        } else {
            print("❌ DeviceActivity: No saved selection found in App Group UserDefaults")
        }
    }

    override func eventDidReachThreshold(_ event: DeviceActivityEvent.Name, activity: DeviceActivityName) {
        super.eventDidReachThreshold(event, activity: activity)

        // 🔒 Usage threshold reached — re-shield this app
        let defaults = UserDefaults(suiteName: "group.com.appblocker")

        if let data = defaults?.data(forKey: "saved_family_activity_selection"),
           let selection = try? JSONDecoder().decode(FamilyActivitySelection.self, from: data) {

            store.shield.applications = selection.applicationTokens.isEmpty ? nil : selection.applicationTokens
            store.shield.applicationCategories = selection.categoryTokens.isEmpty ? nil : .specific(selection.categoryTokens)

            print("🔒 DeviceActivity: Event threshold reached — shield re-applied")
        }
    }
}
