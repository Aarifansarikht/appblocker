import SwiftUI

struct UnlockView: View {

    @State var a = Int.random(in: 1...10)
    @State var b = Int.random(in: 1...10)

    var body: some View {
        VStack {
            Text("Solve to Unlock")

            Text("\(a) + \(b) = ?")
                .font(.largeTitle)

            ForEach(generateOptions(), id: \.self) { opt in
                Button("\(opt)") {
                    if opt == a + b {
                        ScreenTimeManager().unlockApps()
                    } else {
                        a = Int.random(in: 1...10)
                        b = Int.random(in: 1...10)
                    }
                }
            }
        }
    }

    func generateOptions() -> [Int] {
        let correct = a + b
        return [correct, correct + 1, correct - 1].shuffled()
    }
}