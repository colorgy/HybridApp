import React from 'react';
import { Route } from 'react-router';

import App from './components/App';
import About from './components/About';
import License from './components/License';

export default (
  <Route handler={App}>
    <Route name="about" handler={About}/>
    <Route name="license" handler={License}/>
  </Route>
);
