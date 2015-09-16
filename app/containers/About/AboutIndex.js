import React from 'react';
import { pageNavigateTo, pageNavigateBack } from '../../components/PageRouter';
import { RaisedButton } from 'material-ui';
import PageWithBar from '../../components/PageWithBar';
import CenteredPage from '../../components/CenteredPage';

export default React.createClass({
  render() {
    return (
      <PageWithBar title="關於本 App" style={this.props.style}>
        <CenteredPage>
          <div>
            <p style={{ lineHeight: '28px' }}>結合 Colorgy 平台上各服務的 App，打造更好的校園生活，目前正在密切開發階段！</p>
            <RaisedButton label="關於我們" onTouchTap={() => pageNavigateTo('about', '/us')} />
            &nbsp;
            <RaisedButton label="專案們" onTouchTap={() => pageNavigateTo('about', '/projects')} />
          </div>
        </CenteredPage>
      </PageWithBar>
    );
  }
});
