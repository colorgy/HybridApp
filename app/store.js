import { compose, createStore } from 'redux';
import persistState from 'redux-localstorage'
import reducers from './reducers';

const createPersistentStore = compose(
  persistState(['appUser'], { key: 'app_user_store' }),
  createStore
)

let store = createPersistentStore(reducers);

export default store;
