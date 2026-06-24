/**
 * Portfolio App - Shiv Shankar Tiwari
 *
 * A React Native portfolio showcasing mobile development expertise.
 * Deployed to iOS App Store and Google Play via EAS + GitHub Actions.
 *
 * The entire experience lives in the self-contained `portfolio` feature
 * (see src/portfolio). This file is just the app entry shell.
 *
 * Repository: https://github.com/pythonsst/ReactNative-CICD
 */

import React from 'react';
import {PortfolioScreen} from './src/portfolio';

function App(): React.JSX.Element {
  return <PortfolioScreen />;
}

export default App;
