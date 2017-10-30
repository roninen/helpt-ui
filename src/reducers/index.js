import { combineReducers } from 'redux';
import { reducer as oidc } from 'redux-oidc';
import Immutable from 'seamless-immutable';
import _ from 'lodash';
import moment from 'moment';

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


// Helper functions to select state
export function loggedInUser (state) {
  return state.oidc.user;
}

export function getDataObject (state, type, id) {
  return state.data[type][id];
}

// Utility functions

function mergeData(state, newData, meta, actionType) {
  const { multiple, endpoint } = meta;
  const resourceTypes = _.map(meta.resourceTypes, (r) => {
    const split = r.split('.');
    return split[split.length - 1];
  });
  //return state.setIn(['_apiEndpoints', endpoint], action.type);
  _.each(resourceTypes, (r) => {
    if (!(r in state)) {
      throw new TypeError(
        `A received resource type is not part of the data model: ${r}`);
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
        return [resourceType, state[resourceType].merge(_.fromPairs(
          _.map(newData[resourceType], (el) => {
            return [el.id, el];
          })
        ))];
      })
    )
  );
  return state.merge(
    toMerge,
    {_apiEndpoints: {[endpoint]: actionType}});
}

// Reducers

function dataReducer(state = initialDataState, action) {
  if(action.error) {
    throw action.payload;
  }
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

const initialTransientState = {
  selectedWorkspace: null
};


function transientState(state = initialTransientState, action) {
  switch (action.type) {
    case 'USER_SELECT_WORKSPACE_FILTER':
      return {selectedWorkspace: action.payload};
    case 'USER_CLEAR_SELECTED_WORKSPACE_FILTER':
      return {selectedWorkspace: null};
  }
  return state;
}

const initialApiTokenState = {};

function apiToken(state = initialApiTokenState, action) {
  switch (action.type) {
    case 'TOKEN_SUCCESS':
      return action.payload;
    case 'TOKEN_REQUEST':
    case 'TOKEN_FAILURE':
  }
  return state;
}

const initialReportFilterState = Immutable({
  user: null,
  organization: null,
  project: null,
  begin: null,
  end: null
});

function reportFilter(state = initialReportFilterState, action) {
  if (action.type == 'REPORT_FILTER_SET') {
    return state.merge(action.payload);
  }
  else if (action.type == 'REPORT_FILTER_CLEAR') {
    return initialReportFilterState;
  }
  return state;
}

const initialReportRawData = Immutable({
  entry: {},
  latest: null,
  ready: false
});

function reportData(state = initialReportRawData, action) {
  if (action.type === 'REQUEST' && action.meta.intention == 'report') {
    // TODO: bailout messes with this
    return state;
  }
  if (action.type === 'SUCCESS' && action.meta.intention == 'report') {
    const epoch = '1970-01-01';
    let latest;
    if (state.latest) {
      latest = state.latest;
    }
    else {
      latest = epoch;
    }
    const entry = _.fromPairs(_.map(action.payload.entry, (e) => {
      if (moment(e.date).isAfter(moment(latest))) {
        latest = e.date;
      }
      return [[e.id], true];
    }));
    if (epoch === latest) {
      latest = null;
    }
    return Immutable.update(state, 'entry', Immutable.merge, entry).merge({ready: true, latest});
  }
  return state;
}

export default combineReducers({oidc, data: dataReducer, transient: transientState, apiToken, reportFilter, reportData});

