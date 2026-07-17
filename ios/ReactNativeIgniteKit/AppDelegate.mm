#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Initialize expo-updates before RN loads: UpdatesModule reads
  // AppController.sharedInstance during JS startup and hits a precondition crash
  // if the controller was never initialized. Called via runtime to avoid a
  // bridging header (AppController is @objc(EXUpdatesAppController)).
  Class updatesController = NSClassFromString(@"EXUpdatesAppController");
  if (updatesController && [updatesController respondsToSelector:@selector(initializeWithoutStarting)]) {
    [updatesController performSelector:@selector(initializeWithoutStarting)];
  }

  self.moduleName = @"SnapBiodata";
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  // Use the Expo Updates OTA bundle when the updates controller is available.
  // Resolved at runtime via NSClassFromString so no bridging header is required;
  // falls back to the embedded bundle when OTA is not wired.
  Class controllerClass = NSClassFromString(@"EXUpdatesAppController");
  if (controllerClass && [controllerClass respondsToSelector:@selector(sharedInstance)]) {
    id controller = [controllerClass performSelector:@selector(sharedInstance)];
    if (controller && [controller respondsToSelector:@selector(launchAssetUrl)]) {
      NSURL *url = [controller performSelector:@selector(launchAssetUrl)];
      if (url) {
        return url;
      }
    }
  }
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
