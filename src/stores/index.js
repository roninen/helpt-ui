import { createStore, applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import { loadUser } from 'redux-oidc';

import userManager from '../util/user-manager';
import rootReducer from '../reducers/index';

const createStoreWithMiddleware = applyMiddleware(apiMiddleware)(createStore);
let store = createStoreWithMiddleware(rootReducer);
loadUser(store, userManager);

export default store;
window.store = store;
