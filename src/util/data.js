import _ from 'lodash';

export function findEntryForTask(entries, userId, task, date, options={findDeleted: false}) {
  return _.find(entries, (entry) => {
    return (entry.user == userId &&
            entry.task == task.origin_id &&
            entry.workspace.id == task.workspace &&
            entry.date == date &&
            (entry.state != 'deleted' || (options.findDeleted === true)));
  });
}

function getResourceItems(state, resourceType) {
  return state.data[resourceType];
}

function expandKey(state, unexpandedValue, key) {
  const multiple = Array.isArray(unexpandedValue);
  const subItemIds = multiple ? unexpandedValue : [unexpandedValue];
  const expanded = _.filter(
    getResourceItems(state, key),
    subitem => subItemIds.includes(subitem.id));
  if (subItemIds.length > expanded.length) {
    // If the related data hasn't been fetched
    // yet, don't expand to undefined.
    return unexpandedValue;
  }
  return multiple ? expanded : expanded[0];
}

function itemExpander(state, keysToExpand) {
  return (item) => {
    const expandedSubItems = _.fromPairs(
      _.map(
        keysToExpand,
        key => [key, expandKey(state, item[key], key)]));
    return item.merge(expandedSubItems);
  };
}

export function expandItems(state, items, keysToExpand) {
  return _.map(items, itemExpander(state, keysToExpand));
}
