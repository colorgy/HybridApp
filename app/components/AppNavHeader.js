import React from 'react';
import { Styles, IconMenu, SvgIcon } from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');
let MenuDivider = require('material-ui/lib/menus/menu-divider');

export default React.createClass({

  render() {
    if (typeof cordova !== 'undefined' && cordova.platformId == 'ios') {
      var top = '18px';
    } else {
      var top = '0';
    }

    var menuIcon =
      <SvgIcon viewBox="0 0 50 50" style={{ padding: '8px 12px' }}>
        <path style={{ fill: 'white' }} d="M24 16c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 4c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
      </SvgIcon>

    return (
      <div style={{
          position: 'relative',
          height: '100px',
          backgroundSize: 'cover',
          backgroundImage: `url(${this.props.background})`,
          backgroundPosition: '50% 50%'
        }}>
        <div>
          <div style={{
              position: 'absolute',
              left: '0',
              right: '0',
              bottom: '0',
              padding: '16px 16px 16px 78px',
              color: 'white',
              backgroundImage: '-webkit-linear-gradient(top, rgba(0,0,0, 0) 0%, rgba(0,0,0, .8) 100%)',
              lineHeight: '18px'
            }}>
            <div>{this.props.name}</div>
            <div style={{
                fontSize: '12px',
                fontStyle: 'inherit',
                opacity: '.8'
              }}>
              {this.props.name}
            </div>
          </div>
          <img src={this.props.avatar}
            style={{
              position: 'absolute',
              width: '50px',
              borderRadius: '99px',
              left: '14px',
              bottom: '12px'
            }} />
          <IconMenu iconButtonElement={menuIcon} zDepth={3}
            style={{
              position: 'absolute',
              right: '0',
              top: top
            }}>
            <MenuItem onTouchTap={() => window.open('https://goo.gl/EkTN4u', '_system')} primaryText="前往 Colorgy 網站" />
            <MenuItem onTouchTap={() => window.open('https://www.facebook.com/Colorgy-1529686803975150/', '_system')} primaryText="前往 Colorgy FB 專頁" />
            <MenuDivider />
            <MenuItem onTouchTap={this.props.onMenuItemClick.bind(this, 'logout')} primaryText="登出" />
            <MenuDivider />
            <MenuItem onTouchTap={() => window.open('https://github.com/colorgy/HybridApp', '_system')} primaryText="到 GitHub 查看原始碼" />
            <MenuItem onTouchTap={() => window.open('https://github.com/colorgy/HybridApp/issues', '_system')} primaryText="查看／回報 issues" />
          </IconMenu>
        </div>
      </div>
    );
  }
});
