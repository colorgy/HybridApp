import React from 'react';
import { connect } from 'react-redux';
import appTabSelector from '../selectors/appTabSelector';
import appUserSelector from '../selectors/appUserSelector';
import { logout } from '../actions/appUserActions';
import { AppCanvas, AppBar, LeftNav, MenuItem, Tabs, Tab } from 'material-ui';
import Login from './Login';
import AppNav from './AppNav';
import AppTab from './AppTab';
import ThemeManager from '../theme/ThemeManager';
import About from './About';
import License from './License';
import LogoutDialog from '../components/LogoutDialog';

var App = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  },

  getBarStyle() {
    if (typeof cordova !== 'undefined' && cordova.platformId == 'ios') {
      var paddingTop = '18px';
    } else {
      var paddingTop = 'auto';
    }

    return {
      paddingTop: paddingTop
    }
  },

  render() {
    var barStyle = this.getBarStyle();

    var currentTab = null;
    switch (this.props.appTabIndex) {
      case 0:
        currentTab = <About/>
        break;
      case 1:
        currentTab = <License/>
        break;
    }

    if (this.props.isLogin) {
      return (
        <AppCanvas>

          <AppNav
            ref="appNav"
            handleLogout={this.handleLogout} />

          <AppBar
            title="Colorgy"
            onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap}
            iconClassNameRight="muidocs-icon-navigation-expand-more"
            style={barStyle} />

          {currentTab}

          <AppTab/>

          <LogoutDialog
            ref="logoutDialog"
            handleLogout={() => this.props.dispatch(logout())} />

        </AppCanvas>
      );

    } else {
      return (
        <AppCanvas>
          <Login />
        </AppCanvas>
      );
    }
  },

  handleLogout() {
    this.refs.logoutDialog.show();
  },

  _onLeftIconButtonTouchTap() {
    this.refs.appNav.refs.wrappedInstance.toggle();
  }
});

export default connect(state => ({
  isLogin: state.appUser.isLogin,
  appTabIndex: state.appTab.appTabIndex
}))(App);
