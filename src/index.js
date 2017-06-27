import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import 'bootstrap-sass';
import { apiMiddleware } from 'redux-api-middleware';
import { loadUser, OidcProvider } from 'redux-oidc';

import userManager from './util/user-manager';

import rootReducer from './reducers/index';

import App from './components/Main';
import DayView from './components/DayView';
import TasksView from './components/TasksView';
import CallbackPage from './components/CallbackPage';
import LoginPage from './components/LoginPage';

const createStoreWithMiddleware = applyMiddleware(apiMiddleware)(createStore);
let store = createStoreWithMiddleware(rootReducer);
window.store = store;


loadUser(store, userManager);

// Render the main component into the dom
ReactDOM.render(
  <Provider store={store}>
      <OidcProvider store={store} userManager={userManager}>
          <Router history={browserHistory}>
              <Route path="/" component={App}>
                  <IndexRedirect to="today" />
                  <Route path="user/:userId/tasks" components={{main: TasksView}} />
                  <Route path="date/:date" components={{main: DayView, sidebar: TasksView}} />
                  <Route path="today" components={{main: DayView, sidebar: TasksView}} />
                  <Route path="callback" components={{main: CallbackPage}} />
                  <Route path="logout" components={{main: LoginPage}} />
              </Route>
          </Router>
      </ OidcProvider>
  </Provider>, document.getElementById('app')
);
