import React from 'react';
import { CallbackComponent } from 'redux-oidc';
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

export default CallbackPage;
