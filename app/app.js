require("babel/polyfill");

import React from 'react';
import Router from 'react-router';

window.injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

import './theme';
import routes from './routes';

Router.run(routes, Router.HashLocation, (Root) => {
  React.render(<Root/>, document.getElementById('app'));
});

