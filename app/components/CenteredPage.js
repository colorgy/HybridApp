import React from 'react';
import { Styles } from 'material-ui';
let { Spacing } = Styles;
import { getAppTabHeight } from '../containers/AppTab';

export default React.createClass({

  getStyle() {
    let height = 'calc(100% - 24px)';
    let padding = '12px';

    if (this.props.adjustForAppTab) {
      let paddingBottom = (parseInt(getAppTabHeight()) + 12) + 'px';
      padding = `12px 12px ${paddingBottom}`;
      height = `calc(100% - ${paddingBottom} - 12px)`;
    }

    return {
      display: '-webkit-flex',
      height: height,
      WebkitAlignItems: 'center',
      WebkitJustifyContent: 'center',
      padding: padding,
      textAlign: 'center',
      backgroundColor: '#eee'
    }
  },

  render() {
    return (
      <div style={this.getStyle()}>
        {this.props.children}
      </div>
    );
  }
});
