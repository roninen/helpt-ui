require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import { connect } from 'react-redux';

import { fetchResource } from '../actions/index';

class AppComponent extends React.Component {
  componentWillMount() {
    this.props.fetchUser(this.props.user);
  }
  render() {
    const mainComponent = React.cloneElement(
      this.props.main,
      {user: this.props.user});
    const sidebarComponent = React.cloneElement(
      this.props.sidebar,
      {user: this.props.user});
    return (
      <div className="index">
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">Helpt</a>
          </div>
            <ul className="nav navbar-nav navbar-right">
              <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                    { this.props.user.name }
                    <span className="caret"></span></a>
                <ul className="dropdown-menu">
                  <li><a href="#">Reports</a></li>
                  <li role="separator" className="divider"></li>
                  <li><a href="#">Log Out</a></li>
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
    return { user: {name: '<not logged in>'} };
  }
  return { user };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchUser: (user) => {
      if (user.id) {
        dispatch(fetchResource('user', user.id));
      }
    }
  };
};

AppComponent.defaultProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
