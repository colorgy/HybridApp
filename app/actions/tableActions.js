import { createAction } from 'redux-actions';
import store from '../store';
import colorgyAPI from '../utils/colorgyAPI';
import courseDatabase from '../databases/courseDatabase';

export const initialize = createAction('TABLE_INITIALIZE');
export const checkCourseDatabaseDone = createAction('CHECK_COURSE_DATABASE_DONE');
export const updateCourseDatabase = createAction('UPDATE_COURSE_DATABASE');
export const courseDatabaseUpdated = createAction('COURSE_DATABASE_UPDATED');
export const courseDatabaseUpdateFaild = createAction('COURSE_DATABASE_UPDATE_FAILD');
export const userHasNoOrganization = createAction('USER_HAS_NO_ORGANIZATION');
export const organizationHasNoCourseData = createAction('ORGANIZATION_HAS_NO_COURSE_DATA');

export const checkCourseDatabase = () => dispatch => {
  courseDatabase.migrate();

  // Check the database update time
  courseDatabase.executeSql("SELECT * FROM info WHERE key = 'current_courses_updated_at'")
    .then(function (result) {
      // if the database has been updated within 6 hours
      if (result.results.rows.length && result.results.rows.item(0) && ((new Date()) - parseInt(result.results.rows.item(0).value)) / (60*60*1000) < 6) {
        // dispatch the updated action to update the DB update time in the store
        dispatch(courseDatabaseUpdated(parseInt(result.results.rows.item(0).value)));

      } else {
        // update the DB
        dispatch(doUpdateCourseDatabase());
      }

      dispatch(checkCourseDatabaseDone());
    });
};

export const doUpdateCourseDatabase = (courseYear = colorgyAPI.getCurrentYear(), courseTerm = colorgyAPI.getCurrentTerm()) => dispatch => {
  dispatch(updateCourseDatabase());

  courseDatabase.migrate();

  var orgCode = store.getState().appUser.possible_organization_code;

  if (orgCode) {
    courseDatabase.updateData(orgCode, courseYear, courseTerm).then( () => {
      dispatch(courseDatabaseUpdated((new Date()).getTime()));
    }).catch( (e) => {
      if (e === 404) {
        dispatch(organizationHasNoCourseData());
      } else {
        dispatch(courseDatabaseUpdateFaild(e));
      }
    });

  // If the app user has no organization
  } else {
    dispatch(userHasNoOrganization());
  }
};

export const syncUserCourses = createAction('SYNC_USER_COURSES');
export const receivedUserCourses = createAction('RECEIVED_USER_COURSES');
export const userCoursesDeleted = createAction('USER_COURSES_DELETED');
export const userCoursesSyncDone = createAction('USER_COURSES_SYNC_DONE');
export const userCoursesSyncFaild = createAction('USER_COURSES_SYNC_FAILD');

export const doSyncUserCourses = (courseYear = colorgyAPI.getCurrentYear(), courseTerm = colorgyAPI.getCurrentTerm()) => dispatch => {
  dispatch(syncUserCourses());

  courseDatabase.migrate();

  var orgCode = store.getState().appUser.possible_organization_code;

  var url = `/me/user_courses.json?per_page=1000&filter[course_organization_code]=${orgCode}&filter[year]=${courseYear}&filter[term]=${courseTerm}`;

  colorgyAPI.request({ url: url }).then( (response) => {
    var userCourses = response.body;
    dispatch(receivedUserCourses(userCourses);
    dispatch(userCoursesSyncDone(new Date()));
  }).catch( (e) => {
    console.error(e);
    dispatch(userCoursesSyncDone(e));
  });
};

export const searchCurrentCourses = (query) => dispatch => {
  courseDatabase.executeSql('SELECT * FROM info WHERE key = "updated_at"').then( (r) => {
    if (r.results.rows.length) {
      dispatch(updateCourseDatabase());
      var orgCode = store.getState().appUser.possible_organization_code;
    }
  })
};
