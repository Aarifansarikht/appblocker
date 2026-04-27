//
//  SharedModel.swift
//  appblocker
//
//  Created by Arun Saini on 24/04/26.
//

import FamilyControls
import ManagedSettings
import Foundation

// 🔥 CRITICAL: Uses App Groups UserDefaults so ALL extensions can access the same data
// Main app + ShieldConfiguration + ShieldAction + DeviceActivityMonitor ALL share this data

let appGroupID = "group.com.appblocker"

class SharedModel: ObservableObject {
    static let shared = SharedModel()

    @Published var selection = FamilyActivitySelection() {
        didSet {
            saveSelection()
        }
    }

    private let userDefaultsKey = "saved_family_activity_selection"
    private let timerDurationKey = "saved_timer_duration"
    private let difficultyKey = "math_difficulty"

    // 🔥 Use App Group UserDefaults — shared across main app + all extensions
    private let defaults = UserDefaults(suiteName: appGroupID)

    init() {
        loadSelection()
    }

    func saveSelection() {
        if let data = try? JSONEncoder().encode(selection) {
            defaults?.set(data, forKey: userDefaultsKey)
        }
    }

    func loadSelection() {
        if let data = defaults?.data(forKey: userDefaultsKey),
           let savedSelection = try? JSONDecoder().decode(FamilyActivitySelection.self, from: data) {
            selection = savedSelection
        }
    }

    // 💾 Save timer duration (for interval restart from extensions)
    func saveTimerDuration(_ seconds: Int) {
        defaults?.set(seconds, forKey: timerDurationKey)
    }

    func getTimerDuration() -> Int {
        return defaults?.integer(forKey: timerDurationKey) ?? 60
    }

    // 💾 Save/Get math difficulty
    func saveDifficulty(_ level: String) {
        defaults?.set(level, forKey: difficultyKey)
    }

    func getDifficulty() -> String {
        return defaults?.string(forKey: difficultyKey) ?? "Easy"
    }
}
