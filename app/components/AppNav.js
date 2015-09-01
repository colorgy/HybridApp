import React from 'react';
import { RouteHandler, Link } from 'react-router';
import { AppCanvas, AppBar, LeftNav, MenuItem, Tabs, Tab } from 'material-ui';

export default React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  menuItems: [
    { route: 'about', text: 'About' },
    { route: 'license', text: 'License' },
    { type: MenuItem.Types.SUBHEADER, text: 'More' }
  ],

  render() {
    return (
      <LeftNav
        ref="nav"
        docked={false}
        isInitiallyOpen={false}
        menuItems={this.menuItems}
        onChange={this._onLeftNavChange} />
    );
  },

  _onLeftNavChange(e, key, payload) {
    this.context.router.transitionTo(payload.route);
  }
});
