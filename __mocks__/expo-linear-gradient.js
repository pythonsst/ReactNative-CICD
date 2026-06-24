// Test mock: render LinearGradient as a plain View.
const React = require('react');
const {View} = require('react-native');

const LinearGradient = props => React.createElement(View, props, props.children);

module.exports = {LinearGradient};
