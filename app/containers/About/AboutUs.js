import React from 'react';
import { pageNavigateTo, pageNavigateBack } from '../../components/PageRouter';
import { RaisedButton } from 'material-ui';
import PageWithBar from '../../components/PageWithBar';
import CenteredPage from '../../components/CenteredPage';

export default React.createClass({
  render() {
    return (
      <PageWithBar title="關於" hasBack pageRouterkey="about" style={this.props.style}>
        <div style={{ padding: '4px 12px 24px' }}>
          <h2>Colorgy</h2>
          <p style={{ lineHeight: '28px' }}>Colorgy 校園服務平台以學生出發、由學生創造，藉由資訊科技的力量，打造讓大學生更快樂的服務，聯合大家一起透過資訊的開放、共享、再造，實踐更美好、更便利的校園生活。</p>
          <p style={{ lineHeight: '28px' }}>從上了大學以來，我們陸續做了「行事曆排課工具」、「活動抽獎系統」、「各式活動大頭貼產生器」、「宿舍日用品團購網站」、「原文書團購網站」等各式開源服務，隨著時間過去，專案的規模與數量也日益增長，在最後結合而成 Colorgy 平台，希望可以讓校園生活更歡樂繽紛，為校園與同學們創造更多價值。</p>
          <p style={{ lineHeight: '28px' }}>To be continued...</p>

          <RaisedButton label="FB" onTouchTap={() => window.open('https://www.facebook.com/Colorgy-1529686803975150/', '_system')} />
          &nbsp;
          <RaisedButton label="專案計畫" onTouchTap={() => pageNavigateTo('about', `/projects/${(new Date()).getTime()}`)} />
          &nbsp;
          <RaisedButton label="回去" onTouchTap={() => pageNavigateBack('about')} />
        </div>

      </PageWithBar>
    );
  }
});
