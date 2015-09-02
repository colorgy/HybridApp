import React from 'react';
import { Dialog, FlatButton } from 'material-ui';

export default React.createClass({

  render() {
    let actions =
      [
        <FlatButton
          key="0"
          label="取消"
          secondary={true}
          onTouchTap={this._handleCancel} />,
        <FlatButton
          key="1"
          label="確定登出"
          primary={true}
          onTouchTap={this.props.handleLogout} />
      ]
    return (
      <Dialog
        title="您即將登出"
        actions={actions}
        ref="dialog">
          一旦登出後，所有裝置上未同步到網路的資料將會消失！確定要繼續嗎？
      </Dialog>
    );
  },

  show() {
    this.refs.dialog.show();
  },

  _handleCancel() {
    this.refs.dialog.dismiss();
  }
});
