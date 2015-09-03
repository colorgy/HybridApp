import React from 'react';
import { Styles } from 'material-ui';
let { Spacing } = Styles;

export default React.createClass({

  getStyle() {
    return {
      boxSizing: 'border-box',
      height: '100%',
      paddingBottom: Spacing.desktopKeylineIncrement + 'px',
      overflow: 'scroll',
      WebkitOverflowScrolling: 'touch',
      ...this.props.style
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
