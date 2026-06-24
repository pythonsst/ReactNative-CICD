// Test mock: haptics are no-ops in the test environment.
module.exports = {
  impactAsync: () => Promise.resolve(),
  notificationAsync: () => Promise.resolve(),
  ImpactFeedbackStyle: {Light: 'light', Medium: 'medium', Heavy: 'heavy'},
  NotificationFeedbackType: {Success: 'success', Warning: 'warning', Error: 'error'},
};
