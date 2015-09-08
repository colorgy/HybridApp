import React from 'react';
import { connect } from 'react-redux';
import { RaisedButton, LinearProgress } from 'material-ui';
import tableActions, { checkCourseDatabase } from '../actions/tableActions';
import { initialize, doUpdateCourseDatabase } from '../actions/tableActions';
import PageRouter, { Route } from '../components/PageRouter';
import Page from '../components/Page';
import CenteredPage from '../components/CenteredPage';
import TablePage from './Table/TablePage';
import CoursePage from './Table/CoursePage';
import UserPage from './Table/UserPage';
import Link from '../components/Link';

var Table = React.createClass({

  componentWillMount() {
    this.props.dispatch(initialize());
    this.props.dispatch(checkCourseDatabase());
  },

  render() {
    // Initializing
    if (!this.props.checkCourseDatabaseDone) {
      return (
        <CenteredPage adjustForAppTab>
          <div>載入中...</div>
        </CenteredPage>
      );

    // Downloading initial data
    } else if (this.props.courseDatabaseUpdating && !this.props.courseDatabaseUpdatedAt) {
      return (
        <CenteredPage adjustForAppTab>
          <div>
            <p>正在下載您學校的課程資料，請稍候數秒...</p>
            <LinearProgress mode="indeterminate" />
          </div>
        </CenteredPage>
      );

    // User has no organization
    } else if (this.props.userHasNoOrganization) {
      return (
        <CenteredPage adjustForAppTab>
          <div>您沒有選擇學校。</div>
          <RaisedButton label="重試" onTouchTap={ () => this.props.dispatch(doUpdateCourseDatabase()) } />
        </CenteredPage>
      );

    // User's organization has no course data
    } else if (this.props.organizationHasNoCourseData) {
      return (
        <CenteredPage adjustForAppTab>
          <div>您的學校尚無課程資料。</div>
          <RaisedButton label="重試" onTouchTap={ () => this.props.dispatch(doUpdateCourseDatabase()) } />
        </CenteredPage>
      );

    // The initial data download has faild
    } else if (!this.props.courseDatabaseUpdateSuccess && !this.props.courseDatabaseUpdatedAt) {
      return (
        <CenteredPage adjustForAppTab>
          <div>
            <p>課程資料更新失敗。</p>
            <RaisedButton label="重試" onTouchTap={ () => this.props.dispatch(doUpdateCourseDatabase()) } />
          </div>
        </CenteredPage>
      );

    // Table
    } else {
      return (
        <PageRouter currentPath={this.props.pageCurrentPath} previousPath={this.props.pagePreviousPath}>
          <Route path="/" handler={TablePage} />
          <Route path="/courses/:code" handler={CoursePage} />
          <Route path="/users/:username" handler={UserPage} />
        </PageRouter>
      );
    }
  }
});

export default connect(state => ({
  checkCourseDatabaseDone: state.table.checkCourseDatabaseDone,
  courseDatabaseUpdating: state.table.courseDatabaseUpdating,
  courseDatabaseUpdateSuccess: state.table.courseDatabaseUpdateSuccess,
  courseDatabaseUpdatedAt: state.table.courseDatabaseUpdatedAt,
  userHasNoOrganization: state.table.userHasNoOrganization,
  organizationHasNoCourseData: state.table.organizationHasNoCourseData
}))(Table);
