import React from 'react';
import { RouteHandler, Link } from 'react-router';
import { connect } from 'react-redux';
import appUserSelector from '../selectors/appUserSelector';
import { logout } from '../actions/appUserActions';
import AppNavHeader from '../components/AppNavHeader';
import { AppCanvas, AppBar, MenuItem, Tabs, Tab } from 'material-ui';
import LeftNav from '../components/LeftNav';

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
    var navHeader = <AppNavHeader
      name={this.props.name}
      avatar={this.props.avatar}
      onMenuItemClick={this._handleMenuItemClick}
      background={this.props.coverPhoto} />

    return (
      <LeftNav
        ref="nav"
        docked={false}
        isInitiallyOpen={false}
        header={navHeader}
        menuItems={this.menuItems}
        onChange={this._onLeftNavChange} />
    );
  },

  _onLeftNavChange(e, key, payload) {
    switch (payload.action) {
      case 'logout':
        this.props.handleLogout();
        break;
    }
  },

  _handleMenuItemClick(name) {
    switch (name) {
      case 'logout':
        this.props.handleLogout();
        break;
    }
  }
});

export default connect(appUserSelector)(AppNav);
