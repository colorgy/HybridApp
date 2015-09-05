import React from 'react';
import { connect } from 'react-redux';
import { RaisedButton, IconButton, SvgIcon } from 'material-ui';
import { pageNavigateTo, pageNavigateBack } from '../../components/PageRouter';
import PageWithBar, { getBarHeight } from '../../components/PageWithBar';
import { getAppTabHeight } from '../../containers/AppTab';
import WeekTable from '../../components/WeekTable';
import { doUpdateCourseDatabase } from '../../actions/tableActions';

var TablePage = React.createClass({

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
        <WeekTable style={{ position: 'absolute', top: getBarHeight(), bottom: getAppTabHeight(), width: '100%' }} />
      </PageWithBar>
    );
  },

  handleAdd() {
    this.props.dispatch(doUpdateCourseDatabase());
  }
});

export default connect(state => ({
}))(TablePage);
