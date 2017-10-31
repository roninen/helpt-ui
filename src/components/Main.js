require('normalize.css/normalize.css');
require('styles/App.scss');
require('react-datetime/css/react-datetime.css');

import _ from 'lodash';

import React from 'react';
import { connect } from 'react-redux';
import LoginPage from './LoginPage';
import { Nav, Navbar, NavDropdown, MenuItem } from 'react-bootstrap';
import ReportPage from './ReportPage';

import {
  fetchMultipleResources,
  fetchResource,
  fetchResourceFiltered,
  makeEntryFromTask,
  undeleteEntry,
  fetchApiToken } from '../actions/index';

import userManager from '../util/user-manager';

class AppComponent extends React.Component {
  componentWillMount() {
    this.props.fetchResource(['workspace', 'data_source']);
    this.props.fetchResource(['user']);
    this.props.fetchResource(['organization']);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.user === null && nextProps.apiToken) {
      nextProps.fetchLoggedInUser();
      return;
    }
    if (nextProps.user !== null &&
        nextProps.user.access_token !== null &&
        !nextProps.apiToken) {
      nextProps.fetchApiToken(nextProps.user.access_token);
      return;
    }
    if (_.size(nextProps.task) == 0 && nextProps.apiToken) {
      nextProps.fetchUserTasks(nextProps.user);
    }
  }

  logOut() {
    userManager.removeUser();
  }

  render() {
    const { user, location, apiToken } = this.props;
    if (this.props.location.pathname !== '/callback' && user === null) {
      return <LoginPage />;
    }
    // TODO: this is just a hack to get report page showing without sidebar.
    if (this.props.location.pathname == '/report') {
      return <ReportPage />;
    }
    if (!this.props.main) {
      return <div>error</div>;
    }
    const mainComponent = React.cloneElement(
      this.props.main,
      {user, location, apiToken});
    let sidebarComponent = null;
    if (this.props.sidebar) {
      sidebarComponent = React.cloneElement(
        this.props.sidebar,
        {user,
         makeEntryFromTask: this.props.makeEntryFromTask,
         undeleteEntry: this.props.undeleteEntry,
         entries: this.props.entries
        });
    }

    let dropdownTitle = (
      <span>
        <span className="glyphicon glyphicon-user" />{' '}{user && user.profile ? user.profile.nickname : ''}
      </span>);

    const logOut = _.bind(this.logOut, this);

    return (
      <div className="index">
        <Navbar inverse fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Helpt</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav pullRight>
            <NavDropdown title={dropdownTitle} id="navbar-user-dropdown">
              <MenuItem onClick={logOut}>Log out</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar>

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
  if (!user || user.expired) {
    return { user: null, tasks: [] };
  }
  return {
    user,
    entries: state.data.entry,
    tasks: state.data.task,
    apiToken: state.apiToken
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserTasks: (user) => {
      if (user.profile.sub) {
        dispatch(fetchResourceFiltered(['task'], {
          'user': user.profile.sub
        }));
        dispatch(fetchResourceFiltered(['entry'], {'filter{user.id}': user.profile.sub}));
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
    },
    fetchApiToken: (accessToken) => {
      dispatch(fetchApiToken(accessToken));
    },
    fetchResource: (resourceTypes) => {
      dispatch(fetchResource(resourceTypes));
    }
  };
};

AppComponent.defaultProps = {
    className: 'index'
};

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
