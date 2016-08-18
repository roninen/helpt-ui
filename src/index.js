import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import 'bootstrap-sass';
import { apiMiddleware } from 'redux-api-middleware';

import rootReducer from './reducers/index';

import App from './components/Main';
import DayView from './components/DayView';
import TasksView from './components/TasksView';

var User = () => {
  return <div>Being a user's profile</div>;
};

const createStoreWithMiddleware = applyMiddleware(apiMiddleware)(createStore);
let store = createStoreWithMiddleware(rootReducer);
window.store = store;

// Render the main component into the dom
ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRedirect to="today" />
            <Route path="user/:userId" components={{main: User}} />
            <Route path="user/:userId/tasks" components={{main: TasksView}} />
            <Route path="date/:date" components={{main: DayView, sidebar: TasksView}} />
            <Route path="today" components={{main: DayView, sidebar: TasksView}} />
        </Route>
    </Router>
  </Provider>, document.getElementById('app')
);
