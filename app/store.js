import { compose, createStore, applyMiddleware } from 'redux';
import persistState from 'redux-localstorage'
import reducers from './reducers';

import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true,
  predicate: (getState, action) => true
});


const createPersistentStore = compose(
  persistState(['appUser'], { key: 'app_user_store' }),
  createStore
)

const createPersistentStoreWithMiddleware = applyMiddleware(
  loggerMiddleware,
  thunkMiddleware
)(createPersistentStore);

let store = createPersistentStoreWithMiddleware(reducers);

if (window) window.store = store;

export default store;
