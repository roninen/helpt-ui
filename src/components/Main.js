require('normalize.css/normalize.css');
require('styles/App.scss');

import _ from 'lodash';

import React from 'react';
import { connect } from 'react-redux';

import {
  fetchResource,
  fetchMultipleResources,
  fetchResourceFiltered,
  makeEntryFromTask,
  undeleteEntry } from '../actions/index';

class AppComponent extends React.Component {
  componentWillMount() {
    const { user, fetchUserTasks, fetchLoggedInUser } = this.props;
    if (user === null) {
      fetchLoggedInUser();
      return;
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.user === null) {
      nextProps.fetchLoggedInUser();
      return;
    }
    if (_.size(nextProps.task) == 0) {
      nextProps.fetchUserTasks(nextProps.user);
    }

    // Todo: make this generic. (or use normalizr)
    const reducer = (workspaces, task) => {
      workspaces[task.workspace] = true;
      return workspaces;
    };
    const workspaceIds = _.keys(_.reduce(nextProps.tasks, reducer, {}));
    if (workspaceIds.length) {
      this.props.fetchMultipleResources(['workspace', 'data_source'], workspaceIds);
    }
  }
  render() {
    const { user } = this.props;
    if (user === null) {
      return <div className="container-fluid">Authenticating...</div>;
    }
    const mainComponent = React.cloneElement(
      this.props.main,
      {user});
    const sidebarComponent = React.cloneElement(
      this.props.sidebar,
      {user,
       makeEntryFromTask: this.props.makeEntryFromTask,
       undeleteEntry: this.props.undeleteEntry,
       entries: this.props.entries
      });
    return (
      <div className="index">
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <div className="navbar-brand" href="#">Helpt</div>
          </div>
            <ul className="nav navbar-nav navbar-right">
              <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" tabIndex="-1">
                    { user.first_name + ' ' + user.last_name }
                    <span className="caret"></span></a>
                <ul className="dropdown-menu">
                  <li><a href="#">Reports</a></li>
                  <li role="separator" className="divider"></li>
                  <li><a href="/logout/">Log Out</a></li>
                </ul>
              </li>
            </ul>
        </div>
      </nav>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-7 hours-panel">
            { mainComponent }
          </div>
          <div className="col-sm-5 tasks-panel">
            { sidebarComponent }
          </div>
        </div>
      </div>
      </div>
    );
  }
}

import { loggedInUser } from '../reducers/index';

const mapStateToProps = (state) => {
  const user = loggedInUser(state);
  if (!user) {
    return { user: null, tasks: [] };
  }
  return {
    user,
    entries: state.data.entry,
    tasks: state.data.task
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserTasks: (user) => {
      if (user.id) {
        dispatch(fetchResourceFiltered(['task'], {'filter{assigned_users}': user.id}));
        dispatch(fetchResourceFiltered(['entry'], {'filter{user}': user.id}));
      }
    },
    makeEntryFromTask: (userId, entry, momentDate) => {
      dispatch(makeEntryFromTask(userId, entry, momentDate));
    },
    undeleteEntry: (entry) => {
      dispatch(undeleteEntry(entry));
    },
    fetchMultipleResources: (resourceTypes, ids) => {
      dispatch(fetchMultipleResources(resourceTypes, ids));
    },
    fetchLoggedInUser: () => {
      dispatch(fetchResourceFiltered(['user'], {current: true}, {intention: 'LOGIN'}));
    }
  };
};

AppComponent.defaultProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
