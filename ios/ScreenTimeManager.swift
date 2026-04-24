//
//  ScreenTimeManager.swift
//  appblocker
//
//  Created by Arun Saini on 24/04/26.
//

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
  @objc func requestPermission() {
          Task {
              do {
                if #available(iOS 16.0, *) {
                  try await AuthorizationCenter.shared.requestAuthorization(for: .individual)
                } else {
                  // Fallback on earlier versions
                }
              } catch {
                  print("Failed to authorize: \(error)")
              }
          }
      }

    // 📱 Picker
@objc func openAppPicker() {
    DispatchQueue.main.async {
        let picker = AppPickerView()
        let vc = UIHostingController(rootView: picker)
        
        // Ensures the picker looks like a native iOS modal
        vc.modalPresentationStyle = .pageSheet 
        
        if let rootVC = UIApplication.shared.windows.first?.rootViewController {
            rootVC.present(vc, animated: true)
        }
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

  @objc func unlockApps() {
          // Direct unlock from JS
          store.shield.applications = nil
          store.shield.applicationCategories = nil
      }

      @objc func openUnlockScreen() {
          DispatchQueue.main.async {
              let vc = UIHostingController(rootView: UnlockView())
              
              // USE THIS HELPER instead of windows.first
              if let topController = self.getTopViewController() {
                  // Allows the puzzle to slide up over the current screen
                  vc.modalPresentationStyle = .fullScreen
                  topController.present(vc, animated: true)
              }
          }
      }

      // Critical helper for React Native apps with multiple modals
      private func getTopViewController() -> UIViewController? {
          var topController = UIApplication.shared.windows.first?.rootViewController
          while let presented = topController?.presentedViewController {
              topController = presented
          }
          return topController
      }
}
