import SwiftUI
import FamilyControls
import ManagedSettings

struct AppPickerView: View {
    @State private var selection = SharedModel.shared.selection
    @Environment(\.dismiss) var dismiss // Adds the ability to close the modal

    var body: some View {
        NavigationView { // Wrapping in NavigationView helps with picker rendering
            VStack {
                // Remove the .frame(height: 400) to allow the picker to expand
                FamilyActivityPicker(selection: $selection)
                
                Button(action: {
                    saveSelection()
                }) {
                    Text("Save Selection")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }
                .padding()
            }
            .navigationTitle("Select Apps")
            .navigationBarTitleDisplayMode(.inline)
        }
    }

    func saveSelection() {
        SharedModel.shared.selection = selection
        // Close the screen
        dismiss()
    }
}
