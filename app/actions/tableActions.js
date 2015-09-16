import { createAction } from 'redux-actions';
import store from '../store';
import colorgyAPI from '../utils/colorgyAPI';
import courseDatabase from '../databases/courseDatabase';
import tableDatabase from '../databases/tableDatabase';

export const initialize = createAction('TABLE_INITIALIZE');
export const checkCourseDatabaseDone = createAction('CHECK_COURSE_DATABASE_DONE');
export const checkCourseDatabaseFailed = createAction('CHECK_COURSE_DATABASE_FAILED');
export const updateCourseDatabase = createAction('UPDATE_COURSE_DATABASE');
export const updateCourseDatabaseProcessing = createAction('UPDATE_COURSE_DATABASE_PROCESSING');
export const courseDatabaseUpdated = createAction('COURSE_DATABASE_UPDATED');
export const courseDatabaseUpdateFaild = createAction('COURSE_DATABASE_UPDATE_FAILD');
export const userHasNoOrganization = createAction('USER_HAS_NO_ORGANIZATION');
export const organizationHasNoCourseData = createAction('ORGANIZATION_HAS_NO_COURSE_DATA');

export const checkCourseDatabase = (courseYear = colorgyAPI.getCurrentYear(), courseTerm = colorgyAPI.getCurrentTerm()) => (dispatch) => {
  courseDatabase.migrate();

  // Check the database update time
  courseDatabase.getDataUpdatedTime(courseYear, courseTerm).then((time) => {
    // if the database has been updated within 6 hours
    if (time && ((new Date()) - parseInt(time)) / (60*60*1000) < 6) {
      // dispatch the updated action to update the DB update time in the store
      dispatch(courseDatabaseUpdated(time));

    } else {
      // update the DB
      dispatch(doUpdateCourseDatabase());

      // report the updated time if exists
      if (time) dispatch(courseDatabaseUpdated(time));
    }

    dispatch(checkCourseDatabaseDone());
  }).catch((e) => {
    console.error(e);
    dispatch(checkCourseDatabaseFailed());
  });
};

export const doUpdateCourseDatabase = (courseYear = colorgyAPI.getCurrentYear(), courseTerm = colorgyAPI.getCurrentTerm()) => (dispatch) => {
  dispatch(updateCourseDatabase());

  courseDatabase.migrate();

  var orgCode = store.getState().appUser.possible_organization_code;

  var progressCallback = (progress) => {
    console.log('doUpdateCourseDatabase: progress: ' + progress);
    dispatch(updateCourseDatabaseProcessing(progress));
  };

  if (orgCode) {
    courseDatabase.updateData(orgCode, courseYear, courseTerm, progressCallback).then( () => {
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

export const doSyncUserCourses = (courseYear = colorgyAPI.getCurrentYear(), courseTerm = colorgyAPI.getCurrentTerm()) => (dispatch) => {
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

export const doLoadTableCourses = () => (dispatch) => {
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

export const doAddCourse = (code) => (dispatch) => {
  dispatch(courseAdded(code));

  tableDatabase.migrate();

  tableDatabase.addUserCourse(code, store.getState().appUser.id, store.getState().appUser.possible_organization_code).then( () => {
    dispatch(doLoadTableCourses());

  }).catch( (e) => {
  });
};

export const doRemoveCourse = (code) => (dispatch) => {
  dispatch(courseRemoved(code));

  tableDatabase.migrate();

  tableDatabase.removeUserCourse(code, store.getState().appUser.id, store.getState().appUser.possible_organization_code).then( () => {
    dispatch(doLoadTableCourses());

  }).catch( (e) => {
  });
};

export const searchCourse = createAction('SEARCH_COURSE');
export const courseSearchResultReceived = createAction('COURSE_SEARCH_RESULT_RECEIVED');

export const doSearchCourse = (query) => (dispatch) => {
  dispatch(searchCourse(query));

  courseDatabase.migrate();

  courseDatabase.searchCourse(query).then( (courses) => {
    dispatch(courseSearchResultReceived(courses));

  }).catch( (e) => {
  });
};
