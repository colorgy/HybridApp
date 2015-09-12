import React from 'react';
import { connect } from 'react-redux';
import { doSyncUserCourses, doLoadTableCourses, doUpdateCourseDatabase, doSearchCourse, doAddCourse, doRemoveCourse } from '../../actions/tableActions';
import { pageNavigateTo, pageNavigateBack } from '../../components/PageRouter';
import { Toolbar, ToolbarGroup, TextField, Card, CardHeader, Avatar, RaisedButton, IconButton, SvgIcon } from 'material-ui';
import PageWithBar from '../../components/PageWithBar';
import CourseCard from '../../components/CourseCard';

var CoursesPage = React.createClass({

  componentWillMount() {
    this.props.dispatch(doSyncUserCourses());
    this.props.dispatch(doLoadTableCourses());
  },

  componentWillBeVisibleOnPageRouter() {
    this.props.dispatch(doSyncUserCourses());
    this.props.dispatch(doLoadTableCourses());
  },

  getInitialState() {
    return {
      searchQuery: this.props.searchQuery
    };
  },

  getCourseCards() {
    if (!this.props.searchResult) return [];
    let selectedCourseCodes = Object.keys(this.props.courses);

    let courses = this.props.searchResult;
    return Object.keys(courses).map( (k) => courses[k] ).map( (course) => (<div style={{ margin: '10px 10px 12px' }}><CourseCard selected={selectedCourseCodes.indexOf(course.code) >= 0} {...course} onSelectRemove={this.handleCourseRemove} onSelectAdd={this.handleCourseAdd} /></div>));
  },

  render() {
    return (
      <PageWithBar hasBack pageRouterkey="table" style={this.props.style} title="尋找課程">
        <Toolbar style={{ position: 'relative' }}>
          <input
            style={{
              backgroundColor: 'transparent',
              display: 'block',
              boxSizing: 'border-box',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              border: 0,
              outline: 'none',
              padding: '12px 14px',
              fontSize: 16
            }}
            placeholder="搜尋課名、老師姓名或課程代碼"
            value={this.state.searchQuery}
            onChange={this.handleSearchQueryChange} />
        </Toolbar>
        {this.getCourseCards()}
      </PageWithBar>
    );
  },

  handleSearchQueryChange(e) {
    var query = e.target.value;
    this.setState({ searchQuery: query });
    this.props.dispatch(doSearchCourse(query));
  },

  handleCourseAdd(code) {
    this.props.dispatch(doAddCourse(code));
  },

  handleCourseRemove(code) {
    this.props.dispatch(doRemoveCourse(code));
  }
});

export default connect(state => ({
  courses: state.table.tableCourses,
  searchResult: state.table.courseSearchResult,
  searchResultHash: state.table.courseSearchResultHash,
  searchQuery: state.table.courseSearchQuery
}))(CoursesPage);
