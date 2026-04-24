import SwiftUI
import FamilyControls

struct AppPickerView: View {

    @State private var selection = FamilyActivitySelection()

    var body: some View {
        VStack {
            Text("Select Apps")
                .font(.headline)

            FamilyActivityPicker(selection: $selection)
                .frame(height: 400)

            Button("Save Selection") {
                SharedModel.shared.selectedApps = selection.applicationTokens
            }
            .padding()
        }
    }
}