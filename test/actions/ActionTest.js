/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

import {
  shouldBailOut
} from 'actions/index';

describe('API request actions', () => {
  const state = {data: {_apiEndpoints: {x: 'REQUEST'}}};
  it('should bail if the endpoint is set in the state', () => {
    expect(shouldBailOut(state, 'x')).to.be.true;
  });
  it('should not bail out if the endpoint is not set in the state', () => {
    expect(shouldBailOut(state, 'y')).to.be.false;
  });
});
