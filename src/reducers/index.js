import { combineReducers } from 'redux';
import Immutable from 'seamless-immutable';
import _ from 'lodash';

const initialDataState = Immutable({
  entry: {},
  task: {},
  workspace: {},
  data_source: {},
  project: {},
  organization: {},
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
  const { resourceTypes, multiple, endpoint } = meta;
  //return state.setIn(['_apiEndpoints', endpoint], action.type);
  _.each(resourceTypes, (r) => {
    if (!(r in state)) {
      throw new TypeError(`A received resource type is not part of the data model: ${r}`);
    }
  });
  if (!multiple) {
    // A single resource fetched by id is a special
    // case -> map to the general case
    const singularResource = resourceTypes[0];
    newData[singularResource] = [newData[singularResource]];
  }
  const toMerge = (
    _.fromPairs(
      _.map(resourceTypes, (resourceType) => {
        return [resourceType, _.fromPairs(
          _.map(newData[resourceType], (el) => {
            return [el.id, el];
          })
        )];
      })
    )
  );
  return state.merge(
    toMerge,
    {_apiEndpoints: {[endpoint]: actionType}});
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
