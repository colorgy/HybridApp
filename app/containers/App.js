import React from 'react';
import { connect } from 'react-redux';
import { initialize, doLogout } from '../actions/appUserActions';
import { pageRouterBack } from '../actions/pageRouterActions';
import { AppCanvas } from 'material-ui';
import Login from './Login';
import AppNav from './AppNav';
import ThemeManager from '../theme/ThemeManager';
import Table from './Table';
import Chat from './Chat';
import About from './About';
import License from './License';
import AppTab, { Tab } from '../components/AppTab';
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
      return { height: '100%' };
    } else {
      return { display: 'none' };
    }
  },

  componentWillMount() {
    this.props.dispatch(initialize());

    if (window) window.toggleAppNav = this.toggleAppNav;

    var self = this;
    function onBackKeyDown(e) {
      if (true) {
        e.preventDefault();
        self.props.dispatch(pageRouterBack({ key: self.state.currentTab }));
      } else {
        return true;
      }
    }
    document.addEventListener("backbutton", onBackKeyDown, false);

    var loader = document.getElementById('loader');
    if (loader) loader.remove();
  },

  handleTabChange(tabName) {
    this.setState({ currentTab: tabName });
  },

  render() {

    if (this.props.isLogin) {
      return (
        <AppCanvas>

          <AppNav
            ref="appNav"
            handleLogout={this.handleLogout} />

          <AppTab onTabChange={this.handleTabChange}>
            <Tab name="table" displayedName="Table" handler={Table} />
            <Tab name="about" displayedName="About" handler={About} />
          </AppTab>

          <LogoutDialog
            ref="logoutDialog"
            handleLogout={() => this.props.dispatch(doLogout())} />

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
    this.closeAppNav();
  },

  toggleAppNav() {
    this.refs.appNav.refs.wrappedInstance.toggle();
  },

  closeAppNav() {
    this.refs.appNav.refs.wrappedInstance.close();
  }
});

export default connect((state) => ({
  isLogin: state.appUser.isLogin
}))(App);
