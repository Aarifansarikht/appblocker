import SwiftUI
import ManagedSettings

struct UnlockView: View {

    @State var a = 0
    @State var b = 0
    @State var op = "+"
    @State var correctAns = 0
    @State var options: [Int] = []
    
    let difficulty = UserDefaults.standard.string(forKey: "math_difficulty") ?? "Easy"
    
    @Environment(\.dismiss) var dismiss

    var body: some View {
        VStack {
            Text("Solve to Unlock")
                .font(.headline)

            Text("\(a) \(op) \(b) = ?")
                .font(.largeTitle)
                .padding()

            ForEach(options, id: \.self) { opt in
                Button(action: {
                    if opt == correctAns {
                        let store = ManagedSettingsStore()
                        store.shield.applications = nil
                        store.shield.applicationCategories = nil
                        dismiss()
                    } else {
                        generateMath()
                    }
                }) {
                    Text("\(opt)")
                        .frame(minWidth: 100)
                        .padding()
                        .background(Color.black)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                }
                .padding(.bottom, 5)
            }
        }
        .onAppear {
            generateMath()
        }
    }

    func generateMath() {
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