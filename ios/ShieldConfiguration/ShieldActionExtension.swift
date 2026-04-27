//
//  ShieldActionExtension.swift
//  ShieldConfiguration
//
//  Created by Arun Saini on 27/04/26.
//

import ManagedSettings
import UIKit
import UserNotifications

// Handle button taps on the custom shield view.
// "Open AppBlocker" primary button posts a notification that opens AppBlocker when tapped,
// then closes the blocked app. iOS does not expose a public API to directly launch the
// containing app from a ShieldAction extension.
// "Close" secondary button keeps the shield visible.
class ShieldActionExtension: ShieldActionDelegate {

    override func handle(action: ShieldAction, for application: ApplicationToken, completionHandler: @escaping (ShieldActionResponse) -> Void) {
        handle(action: action, completionHandler: completionHandler)
    }

    override func handle(action: ShieldAction, for webDomain: WebDomainToken, completionHandler: @escaping (ShieldActionResponse) -> Void) {
        handle(action: action, completionHandler: completionHandler)
    }

    override func handle(action: ShieldAction, for category: ActivityCategoryToken, completionHandler: @escaping (ShieldActionResponse) -> Void) {
        handle(action: action, completionHandler: completionHandler)
    }

    private func handle(action: ShieldAction, completionHandler: @escaping (ShieldActionResponse) -> Void) {
        switch action {
        case .primaryButtonPressed:
            postOpenAppBlockerNotification()
            completionHandler(.close)
        case .secondaryButtonPressed:
            completionHandler(.defer)
        @unknown default:
            completionHandler(.close)
        }
    }

    private func postOpenAppBlockerNotification() {
        let content = UNMutableNotificationContent()
        content.title = "Open AppBlocker"
        content.body = "Tap to solve the challenge and unlock your apps."
        content.sound = .default

        let request = UNNotificationRequest(
            identifier: "open_appblocker_from_shield",
            content: content,
            trigger: nil
        )

        UNUserNotificationCenter.current().add(request, withCompletionHandler: nil)
    }
}
