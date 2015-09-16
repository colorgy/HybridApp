import { createAction } from 'redux-actions';
import store from '../store';
import colorgyAPI from '../utils/colorgyAPI';
import courseDatabase from '../databases/courseDatabase';
import tableDatabase from '../databases/tableDatabase';

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
      dispatch(doLoadTableCourses());
    }).catch( (e) => {
      if (e === 404) {
        dispatch(organizationHasNoCourseData());
      } else {
        console.error(e);
        dispatch(courseDatabaseUpdateFaild(e));
      }
    });

  // If the app user has no organization
  } else {
    dispatch(userHasNoOrganization());
  }
};

export const syncUserCourses = createAction('SYNC_USER_COURSES');
export const userCoursesSyncDone = createAction('USER_COURSES_SYNC_DONE');
export const userCoursesSyncFaild = createAction('USER_COURSES_SYNC_FAILD');

export const doSyncUserCourses = (courseYear = colorgyAPI.getCurrentYear(), courseTerm = colorgyAPI.getCurrentTerm()) => dispatch => {
  dispatch(syncUserCourses());

  tableDatabase.migrate();

  tableDatabase.syncUserCourses(store.getState().appUser.id, store.getState().appUser.possible_organization_code, courseYear, courseTerm).then(function () {
    dispatch(userCoursesSyncDone());
    dispatch(doLoadTableCourses());
  }).catch(function (e) {
    dispatch(userCoursesSyncFaild());
  });
};

export const loadTableCourse = createAction('LOAD_TABLE_COURSES');
export const tableCourseLoaded = createAction('TABLE_COURSES_LOADED');
export const loadTableCourseFaild = createAction('LOAD_TABLE_COURSES_FAILD');

export const doLoadTableCourses = () => dispatch => {
  dispatch(loadTableCourse());

  courseDatabase.migrate();
  tableDatabase.migrate();

  courseDatabase.getPeriodData().then( (periodData) => {
    tableDatabase.findCourses(store.getState().appUser.id, store.getState().appUser.possible_organization_code).then(function (courses) {
      dispatch(tableCourseLoaded({ courses: courses, periodData: periodData }));
    }).catch( (e) => {
      console.error(e);
      dispatch(loadTableCourseFaild());
    });

  }).catch( (e) => {
    console.error(e);
    dispatch(loadTableCourseFaild());
  });
};

export const courseAdded = createAction('COURSE_ADDED');
export const courseRemoved = createAction('COURSE_REMOVED');

export const doAddCourse = (code) => dispatch => {
  dispatch(courseAdded(code));

  tableDatabase.migrate();

  tableDatabase.addUserCourse(code, store.getState().appUser.id, store.getState().appUser.possible_organization_code).then( () => {
    dispatch(doLoadTableCourses());

  }).catch( (e) => {
  });
};

export const doRemoveCourse = (code) => dispatch => {
  dispatch(courseRemoved(code));

  tableDatabase.migrate();

  tableDatabase.removeUserCourse(code, store.getState().appUser.id, store.getState().appUser.possible_organization_code).then( () => {
    dispatch(doLoadTableCourses());

  }).catch( (e) => {
  });
};

export const searchCourse = createAction('SEARCH_COURSE');
export const courseSearchResultReceived = createAction('COURSE_SEARCH_RESULT_RECEIVED');

export const doSearchCourse = (query) => dispatch => {
  dispatch(searchCourse(query));

  courseDatabase.migrate();

  courseDatabase.searchCourse(query).then( (courses) => {
    dispatch(courseSearchResultReceived(courses));

  }).catch( (e) => {
  });
};
