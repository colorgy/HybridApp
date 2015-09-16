import React from 'react';
import { connect } from 'react-redux';
import { RaisedButton, LinearProgress } from 'material-ui';
import tableActions, { checkCourseDatabase, initialize, doUpdateCourseDatabase } from '../actions/tableActions';
import PageRouter, { Route } from '../components/PageRouter';
import PageWithBar from '../components/PageWithBar';
import CenteredPage from '../components/CenteredPage';
import TablePage from './Table/TablePage';
import CoursePage from './Table/CoursePage';
import MyCoursesPage, { MyCoursesPagePreloadPlaceholder } from './Table/MyCoursesPage';
import CoursesPage from './Table/CoursesPage';
import UserPage from './Table/UserPage';

var Table = React.createClass({

  componentWillMount() {
    this.props.dispatch(initialize());
    this.props.dispatch(checkCourseDatabase());
  },

  render() {
    // Initializing
    if (!this.props.checkCourseDatabaseDone) {
      return (
        <PageWithBar>
          <CenteredPage>
            <div>載入中...</div>
          </CenteredPage>
        </PageWithBar>
      );

    // Downloading initial data
    } else if (this.props.courseDatabaseUpdating && !this.props.courseDatabaseUpdatedAt) {
      var progressMode = 'indeterminate';
      var progress = this.props.courseDatabaseUpdatingProgress;

      if (progress) {
        progressMode = 'determinate';
        progress = parseInt(progress * 100);
      }

      return (
        <PageWithBar>
          <CenteredPage>
            <div>
              <p>正在下載您學校的課程資料，請稍候數秒...</p>
              <LinearProgress mode={progressMode} value={progress} />
            </div>
          </CenteredPage>
        </PageWithBar>
      );

    // User has no organization
    } else if (this.props.userHasNoOrganization) {
      return (
        <PageWithBar>
          <CenteredPage adjustForAppTab>
            <div>您沒有選擇學校。</div>
          </CenteredPage>
        </PageWithBar>
      );

    // User's organization has no course data
    } else if (this.props.organizationHasNoCourseData) {
      return (
        <PageWithBar>
          <CenteredPage>
            <div>
              <p>您的學校尚無課程資料，因此無法提供您服務。</p>
              <RaisedButton label="再試一次" onTouchTap={ () => this.props.dispatch(doUpdateCourseDatabase()) } />
            </div>
          </CenteredPage>
        </PageWithBar>
      );

    // The initial data download has faild
    } else if (!this.props.courseDatabaseUpdateSuccess && !this.props.courseDatabaseUpdatedAt) {
      return (
        <CenteredPage adjustForAppTab>
          <div>
            <p>課程資料下載失敗。</p>
            <RaisedButton label="重試" onTouchTap={ () => this.props.dispatch(doUpdateCourseDatabase()) } />
          </div>
        </CenteredPage>
      );

    // Table
    } else {
      return (
        <PageRouter history={this.props.routerHistroy}>
          <Route path="/" handler={TablePage} />
          <Route path="/courses" handler={CoursesPage} />
          <Route path="/me/courses" handler={MyCoursesPage} preloadPlaceholder={MyCoursesPagePreloadPlaceholder} />
          <Route path="/courses/:code" handler={CoursePage} />
          <Route path="/users/:username" handler={UserPage} />
        </PageRouter>
      );
    }
  }
});

export default connect((state) => ({
  routerHistroy: state.pageRouter.tableHistory,
  checkCourseDatabaseDone: state.table.checkCourseDatabaseDone,
  courseDatabaseUpdating: state.table.courseDatabaseUpdating,
  courseDatabaseUpdatingProgress: state.table.courseDatabaseUpdatingProgress,
  courseDatabaseUpdateSuccess: state.table.courseDatabaseUpdateSuccess,
  courseDatabaseUpdatedAt: state.table.courseDatabaseUpdatedAt,
  userHasNoOrganization: state.table.userHasNoOrganization,
  organizationHasNoCourseData: state.table.organizationHasNoCourseData
}))(Table);
