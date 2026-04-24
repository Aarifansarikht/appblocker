//
//  SharedModel.swift
//  appblocker
//
//  Created by Arun Saini on 24/04/26.
//

import FamilyControls
import ManagedSettings

class SharedModel {
    static let shared = SharedModel()

    var selectedApps: Set<ApplicationToken> = []
}
