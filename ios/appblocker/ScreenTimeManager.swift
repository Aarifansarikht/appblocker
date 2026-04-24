import Foundation
import FamilyControls
import DeviceActivity
import ManagedSettings
import SwiftUI

@objc(ScreenTimeManager)
class ScreenTimeManager: NSObject {

    let store = ManagedSettingsStore()

    static func moduleName() -> String! {
        return "ScreenTimeManager"
    }

    static func requiresMainQueueSetup() -> Bool {
        return true
    }

    // 🔐 Permission
    @objc
    func requestPermission() {
        Task {
            try? await AuthorizationCenter.shared.requestAuthorization(for: .individual)
        }
    }

    // 📱 Picker
    @objc
    func openAppPicker() {
        DispatchQueue.main.async {
            let vc = UIHostingController(rootView: AppPickerView())
            UIApplication.shared.windows.first?.rootViewController?.present(vc, animated: true)
        }
    }

    // 🚀 START TIMER SESSION
    @objc
    func startMonitoring(_ seconds: NSNumber) {

        let duration = seconds.intValue

        let now = Date()
        let end = Calendar.current.date(byAdding: .second, value: duration, to: now)!

        let start = Calendar.current.dateComponents([.hour, .minute, .second], from: now)
        let finish = Calendar.current.dateComponents([.hour, .minute, .second], from: end)

        let schedule = DeviceActivitySchedule(
            intervalStart: start,
            intervalEnd: finish,
            repeats: false
        )

        try? DeviceActivityCenter().startMonitoring(
            DeviceActivityName("session"),
            during: schedule
        )
    }

    // 🔓 Unlock
    @objc
    func unlockApps() {
        store.shield.applications = nil
    }
    @objc
func openUnlockScreen() {
    DispatchQueue.main.async {
        let vc = UIHostingController(rootView: UnlockView())
        UIApplication.shared.windows.first?.rootViewController?.present(vc, animated: true)
    }
}
}