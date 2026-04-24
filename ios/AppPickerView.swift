import SwiftUI
import FamilyControls
import ManagedSettings

struct AppPickerView: View {
    @State private var selection = FamilyActivitySelection()
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
        // 1. Save to your SharedModel for internal logic
        SharedModel.shared.selectedApps = selection.applicationTokens
        
        // 2. APPLY THE SHIELD (This is what actually blocks the apps)
        let store = ManagedSettingsStore()
        store.shield.applications = selection.applicationTokens
        store.shield.applicationCategories = .specific(selection.categoryTokens)
        
        // 3. Close the screen
        dismiss()
    }
}
