import React from 'react';
import { Styles } from 'material-ui';
let { Spacing, Colors } = Styles;

export default React.createClass({

  getStyle() {
    if (typeof cordova !== 'undefined' && cordova.platformId == 'ios') {
      var paddingTop = (Spacing.desktopKeylineIncrement + 20) + 'px';
    } else {
      var paddingTop = Spacing.desktopKeylineIncrement + 'px';
    }

    return {
      boxSizing: 'border-box',
      height: '100%',
      paddingTop: paddingTop,
      paddingBottom: Spacing.desktopKeylineIncrement + 'px',
      overflow: 'scroll',
      WebkitOverflowScrolling: 'touch'
    }
  },

  render() {
    let style = this.getStyle();
    return (
      <div style={style} className="page-with-nav">
        {this.props.children}
      </div>
    );
  }
});
