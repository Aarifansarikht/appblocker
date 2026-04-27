//
//  ShieldActionExtension.swift
//  ShieldConfiguration
//
//  Created by Arun Saini on 27/04/26.
//

import ManagedSettings
import UIKit

// Handle button taps on the custom shield view.
// "Open AppBlocker" primary button → close the blocked app (user then opens AppBlocker manually)
// "Close" secondary button → defer (keeps the shield visible)
class ShieldActionExtension: ShieldActionDelegate {

    override func handle(action: ShieldAction, for application: ApplicationToken, completionHandler: @escaping (ShieldActionResponse) -> Void) {
        switch action {
        case .primaryButtonPressed:
            // Close the blocked app — user will then open AppBlocker to solve the challenge
            completionHandler(.close)
        case .secondaryButtonPressed:
            // Keep the shield displayed
            completionHandler(.defer)
        @unknown default:
            completionHandler(.close)
        }
    }

    override func handle(action: ShieldAction, for webDomain: WebDomainToken, completionHandler: @escaping (ShieldActionResponse) -> Void) {
        switch action {
        case .primaryButtonPressed:
            completionHandler(.close)
        case .secondaryButtonPressed:
            completionHandler(.defer)
        @unknown default:
            completionHandler(.close)
        }
    }

    override func handle(action: ShieldAction, for category: ActivityCategoryToken, completionHandler: @escaping (ShieldActionResponse) -> Void) {
        switch action {
        case .primaryButtonPressed:
            completionHandler(.close)
        case .secondaryButtonPressed:
            completionHandler(.defer)
        @unknown default:
            completionHandler(.close)
        }
    }
}
