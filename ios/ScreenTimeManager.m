//
//  ScreenTimeManager.m
//  appblocker
//
//  Created by Arun Saini on 24/04/26.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ScreenTimeManager, NSObject)

RCT_EXTERN_METHOD(requestPermission)
RCT_EXTERN_METHOD(openAppPicker)
RCT_EXTERN_METHOD(startMonitoring:(nonnull NSNumber *)seconds)
RCT_EXTERN_METHOD(unlockApps)
RCT_EXTERN_METHOD(openUnlockScreen)
RCT_EXTERN_METHOD(setDifficulty:(NSString *)level)
RCT_EXTERN_METHOD(stopBlocking)

@end
