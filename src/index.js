import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';

import App from './components/Main';
import 'bootstrap-sass';

var EntryList = (props) => {
  let {date} = props.params;
  return <div>Being a list of entries for {date}</div>;
};

var User = () => {
  return <div>Being a user's profile</div>;
};

var TaskList = () => {
  return <div>Being a list of tasks</div>;
};

// Render the main component into the dom
ReactDOM.render(
  <Router history={browserHistory}>
      <Route path="/" component={App}>
          <IndexRedirect to="today" />
          <Route path="user/:userId" component={User} />
          <Route path="user/:userId/tasks" component={TaskList} />
          <Route path="date/:date" component={EntryList} />
          <Route path="today" component={EntryList} />
      </Route>
  </Router>, document.getElementById('app')
);
