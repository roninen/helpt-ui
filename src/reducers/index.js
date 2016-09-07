import { combineReducers } from 'redux';
import Immutable from 'seamless-immutable';
import _ from 'lodash';

const initialDataState = Immutable({
  entry: {},
  task: {},
  workspace: {},
  system: {},
  project: {},
  organisation: {},
  user: {},
  _apiEndpoints: {}
});

const initialAppState = Immutable({
  loggedInUser: 1
});

// Helper functions to select state
export function loggedInUser (state) {
  const userData = state.data.user[state.app.loggedInUser];
  if (userData !== undefined) {
    return userData;
  }
  return {id: state.app.loggedInUser, _fetchState: 'INITIAL'};
}

export function getDataObject (state, type, id) {
  return state.data[type][id];
}

// Utility functions

function mergeData(state, newData, meta, actionType) {
  const { resourceType, multiple, endpoint } = meta;
  //return state.setIn(['_apiEndpoints', endpoint], action.type);
  if (resourceType in state) {
    if (multiple) {
      const toMerge = (
        _.fromPairs(
          _.map(newData, (el) => {
            let id = el.id;
            if (resourceType == 'task') {
              id = `${el.workspace}:${el.origin_id}`;
            }
            return [id, el];})));
      return state.merge(
        {[resourceType]: toMerge},
        {_apiEndpoints: {[endpoint]: actionType}});
    }
    return state.merge(
      {[resourceType]: state[resourceType].merge({[newData.id]: newData})},
      {_apiEndpoints: {[endpoint]: actionType}}
    );
  }
  else {
    throw new TypeError('The received resource type is not part of the newData model.');
  }
}

// Reducers

function dataReducer(state = initialDataState, action) {
  switch (action.type) {
    case 'FAILURE':
    case 'REQUEST':
      const { endpoint } = action.meta;
      return state.setIn(['_apiEndpoints', endpoint], action.type);
    case 'SUCCESS':
      return mergeData(state, action.payload, action.meta, action.type);
    default:
      break;
  }
  return state;
}

function appReducer(state = initialAppState, action) {
  switch (action.type) {
    case 'LOGIN':
      return mergeData(state, {loggedInUser: action.user});
  }
  return state;
}

export default combineReducers({data: dataReducer, app: appReducer});
