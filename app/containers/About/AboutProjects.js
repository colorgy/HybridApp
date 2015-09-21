import React from 'react';
import { pageNavigateTo, pageNavigateBack } from '../../components/PageRouter';
import { RaisedButton } from 'material-ui';
import PageWithBar from '../../components/PageWithBar';
import CenteredPage from '../../components/CenteredPage';

export default React.createClass({

  componentWillBeVisibleOnPageRouter() {
    if (window.analytics) window.analytics.trackView('About Projects');
  },

  render() {
    return (
      <PageWithBar title="各專案計畫" hasBack pageRouterkey="about" style={this.props.style}>
        <div style={{ padding: '4px 12px 24px' }}>
          <p style={{ lineHeight: '28px' }}>Colorgy Core Data - 收集各式校園資料、整合 API 系統串接，作為開發個應用服務的基礎！目前已有 20+ 的課程資料（爬蟲與 API）以及超過 50+ 校的基本資訊。</p>
          <p style={{ lineHeight: '28px' }}>Colorgy Table - 選課、上課的好幫手（可提供服務於已有課程資料的學校）。</p>
          <p style={{ lineHeight: '28px' }}>Colorgy Books - 教科書團購服務（提供服務於已有課程資料的學校）。</p>
          <p style={{ lineHeight: '28px' }}>Colorgy Tasks - 任務接案、發案平台（由合作廠商提供）。</p>
          <h2>如何協助</h2>
          <p style={{ lineHeight: '28px' }}>- 校園資料收集：集結各個校園內的實用資訊，如上課時間、教室、平面地圖、校園周邊商家資料，撰寫網頁爬蟲取得課程資料、校園單位資料、圖書館藏書資料，設計程式自動化校園系統操作。</p>
          <p style={{ lineHeight: '28px' }}>- 回饋與建議：協助試用各產品，或提供好點子！</p>
          <p style={{ lineHeight: '28px' }}>- 專案開發：修復漏洞或改善功能，或是開發新的 idea。</p>

          <RaisedButton label="GitHub" onTouchTap={() => window.open('https://github.com/colorgy', '_system')} />
          &nbsp;
          <RaisedButton label="關於我們" onTouchTap={() => pageNavigateTo('about', `/us/${(new Date()).getTime()}`)} />
          &nbsp;
          <RaisedButton label="回去" onTouchTap={() => pageNavigateBack('about')} />
        </div>

      </PageWithBar>
    );
  }
});
