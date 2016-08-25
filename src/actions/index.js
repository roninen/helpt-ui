import { CALL_API } from 'redux-api-middleware';
import { bindActionCreators } from 'redux';
import URI from 'urijs';

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

export function modifyEntry(entryId, value) {
  return {
    type: 'MODIFY_ENTRY',
    entryId,
    amount: parseInt(value)
  };
}
