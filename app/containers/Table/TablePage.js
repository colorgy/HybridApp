import React from 'react';
import { connect } from 'react-redux';
import { RaisedButton, IconButton, SvgIcon } from 'material-ui';
import { pageNavigateTo, pageNavigateBack } from '../../components/PageRouter';
import PageWithBar, { getBarHeight } from '../../components/PageWithBar';
import { getAppTabHeight } from '../../containers/AppTab';
import WeekTable from '../../components/WeekTable';
import CourseTable from '../../components/CourseTable';
import { doSyncUserCourses, doLoadTableCourses, doUpdateCourseDatabase } from '../../actions/tableActions';

var TablePage = React.createClass({

  componentWillMount() {
    this.props.dispatch(doSyncUserCourses());
    this.props.dispatch(doLoadTableCourses());
  },

  render() {

    // Convert courses into events
    var courses = this.props.courses;
    var coursesArray = Object.keys(courses || {}).map( (key) => courses[key] );
    var courseEvents = coursesArray.reduce( (courseEvents, course) => {
      for (let i=1; i<10; i++) {
        if (course[`day_${i}`] && course[`period_${i}`]) {
          if (courseEvents[0] &&
              courseEvents[0].title == course.name &&
              courseEvents[0].day == course[`day_${i}`] &&
              courseEvents[0].periodOrder[courseEvents[0].periodOrder.length - 1] == course[`period_${i}`] - 1) {
            courseEvents[0].periodOrder.push(course[`period_${i}`]);

          } else {
            let courseEvent = {
              day: course[`day_${i}`],
              periodOrder: [course[`period_${i}`]],
              title: course.name,
              location: course[`location_${i}`]
            };

            if (course.lecturer) courseEvent.subtitle = `授課教師：${course.lecturer}`;

            courseEvents.unshift(courseEvent);
          }
        }
      }

      return courseEvents;
    }, []);

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
        <CourseTable periods={this.props.periodData} events={courseEvents} style={{ position: 'absolute', top: getBarHeight(), bottom: getAppTabHeight(), width: '100%' }} />
      </PageWithBar>
    );
  },

  handleAdd() {
    this.props.dispatch(doUpdateCourseDatabase());
  }
});

export default connect(state => ({
  courses: state.table.tableCourses,
  periodData: state.table.tablePeriodData
}))(TablePage);
