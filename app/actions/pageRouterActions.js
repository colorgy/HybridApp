import { createAction } from 'redux-actions';

export default {
  pageRouterNavigate: createAction('APP_PAGE_NAVIGATE'),
  pageRouterBack: createAction('APP_PAGE_BACK'),
};
