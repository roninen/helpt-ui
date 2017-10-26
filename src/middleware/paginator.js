import { fetchResource } from '../actions/index';
import _ from 'lodash';

const paginator = ({ dispatch }) => next => action => {
  const result = next(action);
  if (action.type === 'SUCCESS') {
    if (action.payload.meta.page) {
      const nextPage = action.payload.meta.page + 1;
      if (nextPage <= action.payload.meta.total_pages) {
        const { resourceTypes, id, bareEndpoint: endpoint, metadata } = action.meta;
        dispatch(fetchResource(resourceTypes, id, endpoint, metadata, nextPage));
      }
    }
  }

  return result;
};

export default paginator;
