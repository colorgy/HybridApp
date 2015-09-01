import React from 'react';
import { RouteHandler, Link } from 'react-router';

export default React.createClass({
  render() {
    return (
      <div>
        <Link to="about">About</Link>
        &nbsp;
        <Link to="license">License</Link>
        <RouteHandler/>
      </div>
    );
  }
});
