import { handleActions } from 'redux-actions';

var defaultState = {};

export default handleActions({

  CHECK_COURSE_DATABASE_DONE: (state, action) => {
    return {
      ...state,
      checkCourseDatabaseDone: true
    };
  },

  UPDATE_COURSE_DATABASE: (state, action) => {
    return {
      ...state,
      courseDatabaseUpdating: true
    };
  },

  COURSE_DATABASE_UPDATED: (state, action) => {
    return {
      ...state,
      courseDatabaseUpdating: false,
      courseDatabaseUpdateSuccess: true,
      courseDatabaseUpdatedAt: action.payload,
      userHasNoOrganization: false,
      organizationHasNoCourseData: false
    };
  },

  COURSE_DATABASE_UPDATE_FAILD: (state, action) => {
    return {
      ...state,
      courseDatabaseUpdating: false,
      courseDatabaseUpdateSuccess: false
    };
  },

  ORGANIZATION_HAS_NO_COURSE_DATA: (state, action) => {
    return {
      ...state,
      courseDatabaseUpdating: false,
      organizationHasNoCourseData: true
    };
  },

  USER_HAS_NO_ORGANIZATION: (state, action) => {
    return {
      ...state,
      courseDatabaseUpdating: false,
      userHasNoOrganization: true
    };
  },

  LOGOUT: (state, action) => {
    return defaultState;
  }
}, defaultState);
