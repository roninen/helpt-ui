import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';

import App from './components/Main';
import DayView from './components/DayView';
import TasksView from './components/TasksView';
import 'bootstrap-sass';

var User = () => {
  return <div>Being a user's profile</div>;
};

// Render the main component into the dom
ReactDOM.render(
  <Router history={browserHistory}>
      <Route path="/" component={App}>
          <IndexRedirect to="today" />
          <Route path="user/:userId" components={{main: User}} />
          <Route path="user/:userId/tasks" components={{main: TasksView}} />
          <Route path="date/:date" components={{main: DayView, sidebar: TasksView}} />
          <Route path="today" components={{main: DayView, sidebar: TasksView}} />
      </Route>
  </Router>, document.getElementById('app')
);
