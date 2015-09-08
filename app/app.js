require('es6-promise').polyfill();
require('babel/polyfill');

import React from 'react';
import Router from 'react-router';
import { Provider } from 'react-redux';
import store from './store';

window.injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

import './theme';
import App from './containers/App';

React.render(<Provider store={store}>{() => <App/>}</Provider>, document.getElementById('app'));


