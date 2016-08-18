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
  user: {}
});

function mergeData(state, newData, meta) {
  const { resourceType, multiple } = meta;
  let toMerge = null;
  if (resourceType in state) {
    if (multiple) {
      toMerge = _.fromPairs(
          _.map(
            newData, (el) => {
              return [el.id, el];}));
      return state.setIn([resourceType], toMerge);
    }
    const id = newData.id;
    return state.setIn([resourceType, id], newData);
  }
  else {
    throw new TypeError('The received resource type is not part of the newData model.');
    return state;
  }
}

function dataReducer(state = initialDataState, action) {
  switch (action.type) {
    case 'REQUEST':
      console.log(`received REQUEST for ${action.meta.resourceType}`);
      break;
    case 'SUCCESS': {
      console.log(action);
      return mergeData(state, action.payload, action.meta);
      //return state.merge(action.payload
    }
  }
  return state;
}

const initialAppState = Immutable({
  loggedInUser: null
});

function appReducer(state = initialAppState, action) {
  switch (action.type) {
    case 'LOGIN':
  }
  return state;
}

export default combineReducers({data: dataReducer, app: appReducer});
