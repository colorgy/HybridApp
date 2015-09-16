import React from 'react';
import { connect } from 'react-redux';
import { doSyncUserCourses, doLoadTableCourses, doUpdateCourseDatabase, doRemoveCourse } from '../../actions/tableActions';
import { pageNavigateTo, pageNavigateBack } from '../../components/PageRouter';
import { Card, CardHeader, Avatar, RaisedButton, IconButton, SvgIcon } from 'material-ui';
import PageWithBar from '../../components/PageWithBar';
import CenteredPage from '../../components/CenteredPage';
import CourseCard from '../../components/CourseCard';

var MyCoursesPage = React.createClass({

  componentWillMount() {
  },

  componentWillBeVisibleOnPageRouter() {
    this.props.dispatch(doSyncUserCourses());
    this.props.dispatch(doLoadTableCourses());
  },

  getMyCourseCards() {
    let courses = this.props.courses;

    if (!courses || !Object.keys(courses).length) return (<CenteredPage>
      <p>您在本學期尚未選擇任何課程，按下右上角的「＋」來加課吧！</p>
    </CenteredPage>);

    return Object.keys(courses).map( (k) => courses[k] ).map( (course) => (<div style={{ margin: '10px 10px 12px' }}><CourseCard selected={true} {...course} onSelectRemove={this.handleCourseRemove} /></div>));
  },

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
      <PageWithBar hasBack pageRouterkey="table" style={this.props.style} title="我的課程" actions={pageAction}>
        {this.getMyCourseCards()}
      </PageWithBar>
    );
  },

  handleAdd() {
    pageNavigateTo('table', '/courses');
  },

  handleCourseRemove(code) {
    this.props.dispatch(doRemoveCourse(code));
  }
});

var MyCoursesPagePreloadPlaceholder = React.createClass({

  render() {
    return (
      <PageWithBar hasBack pageRouterkey="table" style={this.props.style} title="我的課程">
        <CenteredPage>
          <p>載入中</p>
        </CenteredPage>
      </PageWithBar>
    );
  }
});

export default connect(state => ({
  courses: state.table.tableCourses
}))(MyCoursesPage);

export { MyCoursesPagePreloadPlaceholder };
