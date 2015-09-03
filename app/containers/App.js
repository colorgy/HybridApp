import React from 'react';
import { connect } from 'react-redux';
import appTabSelector from '../selectors/appTabSelector';
import appUserSelector from '../selectors/appUserSelector';
import { logout } from '../actions/appUserActions';
import { appPageBack } from '../actions/appPageActions';
import { AppCanvas, AppBar, LeftNav, MenuItem, Tabs, Tab } from 'material-ui';
import Login from './Login';
import AppNav from './AppNav';
import AppTab from './AppTab';
import ThemeManager from '../theme/ThemeManager';
import Table from './Table';
import Chat from './Chat';
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

  getTabStyle(tabIndex) {
    if (this.props.appTabIndex == tabIndex) {
      return {};
    } else {
      return { display: 'none' }
    }
  },

  componentWillMount() {
    if (window) window.toggleAppNav = this.toggleAppNav;

    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
      document.addEventListener("backbutton", onBackKeyDown, false);
    }

    var self = this;
    function onBackKeyDown(e) {
      var currentHistroy = self.props.appPageHistory[self.props.appTabIndex];
      if (currentHistroy && currentHistroy.length > 0) {
        e.preventDefault();
        self.props.dispatch(appPageBack(true));
      } else {
        return true;
      }
    }
  },

  render() {

    if (this.props.isLogin) {

      return (
        <AppCanvas>

          <AppNav
            ref="appNav"
            handleLogout={this.handleLogout} />

          <div style={this.getTabStyle(0)}>
            <Table/>
          </div>
          <div style={this.getTabStyle(1)}>
            <Chat/>
          </div>
          <div style={this.getTabStyle(2)}>
            <About/>
          </div>
          <div style={this.getTabStyle(3)}>
            <License/>
          </div>

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

  toggleAppNav() {
    this.refs.appNav.refs.wrappedInstance.toggle();
  }
});

export default connect(state => ({
  isLogin: state.appUser.isLogin,
  appTabIndex: state.appTab.appTabIndex,
  appPageHistory: state.appPage.history,
  appPageCurrentPath: state.appPage.currentPath,
  appPagePreviousPath: state.appPage.previousPath
}))(App);
