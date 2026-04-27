import SwiftUI
import ManagedSettings

struct UnlockView: View {

    @State var a = 0
    @State var b = 0
    @State var op = "+"
    @State var correctAns = 0
    @State var options: [Int] = []
    @State var errorMessage = ""

    // 🔥 Read difficulty from App Group UserDefaults (shared with extensions)
    let difficulty: String

    @Environment(\.dismiss) var dismiss

    init() {
        let defaults = UserDefaults(suiteName: "group.com.appblocker")
        self.difficulty = defaults?.string(forKey: "math_difficulty") ?? "Easy"
    }

    var body: some View {
        VStack(spacing: 16) {
            Text("🔐")
                .font(.system(size: 48))

            Text("Solve to Unlock")
                .font(.title2.bold())

            Text("Difficulty: \(difficulty)")
                .font(.caption)
                .foregroundColor(.secondary)

            Text("\(a) \(op) \(b) = ?")
                .font(.system(size: 40, weight: .bold))
                .padding()

            ForEach(options, id: \.self) { opt in
                Button(action: {
                    if opt == correctAns {
                        // ✅ Correct — remove shield
                        let store = ManagedSettingsStore()
                        store.shield.applications = nil
                        store.shield.applicationCategories = nil
                        dismiss()
                    } else {
                        // ❌ Wrong — regenerate question
                        errorMessage = "❌ Wrong answer! Try again."
                        generateMath()
                    }
                }) {
                    Text("\(opt)")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.black)
                        .foregroundColor(.white)
                        .cornerRadius(12)
                }
            }

            if !errorMessage.isEmpty {
                Text(errorMessage)
                    .foregroundColor(.red)
                    .font(.caption)
            }
        }
        .padding()
        .onAppear {
            generateMath()
        }
    }

    func generateMath() {
        errorMessage = ""

        if difficulty == "Easy" {
            a = Int.random(in: 1...20)
            b = Int.random(in: 1...20)
            correctAns = a + b
            op = "+"
        } else if difficulty == "Medium" {
            let isSub = Bool.random()
            a = Int.random(in: 10...100)
            b = Int.random(in: 10...100)
            if isSub {
                if a < b { swap(&a, &b) }
                correctAns = a - b
                op = "-"
            } else {
                correctAns = a + b
                op = "+"
            }
        } else {
            a = Int.random(in: 10...40)
            b = Int.random(in: 2...10)
            correctAns = a * b
            op = "×"
        }

        let wrong1 = correctAns + Int.random(in: 1...10)
        let wrong2 = correctAns - Int.random(in: 1...5)

        options = [correctAns, wrong1, wrong2].shuffled()
    }
}