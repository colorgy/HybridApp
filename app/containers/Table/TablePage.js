import React from 'react';
import { RaisedButton, IconButton, SvgIcon } from 'material-ui';
import { pageNavigateTo, pageNavigateBack } from '../../components/PageRouter';
import PageWithBar, { getBarHeight, getTabHeight } from '../../components/PageWithBar';
import WeekTable from '../../components/WeekTable';

export default React.createClass({

  render() {
    var pageAction = (
      <IconButton onTouchTap={this.handleAdd}>
        <SvgIcon style={{ fill: '#fff' }}>
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
        </SvgIcon>
      </IconButton>
    );

    return (
      <PageWithBar style={{ overflow: 'visiable' }} title={this.props.cid} actions={pageAction}>
        <WeekTable style={{ position: 'absolute', top: getBarHeight(), bottom: getTabHeight(), width: '100%' }} />
      </PageWithBar>
    );
  },

  handleAdd() {
    console.log('add');
  }
});
