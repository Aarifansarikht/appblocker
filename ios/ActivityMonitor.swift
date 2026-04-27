//
//  ActivityMonitor.swift
//  appblocker
//
//  Created by Arun Saini on 24/04/26.
//

import DeviceActivity
import ManagedSettings
import UserNotifications

class ActivityMonitor: DeviceActivityMonitor {

    let store = ManagedSettingsStore()

    override func intervalDidEnd(for activity: DeviceActivityName) {
        super.intervalDidEnd(for: activity)

        // 🔥 BLOCK SELECTED APPS
        store.shield.applications = SharedModel.shared.selection.applicationTokens
        store.shield.applicationCategories = .specific(SharedModel.shared.selection.categoryTokens)

        // 📢 Send local notification to inform user
        sendLockNotification()
    }

    // 📢 Send notification when apps are locked
    private func sendLockNotification() {
        let content = UNMutableNotificationContent()
        content.title = "🔒 Time's Up!"
        content.body = "Your app usage time has expired. Open AppBlocker and solve the challenge to unlock."
        content.sound = .default
        content.categoryIdentifier = "APP_LOCKED"

        let request = UNNotificationRequest(
            identifier: "app_locked_\(Date().timeIntervalSince1970)",
            content: content,
            trigger: nil // deliver immediately
        )

        UNUserNotificationCenter.current().add(request) { error in
            if let error = error {
                print("❌ Failed to send lock notification: \(error)")
            }
        }
    }
}
