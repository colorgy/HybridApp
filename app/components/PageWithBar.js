import React from 'react';
import { Mixins, Styles, SvgIcon, AppBar, IconButton } from 'material-ui';
import { appPageBack } from '../actions/appPageActions';
let { Spacing, Colors } = Styles;

var getBarHeight = function () {
  if (typeof cordova !== 'undefined' && cordova.platformId == 'ios') {
    return (Spacing.desktopKeylineIncrement + 20) + 'px';
  } else {
    return Spacing.desktopKeylineIncrement + 'px';
  }
}

var getTabHeight = function () {
  return Spacing.desktopKeylineIncrement - 20 + 'px';
}

export default React.createClass({
  mixins: [Mixins.StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getDefaultProps() {
    return {
      title: 'Colorgy'
    };
  },

  getStyle() {
    return {
      boxSizing: 'border-box',
      height: '100%',
      paddingTop: getBarHeight(),
      paddingBottom: getTabHeight(),
      overflow: 'scroll',
      WebkitOverflowScrolling: 'touch',
      ...this.props.style
    }
  },

  getBarStyle() {
    if (typeof cordova !== 'undefined' && cordova.platformId == 'ios') {
      var paddingTop = '18px';
    } else {
      var paddingTop = 'auto';
    }

    return {
      position: 'fixed',
      top: 0,
      paddingTop: paddingTop
    }
  },

  getIconElementLeft() {
    if (this.props.hasBack) {
      return (
        <IconButton onTouchTap={this.handleLeftIconButtonTouchTap}>
          <SvgIcon style={{ fill: '#fff' }}>
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </SvgIcon>
        </IconButton>
      );
    } else {
      return (
        <IconButton onTouchTap={this.handleLeftIconButtonTouchTap}>
          <SvgIcon style={{ fill: '#fff' }}>
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </SvgIcon>
        </IconButton>
      );
    }
  },

  getIconElementRight() {
    if (this.props.actions) {
      return this.props.actions;
    } else {
      return (
        <IconButton>
        </IconButton>
      );
    }
  },

  render() {
    let style = this.getStyle();
    var barStyle = this.getBarStyle();
    return (
      <div style={style} className="page-with-bar">
        <AppBar
          className="app-bar"
          title={this.props.title}
          iconElementLeft={this.getIconElementLeft()}
          iconElementRight={this.getIconElementRight()}
          style={barStyle} />
        {this.props.children}
      </div>
    );
  },

  handleLeftIconButtonTouchTap() {
    if (this.props.hasBack) {
      store.dispatch(appPageBack());
    } else {
      toggleAppNav();
    }
  }
});

export { getBarHeight, getTabHeight };
