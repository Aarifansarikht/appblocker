import FamilyControls

class SharedModel {
    static let shared = SharedModel()

    var selectedApps: Set<ApplicationToken> = []
}