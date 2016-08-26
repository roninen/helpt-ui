import { CALL_API, getJSON } from 'redux-api-middleware';
import { bindActionCreators } from 'redux';
import URI from 'urijs';
import * as timeUtils from '../util/time';

const API_BASE_URL = 'http://localhost:3000';

function getEndPoint(resourceType, id) {
  let base = `${API_BASE_URL}/${resourceType}/`;
  if (id) {
    return base + id;
  }
  return base;
}

function shouldBailOut(state, endpoint) {
  return state.data._apiEndpoints[endpoint];
}

export function fetchResource(resourceType, id, endpoint = getEndPoint(resourceType, id)) {
  return {
    [CALL_API]: {
      endpoint: endpoint,
      method: 'GET',
      types: [
        {type: 'REQUEST', meta: { resourceType, endpoint }},
        {type: 'SUCCESS', meta: { resourceType, multiple: !id, endpoint}},
        {type: 'FAILURE', meta: { resourceType, endpoint }}
      ],
      bailout: (state) => {
        return shouldBailOut(state, endpoint);
      }
    }
  };
}

export function fetchResourceFiltered(resourceType, filters) {
  var uri = new URI(getEndPoint(resourceType));
  uri.search(filters);
  return fetchResource(resourceType, null, uri.toString());
}

export function fetchUpdatedResourceForUser (resource, user) {
  return fetchResourceFiltered(resource, {user: user.id});
}

export function mapUserResourceDispatchToProps(dispatch) {
  return bindActionCreators({fetchUpdatedResourceForUser}, dispatch);
}

export function modifyResource(resourceType, id, object) {
  const endpoint = getEndPoint(resourceType, id);
  const body = JSON.stringify(object);
  return {
    [CALL_API]: {
      endpoint: endpoint,
      method: 'PUT',
      types: [
        {type: 'REQUEST', meta: { resourceType, endpoint }},
        {type: 'SUCCESS', meta: { resourceType, multiple: false, endpoint},
         payload: (action, state, res) => {
           return getJSON(res);
        }},
        {type: 'FAILURE', meta: { resourceType, endpoint }}
      ],
      body: body,
      headers: { 'Content-Type': 'application/json' },
      bailout: false
    }
  };
}

export function deleteEntry(entry) {
  const deletedEntry = entry.merge({state: 'deleted'});
  return modifyResource('entry', entry.id, deletedEntry);
}

export function createResource(resourceType, object) {
  const endpoint = getEndPoint(resourceType);
  const body = JSON.stringify(object);
  return {
    [CALL_API]: {
      endpoint: endpoint,
      method: 'POST',
      types: [
        {type: 'REQUEST', meta: { resourceType, endpoint }},
        {type: 'SUCCESS', meta: { resourceType, multiple: false, endpoint},
         payload: (action, state, res) => {
           return getJSON(res);
        }},
        {type: 'FAILURE', meta: { resourceType, endpoint }}
      ],
      body: body,
      headers: { 'Content-Type': 'application/json' },
      bailout: false
    }
  };
}

export function makeEntryFromTask(userId, task, momentDate) {
  const newEntry = {
    user: userId,
    task: task.origin_id,
    workspace: task.workspace,
    date: momentDate.format(timeUtils.LINK_DATEFORMAT),
    minutes: 0
  };
  return createResource('entry', newEntry);
}
