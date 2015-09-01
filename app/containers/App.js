import React from 'react';
import { connect } from 'react-redux';
import appTabSelector from '../selectors/appTabSelector';
import { AppCanvas, AppBar, LeftNav, MenuItem, Tabs, Tab } from 'material-ui';
import AppNav from './AppNav';
import AppTab from './AppTab';
import ThemeManager from '../theme/ThemeManager';
import About from './About';
import License from './License';

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
      var paddingTop = '20px';
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

    return (
      <AppCanvas>

        <AppNav
          ref="appNav" />

        <AppBar
          title="Colorgy"
          onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap}
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          style={barStyle} />

        {currentTab}

        <AppTab/>
      </AppCanvas>
    );
  },

  _onLeftIconButtonTouchTap() {
    this.refs.appNav.refs.nav.toggle();
  }
});

export default connect(appTabSelector)(App);
