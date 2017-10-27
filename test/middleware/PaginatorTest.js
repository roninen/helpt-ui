/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

import _ from 'lodash';
import sinon from 'sinon';

import paginator from '../../src/middleware/paginator';
import { fetchResource } from 'actions/index';

function matchingAction(page, max=5) {
  return {
    type: 'SUCCESS',
    payload: {
      meta: {
        page,
        total_pages: max
      }
    },
    meta: {
      resourceTypes: ['a', 'b'],
      bareEndpoint: 'abc'
    }
  };
}

describe('Paginator middleware', () => {
  it('should dispatch next page fetch when necessary', () => {
    const mockDispatch = sinon.spy();
    const mockNext = sinon.spy();
    const mockStore = {
      dispatch: mockDispatch
    };
    const middlewareHandler = paginator(mockStore)(mockNext);
    const action = matchingAction(1, 5);
    middlewareHandler(action);
    assert(mockDispatch.calledOnce);
    const { resourceTypes, bareEndpoint } = action.meta;
    const fetchAction = fetchResource(resourceTypes, undefined, bareEndpoint, undefined, 3);
    assert(mockDispatch.calledWith(fetchAction));
    assert(mockNext.calledOnce);
  });

  it('should not dispatch next page fetch when at last page', () => {
    const mockDispatch = sinon.spy();
    const mockNext = sinon.spy();
    const mockStore = {
      dispatch: mockDispatch
    };
    const middlewareHandler = paginator(mockStore)(mockNext);
    middlewareHandler(matchingAction(5, 5));
    assert(mockDispatch.notCalled);
    assert(mockNext.calledOnce);
  });

  const nonMatchingAction = {
    type: 'ANYTHING_ELSE'
  };
});
