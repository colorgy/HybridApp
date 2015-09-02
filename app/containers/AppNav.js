import React from 'react';
import { RouteHandler, Link } from 'react-router';
import { connect } from 'react-redux';
import appUserSelector from '../selectors/appUserSelector';
import { logout } from '../actions/appUserActions';
import { AppCanvas, AppBar, LeftNav, MenuItem, Tabs, Tab } from 'material-ui';

var AppNav = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  menuItems: [
    { route: 'about', text: 'About' },
    { route: 'license', text: 'License' },
    { type: MenuItem.Types.SUBHEADER, text: 'More' },
    { action: 'logout', text: 'Logout' }
  ],

  toggle() {
    this.refs.nav.toggle();
  },

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
    switch (payload.action) {
      case 'logout':
        this.props.dispatch(logout());
        break;
    }
  }
});

export default connect(appUserSelector)(AppNav);
