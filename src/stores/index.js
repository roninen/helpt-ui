import { createStore, applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import paginator from '../middleware/paginator';
import { loadUser } from 'redux-oidc';

import userManager from '../util/user-manager';
import rootReducer from '../reducers/index';

const createStoreWithMiddleware = applyMiddleware(apiMiddleware, paginator)(createStore);
let store = createStoreWithMiddleware(rootReducer);
loadUser(store, userManager);

export default store;
window.store = store;
