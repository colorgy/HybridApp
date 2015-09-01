require("babel/polyfill");

import React from 'react';
import Router from 'react-router';
import { Provider } from 'react-redux';
import store from './store';

window.injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

import './theme';
import routes from './routes';

Router.run(routes, Router.HashLocation, (Root) => {
  React.render(<Provider store={store}>{() => <Root/>}</Provider>, document.getElementById('app'));
});

