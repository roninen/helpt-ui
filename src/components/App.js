import React from 'react';

import { Provider } from 'react-redux';
import { OidcProvider } from 'redux-oidc';

import userManager from '../util/user-manager';

import App from './Main';
import DayView from './DayView';
import TasksView from './TasksView';
import CallbackPage from './CallbackPage';
import ReportPage from './ReportPage';
import LoginPage from './LoginPage';

import { Router, Route, browserHistory, IndexRedirect } from 'react-router';

import store from '../stores/index.js'

export default (
        <Provider store={store}>
        <OidcProvider store={store} userManager={userManager}>
          <Router history={browserHistory}>
              <Route path="/" component={App}>
                  <IndexRedirect to="today" />
                  <Route path="user/:userId/tasks" components={{main: TasksView}} />
                  <Route path="date/:date" components={{main: DayView, sidebar: TasksView}} />
                  <Route path="today" components={{main: DayView, sidebar: TasksView}} />
                  <Route path="callback" components={{main: CallbackPage}} />
                  <Route path="report" components={{main: ReportPage}} />
                  <Route path="logout" components={{main: LoginPage}} />
              </Route>
          </Router>
      </ OidcProvider>
    </Provider>)
