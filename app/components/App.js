import React from 'react';
import { RouteHandler, Link } from 'react-router';
import { AppCanvas, AppBar, LeftNav, MenuItem, Tabs, Tab } from 'material-ui';
import AppNav from './AppNav';
import AppTabs from './AppTabs';
import ThemeManager from '../theme/ThemeManager';

export default React.createClass({
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
    return (
      <AppCanvas>

        <AppNav
          ref="appNav" />

        <AppBar
          title="Colorgy"
          onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap}
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          style={barStyle} />

        <RouteHandler/>

        <AppTabs/>
      </AppCanvas>
    );
  },

  _onLeftIconButtonTouchTap() {
    this.refs.appNav.refs.nav.toggle();
  }
});
