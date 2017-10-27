/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/
'use strict';

import _ from 'lodash';
import Immutable from 'seamless-immutable';

import {
  expandItems
} from '../../src/util/data';

describe('Data utils expandItems', () => {
  const state = Immutable({
    data: {
      x: {
        1: {id: 1, name: 'x1'},
        2: {id: 2, name: 'x2'},
        3: {id: 3, name: 'x3'}
      },
      y: {
        1: {id: 1, name: 'y1', x: 1},
        2: {id: 2, name: 'y2', x: 1},
        3: {id: 3, name: 'y3', x: 3}
      }}});
  const expanded = expandItems(state, state.data.y, {x: {name: {}}});
  const expected = [
    {id: 1, name: 'y1', x: {id: 1, name: 'x1'}},
    {id: 2, name: 'y2', x: {id: 1, name: 'x1'}},
    {id: 3, name: 'y3', x: {id: 3, name: 'x3'}}
  ];
  it('should expand specified keys from normalized data', () => {
    expect(expanded).to.deep.equal(expected);
  });
});
