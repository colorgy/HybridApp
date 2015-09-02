import React from 'react';
import { connect } from 'react-redux';
import { login } from '../actions/appUserActions';
import { Paper, Card, CardTitle, CardText, CardActions, FlatButton, RaisedButton, TextField, Snackbar } from 'material-ui';

var Login = React.createClass({

  render() {
    var errorMessage = null;
    switch (this.props.errorCode) {
      case 'invalid_grant':
        errorMessage = '帳號密碼認證方式有誤！';
        break;
      default:
        errorMessage = '發生不明錯誤。';
    }

    return (
      <div style={{ height: '100%', textAlign: 'center', display: '-webkit-flex', WebkitAlignItems: 'center', WebkitJustifyContent: 'center', backgroundColor: '#eee' }}>

        <Card zDepth={1} style={{ display: 'block' }}>
          <CardTitle
            title="帳號密碼登入"
            subtitle="立即登入 Colorgy！" />
          <CardText>
            <TextField
              ref="username"
              style={{ display: 'block', marginTop: '-32px' }}
              floatingLabelText="Email 或帳號名稱" />
            <TextField
              ref="password"
              style={{ display: 'block' }}
              floatingLabelText="密碼"
              type="password" />
          </CardText>
          <CardActions>
            <FlatButton label="登入" primary={true} onTouchTap={this._handleLogin} />
            <FlatButton label="FB 登入" primary={true} onTouchTap={this._handleFBLogin} />
          </CardActions>
        </Card>

        <div style={{ position: 'fixed', bottom: '24px', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}>
          <Snackbar
            ref="snackbar"
            style={{ display: 'inline-block', position: 'relative', marginLeft: 'auto', marginRight: 'auto', pointerEvents: 'fill' }}
            message={errorMessage}
            autoHideDuration={4000} />
        </div>
      </div>
    );
  },

  componentWillReceiveProps(props) {
    if (props.errorCode) this.refs.snackbar.show();
  },

  _handleLogin() {
    var username = this.refs.username.getValue();
    var password = this.refs.password.getValue();

    this.props.dispatch(login({ username: username, password: password }));
  },

  _handleFBLogin() {
    var dispatch = this.props.dispatch;

    facebookConnectPlugin.login(['public_profile', 'email', 'user_birthday', 'user_friends'],
      function (data) {
        var username = 'facebook:access_token';
        var password = data.authResponse.accessToken;

        dispatch(login({ username: username, password: password }));
      },
      function (error) {
        alert('Error: ' + error);
      }
    );
  }

});

export default connect(state => ({
  errorCode: state.appUser.errorCode
}))(Login);
