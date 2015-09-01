import React from 'react';
import { Route } from 'react-router';

import App from './containers/App';
import About from './containers/About';
import License from './containers/License';

export default (
  <Route handler={App}>
    <Route name="about" handler={About}/>
    <Route name="license" handler={License}/>
  </Route>
);
