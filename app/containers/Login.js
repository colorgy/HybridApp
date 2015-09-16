import React from 'react';
import { connect } from 'react-redux';
import { doLogin, doLoadDepartments, doSetOrganization } from '../actions/appUserActions';
import ReactSwipe from 'react-swipe';
import FlipCard from 'react-flipcard';
import Select from 'react-select';
import { Paper, Card, CardTitle, CardText, CardActions, FlatButton, RaisedButton, TextField, Snackbar, SvgIcon, LinearProgress } from 'material-ui';
import CenteredPage from '../components/CenteredPage';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Login = React.createClass({
  getInitialState() {
    return {};
  },

  render() {
    var errorMessage = null;
    switch (this.props.errorCode) {
      case 'request_error':
        errorMessage = '無法連線至伺服器！';
        break;
      case 'invalid_grant':
        errorMessage = '帳號密碼認證方式有誤！';
        break;
      case 'facebook_failed':
        errorMessage = '無法從 Facebook 取得授權，登入失敗！';
        break;
      default:
        errorMessage = '發生不明錯誤。';
    }

    var loginBox = '';

    switch (this.state.loginMethod) {
      case 'password':
        loginBox = (<Card key="pl" zDepth={1} style={{ display: 'block', position: 'absolute', width: 288, height: 280, transform: 'rotate3d(0,1,0, 0)', WebkitTransform: 'rotate3d(0,1,0, 0)' }}>
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
          <CardActions style={{ paddingTop: 0, paddingBottom: 16 }}>
            <RaisedButton style={{ boxShadow: 'none' }} label="登入" secondary={true} onTouchTap={this._handleLogin} />
            <FlatButton label="使用 FB 登入" primary={false} onTouchTap={this.useFBLogin} />
          </CardActions>
        </Card>);
        break;
      default:
        loginBox = (<Card key="fbl" zDepth={1} style={{ display: 'block', position: 'absolute', width: 288, height: 280, transform: 'rotate3d(0,1,0, 0)' }}>
          <CardTitle
            title="立即登入 Colorgy！"
            subtitle="使用 FB 帳號登入，立即使用各項服務" />
          <CardText style={{ height: 112 }}>
            <RaisedButton style={{ marginTop: 32, boxShadow: 'none' }} secondary={true} onTouchTap={this._handleFBLogin}>
              <SvgIcon viewBox="0 0 520 520" fill="#fff" style={{ position: 'relative', top: 2, marginLeft: 12 }}>
                <path fill="#fff" d="M398.14,50.5H117.98c-36.408,0-68.48,26.452-68.48,62.86v280.16c0,36.408,32.072,68.98,68.48,68.98h173.466
                  c-0.325-54,0.077-114.134-0.185-166.387c-11.064-0.112-22.138-0.684-33.202-0.854c0.041-18.467,0.017-37.317,0.024-55.781
                  c11.057-0.137,22.121-0.163,33.178-0.268c0.338-17.957-0.338-36.025,0.354-53.966c1.103-14.205,6.519-28.563,17.14-38.377
                  c12.859-12.239,31.142-16.397,48.387-16.912c18.233-0.163,36.468-0.076,54.71-0.068c0.072,19.24,0.072,38.482-0.008,57.722
                  c-11.789-0.02-23.585,0.023-35.374-0.025c-7.468-0.467-15.145,5.198-16.504,12.609c-0.177,12.875-0.064,25.757-0.057,38.628
                  c17.285,0.073,34.577-0.02,51.862,0.044c-1.264,18.629-3.581,37.168-6.285,55.637c-15.272,0.137-30.554,1.514-45.818,1.602
                  c-0.129,52.236,0.04,112.395-0.093,166.395h38.564c36.408,0,63.36-32.572,63.36-68.98V113.36C461.5,76.952,434.548,50.5,398.14,50.5
                  z"/>
              </SvgIcon>
              <span style={{ position: 'relative', top: -6, marginLeft: 8, marginRight: 12, color: '#fff' }}>Login with Facebook</span>
            </RaisedButton>
          </CardText>
          <CardActions style={{ opacity: 0.5 }}>
            <FlatButton label="使用密碼登入" primary={false} onTouchTap={this.usePasswordLogin} />
          </CardActions>
        </Card>);
        break;
    }

    var content = '';

    if (this.props.loggingIn && this.props.organizationDataMissing) {
      var organizationOptions = (this.props.loginOrganizations || []).map( (org) => ({ value: org.code, label: `${org.code} ${org.name} (${org.shortName})` }) );
      var departmentsOptions = (this.props.loginDepartments || []).map( (dep) => ({ value: dep.code, label: `${dep.name}` }) );
      var yearOptions = [];
      var currentYear = (new Date()).getFullYear();
      for (let i=currentYear; i>(currentYear-12); i--) yearOptions.push({ value: i, label: `${i} 年` });

      content = (<CenteredPage>
        <Card zDepth={1} style={{ display: 'block', width: 'auto', height: 'auto', minWidth: 288 }}>
          <CardTitle
            title="選擇學校"
            subtitle="請選擇您的學校與科系" />
          <CardText>
            <p>
              <Select
                value={this.state.orgCode}
                options={organizationOptions}
                clearable={false}
                placeholder="輸入關鍵字尋找並選擇學校"
                noResultsText="資料載入中，請稍候..."
                onChange={this._handleOrganizationSelect}
              />
            </p>
            <p>
              <Select
                value={this.state.year}
                options={yearOptions}
                placeholder="入學年度"
                noResultsText="請先選擇學校，並稍等資料載入"
                onChange={this._handleYearSelect}
              />
            </p>
            <p>
              <Select
                value={this.state.depCode}
                options={departmentsOptions}
                placeholder="輸入關鍵字尋找並選擇系所"
                noResultsText="請先選擇學校，並稍等資料載入"
                onChange={this._handleDepartmentSelect}
              />
            </p>
          </CardText>
          <CardActions>
            <FlatButton label="確定並繼續" primary={true} onTouchTap={this._handleOrganizationSet} />
          </CardActions>
        </Card>
      </CenteredPage>);

    } else if (this.props.loggingIn) {
      content = (<CenteredPage>
        <div style={{ width: 'auto', height: 'auto' }}>
          <p>登入中，請稍候...</p>
          <LinearProgress mode="indeterminate" />
        </div>
      </CenteredPage>);

    } else {
      content = (<ReactSwipe continuous={false} shouldUpdate={ () => true }>
        <div>
          <CenteredPage>
            <div className="LoginBoxContainer" style={{ display: 'block', width: 288, height: 280, perspective: '800px', WebkitPerspective: '800px' }}>
              <ReactCSSTransitionGroup transitionName="flip">
                {loginBox}
              </ReactCSSTransitionGroup>
            </div>
          </CenteredPage>
        </div>
      </ReactSwipe>);
    }

    return (
      <div className="LoginSwipe">

        {content}

        <div style={{ position: 'fixed', bottom: '24px', left: 0, right: 0, height: 52, textAlign: 'center', pointerEvents: 'none' }}>
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

  useFBLogin() {
    this.setState({
      loginMethod: 'facebook'
    });
  },

  usePasswordLogin() {
    this.setState({
      loginMethod: 'password'
    });
  },

  _handleLogin() {
    var username = this.refs.username.getValue();
    var password = this.refs.password.getValue();

    this.props.dispatch(doLogin({ username: username, password: password }));
  },

  _handleFBLogin() {
    var dispatch = this.props.dispatch;

    facebookConnectPlugin.login(['public_profile', 'email', 'user_birthday', 'user_friends'],
      function (data) {
        var username = 'facebook:access_token';
        var password = data.authResponse.accessToken;

        dispatch(doLogin({ username: username, password: password }));
      },
      function (error) {
        dispatch(loginFailed('facebook_failed'));
      }
    );
  },

  _handleOrganizationSelect(orgCode) {
    this.setState({ orgCode: orgCode, depCode: null });
    this.props.dispatch(doLoadDepartments(orgCode));
  },

  _handleYearSelect(year) {
    this.setState({ year: year });
  },

  _handleDepartmentSelect(depCode) {
    this.setState({ depCode: depCode });
  },

  _handleOrganizationSet() {
    this.props.dispatch(doSetOrganization({ year: this.state.year, orgCode: this.state.orgCode, depCode: this.state.depCode }));
  }

});

export default connect(state => ({
  errorCode: state.appUser.errorCode,
  loggingIn: state.appUser.loggingIn,
  organizationDataMissing: state.appUser.organizationDataMissing,
  loginOrganizations: state.appUser.loginOrganizations,
  loginDepartments: state.appUser.loginDepartments
}))(Login);
