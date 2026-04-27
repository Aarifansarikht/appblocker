import Foundation
import FamilyControls
import DeviceActivity
import ManagedSettings
import SwiftUI
import UserNotifications

@objc(ScreenTimeManager)
class ScreenTimeManager: NSObject {

    static let shared = ScreenTimeManager()

    let store = ManagedSettingsStore()
    private var backgroundTask: UIBackgroundTaskIdentifier = .invalid
    private var blockWorkItem: DispatchWorkItem?

    // 🔁 INTERVAL TIMER: Save duration for auto-restart after unlock
    private var savedDuration: Int = 0
    private var isIntervalActive: Bool = false
    private let sharedDefaults = UserDefaults(suiteName: "group.com.appblocker")
    private let appsLockedKey = "apps_are_locked"
    private let timerDurationKey = "saved_timer_duration"
    private let intervalActiveKey = "interval_blocking_active"
    private let sessionActivityName = DeviceActivityName("session")

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
          if #available(iOS 16.0, *) {
            try? await AuthorizationCenter.shared.requestAuthorization(for: .individual)
          } else {
            // Fallback on earlier versions
          }
        }

        // 📢 Also request notification permission
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
            if let error = error {
                print("❌ Notification permission error: \(error)")
            }
            print("📢 Notification permission granted: \(granted)")
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

    // 🚀 START TIMER SESSION — blocks apps INSTANTLY after timer expires
    @objc
    func startMonitoring(_ seconds: NSNumber) {

        let duration = seconds.intValue
        guard duration > 0 else {
            print("❌ Timer not started — invalid duration: \(duration)")
            return
        }

        // 💾 Save duration for interval restart
        savedDuration = duration
        isIntervalActive = true
        sharedDefaults?.set(duration, forKey: timerDurationKey)
        sharedDefaults?.set(true, forKey: intervalActiveKey)

        // ❌ Cancel any previous work
        blockWorkItem?.cancel()
        blockWorkItem = nil
        endBackgroundTask()
        DeviceActivityCenter().stopMonitoring([sessionActivityName])
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: ["timer_expired"])

        // ✅ DeviceActivity monitoring (backup if extension exists)
        let now = Date()
        let end = Calendar.current.date(byAdding: .second, value: duration, to: now)!

        let start = Calendar.current.dateComponents([.hour, .minute, .second], from: now)
        let finish = Calendar.current.dateComponents([.hour, .minute, .second], from: end)

        let schedule = DeviceActivitySchedule(
            intervalStart: start,
            intervalEnd: finish,
            repeats: false
        )

        do {
            try DeviceActivityCenter().startMonitoring(sessionActivityName, during: schedule)
        } catch {
            print("❌ Failed to start DeviceActivity monitoring: \(error)")
        }

        // 🔥 REQUEST BACKGROUND EXECUTION — keeps app alive after user switches away
        backgroundTask = UIApplication.shared.beginBackgroundTask(withName: "AppBlockerTimer") { [weak self] in
            // System is about to kill our background time — apply shield NOW
            self?.applyShield()
            self?.endBackgroundTask()
        }

        // 🔥 SCHEDULE INSTANT SHIELD APPLICATION
        let workItem = DispatchWorkItem { [weak self] in
            self?.applyShield()
            self?.endBackgroundTask()
        }
        blockWorkItem = workItem

        DispatchQueue.global(qos: .userInitiated).asyncAfter(
            deadline: .now() + Double(duration),
            execute: workItem
        )

        // 📢 Schedule notification for when timer expires
        scheduleTimerNotification(seconds: duration)

        print("✅ Timer started: \(duration) seconds. Interval mode: ON")
    }

    // 🔒 Apply shield to block selected apps — INSTANT
    private func applyShield() {
        let selection = SharedModel.shared.selection

        let appTokens = selection.applicationTokens
        let categoryTokens = selection.categoryTokens

        print("🔒 BLOCKING NOW — Apps: \(appTokens.count), Categories: \(categoryTokens.count)")

        // Apply shield to apps
        store.shield.applications = appTokens

        // Apply shield to categories
        if !categoryTokens.isEmpty {
            store.shield.applicationCategories = .specific(categoryTokens)
        }

        sharedDefaults?.set(!appTokens.isEmpty || !categoryTokens.isEmpty, forKey: appsLockedKey)

        // Send immediate notification
        sendLockNotification()

        print("✅ Shield applied — apps are now blocked")
    }

    @objc
    func isAppsLocked(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        resolve(sharedDefaults?.bool(forKey: appsLockedKey) ?? false)
    }

    // 🔄 End background task
    private func endBackgroundTask() {
        if backgroundTask != .invalid {
            UIApplication.shared.endBackgroundTask(backgroundTask)
            backgroundTask = .invalid
        }
    }

    // ⚙️ Save Difficulty — uses App Group so extensions can read it
    @objc
    func setDifficulty(_ level: String) {
        sharedDefaults?.set(level, forKey: "math_difficulty")
    }

    // 🔓 Unlock — removes shield and AUTO-RESTARTS timer for next interval
    @objc
    func unlockApps() {
        store.shield.applications = nil
        store.shield.applicationCategories = nil
        sharedDefaults?.set(false, forKey: appsLockedKey)

        // Cancel pending block timer
        blockWorkItem?.cancel()
        blockWorkItem = nil
        endBackgroundTask()

        print("✅ Apps unlocked — shield removed")

        // 🔁 AUTO-RESTART: If interval is active, start next timer cycle
        let persistedIntervalActive = sharedDefaults?.bool(forKey: intervalActiveKey) ?? false
        let restartDuration = savedDuration > 0 ? savedDuration : (sharedDefaults?.integer(forKey: timerDurationKey) ?? 0)

        if (isIntervalActive || persistedIntervalActive) && restartDuration > 0 {
            print("🔁 Interval timer: Starting next cycle (\(restartDuration)s)")
            startMonitoring(NSNumber(value: restartDuration))
        }
    }

    // 🛑 STOP BLOCKING — completely stops the interval cycle
    @objc
    func stopBlocking() {
        // Stop interval
        isIntervalActive = false
        savedDuration = 0
        sharedDefaults?.set(false, forKey: intervalActiveKey)
        sharedDefaults?.removeObject(forKey: timerDurationKey)

        // Remove shield
        store.shield.applications = nil
        store.shield.applicationCategories = nil
        sharedDefaults?.set(false, forKey: appsLockedKey)

        // Cancel pending timer
        blockWorkItem?.cancel()
        blockWorkItem = nil
        endBackgroundTask()

        // Stop DeviceActivity monitoring
        DeviceActivityCenter().stopMonitoring([sessionActivityName])

        // Cancel pending notifications
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: ["timer_expired"])

        print("🛑 Blocking stopped completely — interval cycle ended")
    }

    // 🧠 OPEN UNLOCK SCREEN (MATH CHALLENGE)
    @objc
    func openUnlockScreen() {
        DispatchQueue.main.async {
            guard self.sharedDefaults?.bool(forKey: self.appsLockedKey) == true else {
                return
            }

            guard let rootViewController = UIApplication.shared.windows.first?.rootViewController else {
                return
            }

            if rootViewController.presentedViewController?.view.accessibilityIdentifier == "UnlockView" {
                return
            }

            let vc = UIHostingController(rootView: UnlockView())
            vc.view.accessibilityIdentifier = "UnlockView"
            rootViewController.present(vc, animated: true)
        }
    }

    // 📢 Schedule notification for when timer expires
    private func scheduleTimerNotification(seconds: Int) {
        let content = UNMutableNotificationContent()
        content.title = "🔒 Time's Up!"
        content.body = "Your app usage time has expired. Open AppBlocker and solve the challenge to unlock."
        content.sound = .default
        content.categoryIdentifier = "APP_LOCKED"

        let trigger = UNTimeIntervalNotificationTrigger(
            timeInterval: TimeInterval(seconds),
            repeats: false
        )

        let request = UNNotificationRequest(
            identifier: "timer_expired",
            content: content,
            trigger: trigger
        )

        UNUserNotificationCenter.current().add(request) { error in
            if let error = error {
                print("❌ Failed to schedule notification: \(error)")
            }
        }
    }

    // 📢 Send lock notification immediately
    private func sendLockNotification() {
        let content = UNMutableNotificationContent()
        content.title = "🔒 Apps Blocked"
        content.body = "Open AppBlocker and solve the math challenge to unlock your apps."
        content.sound = .default

        let request = UNNotificationRequest(
            identifier: "app_locked_now",
            content: content,
            trigger: nil
        )

        UNUserNotificationCenter.current().add(request, withCompletionHandler: nil)
    }
}
