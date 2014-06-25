//
//  Copyright 2010 Mirasense AG
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//
//
//  ScanditSDKRotatingBarcodePicker is a utility class in the demo that shows how to make the
//  ScanditSDKBarcodePicker properly change its orientation when the device is rotated by the
//  user. This class is not required when the Scandit SDK is used in portrait mode only.
//

#import "ScanditSDKRotatingBarcodePicker.h"
#import "ScanditSDKOverlayController.h"
#import <objc/runtime.h>


@interface ScanditSDKBarcodePicker (extended)
- (id)initWithAppKey:(NSString *)scanditSDKAppKey
cameraFacingPreference:(CameraFacingDirection)facing
  runningOnFramework:(NSString *)usedFramework;
@end

@interface ScanditSDKRotatingBarcodePicker() {
	NSArray *allowedOrientations;
}

@property (nonatomic, retain) NSArray *allowedOrientations;

@end



@implementation ScanditSDKRotatingBarcodePicker

@synthesize allowedOrientations;


- (id)initWithAppKey:(NSString *)scanditSDKAppKey
cameraFacingPreference:(CameraFacingDirection)facing
        orientations:(NSArray *)orientations {
    
    if (self = [super initWithAppKey:scanditSDKAppKey cameraFacingPreference:facing runningOnFramework:@"phonegap"]) {
		self.allowedOrientations = orientations;
	}
    
    return self;
}

- (void)willRotateToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation
                                duration:(NSTimeInterval)duration {
    // If this function is overriden, don't forget to call the super view first.
    [super willRotateToInterfaceOrientation:toInterfaceOrientation duration:duration];
}

- (NSUInteger)supportedInterfaceOrientations {
    NSArray *orientations;
	
	if (!self.allowedOrientations) {
		// Use the orientations from the project settings.
		if (UI_USER_INTERFACE_IDIOM() != UIUserInterfaceIdiomPad) {
			orientations = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"UISupportedInterfaceOrientations"];
		} else {
			orientations = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"UISupportedInterfaceOrientations"];
		}
	} else {
		// Use the user specified orientations.
		orientations = self.allowedOrientations;
	}
	
    NSUInteger supportedOrientations = 0;
    
    if ([orientations containsObject:@"UIInterfaceOrientationPortrait"]) {
        supportedOrientations = supportedOrientations | (1 << UIInterfaceOrientationPortrait);
    }
    if ([orientations containsObject:@"UIInterfaceOrientationPortraitUpsideDown"]) {
        supportedOrientations = supportedOrientations | (1 << UIInterfaceOrientationPortraitUpsideDown);
    }
    if ([orientations containsObject:@"UIInterfaceOrientationLandscapeLeft"]) {
        supportedOrientations = supportedOrientations | (1 << UIInterfaceOrientationLandscapeLeft);
    }
    if ([orientations containsObject:@"UIInterfaceOrientationLandscapeRight"]) {
        supportedOrientations = supportedOrientations | (1 << UIInterfaceOrientationLandscapeRight);
    }
    
    return supportedOrientations;
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation {
    NSArray *orientations;
	
	if (!self.allowedOrientations) {
		// Use the orientations from the project settings.
		if (UI_USER_INTERFACE_IDIOM() != UIUserInterfaceIdiomPad) {
			orientations = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"UISupportedInterfaceOrientations"];
		} else {
			orientations = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"UISupportedInterfaceOrientations"];
		}
	} else {
		// Use the user specified orientations.
		orientations = self.allowedOrientations;
	}
    
    if ([orientations containsObject:@"UIInterfaceOrientationPortrait"]
		&& interfaceOrientation == UIInterfaceOrientationPortrait) {
        return YES;
    } else if ([orientations containsObject:@"UIInterfaceOrientationPortraitUpsideDown"]
               && interfaceOrientation == UIInterfaceOrientationPortraitUpsideDown) {
        return YES;
    } else if ([orientations containsObject:@"UIInterfaceOrientationLandscapeLeft"]
               && interfaceOrientation == UIInterfaceOrientationLandscapeLeft) {
        return YES;
    } else if ([orientations containsObject:@"UIInterfaceOrientationLandscapeRight"]
               && interfaceOrientation == UIInterfaceOrientationLandscapeRight) {
        return YES;
    } else {
        return NO;
    }
}

- (BOOL)shouldAutorotate {
	return YES;
}

@end
