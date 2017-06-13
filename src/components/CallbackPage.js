import React from 'react';
import { connect } from 'react-redux';
import { CallbackComponent } from 'redux-oidc';
import { push } from 'react-router-redux';
import userManager from '../util/user-manager';
import _ from 'lodash';

class CallbackPage extends React.Component {
  successCallback() {
    this.context.router.push('/');
  }
  render() {
    // just redirect to '/' in both cases
    const successCallback = _.bind(this.successCallback, this);
    return (
      <CallbackComponent userManager={userManager} successCallback={successCallback} errorCallback={this.successCallback}>
        <div>
          Redirecting...
        </div>
      </CallbackComponent>
    );
  }
}

CallbackPage.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state, ownProps, ...args) {
  return ownProps;
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CallbackPage);
