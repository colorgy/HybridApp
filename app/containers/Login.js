import React from 'react';
import { connect } from 'react-redux';
import { login } from '../actions/appUserActions';
import { RaisedButton } from 'material-ui';

var Login = React.createClass({

  render() {
    return (
      <div style={{ height: '100%', textAlign: 'center', display: '-webkit-flex', WebkitAlignItems: 'center', WebkitJustifyContent: 'center' }}>
        <RaisedButton label="Login" primary={true} onClick={this._handleLogin} />
      </div>
    );
  },

  _handleLogin() {
    this.props.dispatch(login());
  }

});

export default connect()(Login);
