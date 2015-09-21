require('es6-promise').polyfill();
require('babel/polyfill');

import React from 'react';
import Router from 'react-router';
import { Provider } from 'react-redux';
import store from './store';

window.injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

if (typeof cordova !== 'undefined' && cordova.InAppBrowser) window.open = cordova.InAppBrowser.open;

import './theme';
import App from './containers/App';

React.render(<Provider store={store}>{() => <App/>}</Provider>, document.getElementById('app'));

setTimeout(() => {
  if (window.analytics) {
    window.analytics.startTrackerWithId('UA-60031864-11');
    if (store.getState().appUser) analytics.setUserId(store.getState().appUser.id);
  }
}, 100);

setTimeout(() => {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-60031864-12', 'auto');
  ga('require', 'displayfeatures');
  if (store.getState().appUser) ga('set', '&uid', store.getState().appUser.id);
  ga('send', 'pageview');
}, 100);
