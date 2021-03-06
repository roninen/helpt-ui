import _ from 'lodash';

export function findEntryForTask(entries, userId, task, date, options={findDeleted: false}) {
  return _.find(entries, (entry) => {
    return (entry.user == userId &&
            entry.task == task.id &&
            entry.date == date &&
            (entry.state != 'deleted' || (options.findDeleted === true)));
  });
}

function getResourceItems(state, resourceType) {
  let attempt = state.data[resourceType];
  if (attempt) return attempt;
  if (resourceType[resourceType.length - 1] == 's') {
    // TODO: rude attempt to remove plural
    return state.data[resourceType.slice(0, resourceType.length - 1)];
  }
  return null;
}

function expandKey(state, unexpandedValue, key, keysToExpand) {
  const multiple = Array.isArray(unexpandedValue);
  const subItemIds = multiple ? unexpandedValue : [unexpandedValue];
  let expanded = _.filter(
    getResourceItems(state, key),
    subitem => subItemIds.includes(subitem.id));
  if (subItemIds.length > expanded.length) {
    // If the related data hasn't been fetched
    // yet, don't expand to undefined.
    return unexpandedValue;
  }
  if (_.size(keysToExpand)) {
    expanded = expandItems(state, expanded, keysToExpand);
  }
  return multiple ? expanded : expanded[0];
}

function itemExpander(state, keysToExpand) {
  return (item) => {
    const expandedSubItems = _.fromPairs(
      _.map(
        _.keys(keysToExpand),
        key => [key, expandKey(state, item[key], key, keysToExpand[key])]));
    return item.merge(expandedSubItems);
  };
}

export function activeWorkspaces(state, tasks) {
  function workspaceMatch(ws) {
    return _.find(tasks, (t) => t.workspace == ws.id);
  }
  const workspaces = expandItems(state, _.filter(state.data.workspace, workspaceMatch), {data_source: {}});
  return _.groupBy(workspaces, (ws) => ws.data_source.id);
}

export function expandItems(state, items, keysToExpand) {
  return _.map(items, itemExpander(state, keysToExpand));
}

export function collapseItem(item, keysToCollapse) {
  const collapsed = _.map(keysToCollapse, key => {
    let value = item[key];
    const multiple = Array.isArray(value);
    if (!multiple) {
      value = [value];
    }
    let ids = _.map(value, x => x.id || x);
    const result = multiple ? ids : ids[0];
    return [key, result];
  });
  const collapsedByKey = _.fromPairs(collapsed);
  return item.merge(collapsedByKey);
}
