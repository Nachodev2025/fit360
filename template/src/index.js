/**
 * When compiling for web, it will search for index.js on root/src.
 */

import {AppRegistry} from 'react-native';
import App from './app/App';
import {name as appName} from './app.json';
import './utils/icons';
// Import Firebase configuration
import './app/util/firebase';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
});
