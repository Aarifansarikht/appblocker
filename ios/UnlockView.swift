//
//  UnlockView.swift
//  appblocker
//
//  Created by Arun Saini on 24/04/26.
//

import SwiftUI
import FamilyControls // For selection types
import ManagedSettings // <--- ADD THIS LINE

struct UnlockView: View {
    @State var a = Int.random(in: 1...10)
    @State var b = Int.random(in: 1...10)
    
    // 1. Add the dismiss environment
    @Environment(\.dismiss) var dismiss

    var body: some View {
        VStack(spacing: 20) {
            Text("Solve to Unlock")
                .font(.headline)

            Text("\(a) + \(b) = ?")
                .font(.system(size: 50, weight: .bold))

            ForEach(generateOptions(), id: \.self) { opt in
                Button(action: {
                    checkAnswer(opt)
                }) {
                    Text("\(opt)")
                        .frame(width: 200)
                        .padding()
                        .background(Color.blue.opacity(0.1))
                        .cornerRadius(10)
                }
            }
        }
    }

    func checkAnswer(_ opt: Int) {
        if opt == a + b {
            // 2. Clear the shield directly here
            let store = ManagedSettingsStore()
            store.shield.applications = nil
            store.shield.applicationCategories = nil
            
            // 3. Close this screen
            dismiss()
        } else {
            // Wrong answer - reset puzzle
            a = Int.random(in: 1...10)
            b = Int.random(in: 1...10)
        }
    }

    func generateOptions() -> [Int] {
        let correct = a + b
        // Use a Set to ensure all 3 options are unique
        var options = Set<Int>([correct, correct + 1, correct - 1])
        while options.count < 3 {
            options.insert(Int.random(in: 2...20))
        }
        return Array(options).shuffled()
    }
}
