import ManagedSettings
import ManagedSettingsUI
import UIKit

// 🛡️ CUSTOM SHIELD SCREEN
// Customises the "Restricted" screen that iOS shows when a blocked app is opened.
//
// Based on: https://pedroesli.com/2023-11-13-screen-time-api/
// And: https://medium.com/@B4k3R/creating-a-screentime-shieldconfigurationdatasource-for-ios-familycontrols-api-5ca1079d3188

class ShieldConfigurationExtension: ShieldConfigurationDataSource {

    // 🔒 Shield for individual apps
    override func configuration(shielding application: Application) -> ShieldConfiguration {

        let appName = application.localizedDisplayName ?? "this app"

        return ShieldConfiguration(
            backgroundBlurStyle: .light,
            backgroundColor: UIColor.black.withAlphaComponent(0.9),
            icon: UIImage(systemName: "lock.shield.fill"),
            title: ShieldConfiguration.Label(
                text: "App Blocker",
                color: .white
            ),
            subtitle: ShieldConfiguration.Label(
                text: "App Blocker blocked \(appName). Solve the Math Question to continue using \(appName).",
                color: .lightGray
            ),
            primaryButtonLabel: ShieldConfiguration.Label(
                text: "Open AppBlocker",
                color: .white
            ),
            primaryButtonBackgroundColor: .systemBlue,
            secondaryButtonLabel: ShieldConfiguration.Label(
                text: "Close",
                color: .systemGray
            )
        )
    }

    // 🔒 Shield for app categories
    override func configuration(shielding application: Application, in category: ActivityCategory) -> ShieldConfiguration {

        return ShieldConfiguration(
            backgroundBlurStyle: .light,
            backgroundColor: UIColor.black.withAlphaComponent(0.9),
            icon: UIImage(systemName: "lock.shield.fill"),
            title: ShieldConfiguration.Label(
                text: "App Blocker",
                color: .white
            ),
            subtitle: ShieldConfiguration.Label(
                text: "App Blocker blocked this app. Solve the Math Question to continue.",
                color: .lightGray
            ),
            primaryButtonLabel: ShieldConfiguration.Label(
                text: "Open AppBlocker",
                color: .white
            ),
            primaryButtonBackgroundColor: .systemBlue,
            secondaryButtonLabel: ShieldConfiguration.Label(
                text: "Close",
                color: .systemGray
            )
        )
    }

    // 🔒 Shield for web domains
    override func configuration(shielding webDomain: WebDomain) -> ShieldConfiguration {
        return ShieldConfiguration(
            backgroundBlurStyle: .light,
            backgroundColor: UIColor.black.withAlphaComponent(0.9),
            icon: UIImage(systemName: "lock.shield.fill"),
            title: ShieldConfiguration.Label(
                text: "App Blocker",
                color: .white
            ),
            subtitle: ShieldConfiguration.Label(
                text: "This website is blocked by App Blocker. Solve the Math Question to continue.",
                color: .lightGray
            ),
            primaryButtonLabel: ShieldConfiguration.Label(
                text: "Open AppBlocker",
                color: .white
            ),
            primaryButtonBackgroundColor: .systemBlue,
            secondaryButtonLabel: ShieldConfiguration.Label(
                text: "Close",
                color: .systemGray
            )
        )
    }
}
