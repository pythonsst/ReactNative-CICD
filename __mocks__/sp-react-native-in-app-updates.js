// Manual mock for sp-react-native-in-app-updates (native module).
const IAUUpdateKind = { FLEXIBLE: 0, IMMEDIATE: 1 };

class SpInAppUpdates {
  checkNeedsUpdate = jest
    .fn()
    .mockResolvedValue({ shouldUpdate: false, storeVersion: undefined });

  startUpdate = jest.fn().mockResolvedValue(undefined);
}

module.exports = SpInAppUpdates;
module.exports.default = SpInAppUpdates;
module.exports.IAUUpdateKind = IAUUpdateKind;
