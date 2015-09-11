import { handleActions } from 'redux-actions';

var initialState = {
  checkCourseDatabaseDone: false
};

var defaultState = {
  ...initialState
};

export default handleActions({

  TABLE_INITIALIZE: (state, action) => {
    return {
      ...state,
      ...initialState
    };
  },

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

  LOAD_TABLE_COURSES: (state, action) => {
    return {
      ...state,
      tableCourseLoading: true
    };
  },

  TABLE_COURSES_LOADED: (state, action) => {
    return {
      ...state,
      tableCourses: action.payload.courses,
      tablePeriodData: action.payload.periodData,
      tableCourseLoading: false
    };
  },

  LOAD_TABLE_COURSES_FAILD: (state, action) => {
    return {
      ...state,
      tableCourseLoading: false
    };
  },

  SEARCH_COURSE: (state, action) => {
    return {
      ...state,
      courseSearchQuery: action.payload
    };
  },

  COURSE_SEARCH_RESULT_RECEIVED: (state, action) => {
    return {
      ...state,
      courseSearchResult: action.payload,
      courseSearchResultHash: (new Date()).getTime()
    };
  },

  LOGOUT: (state, action) => {
    return defaultState;
  }
}, defaultState);
