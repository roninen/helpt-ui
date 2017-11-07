import _ from 'lodash';
import { expandItems } from '../util/data';

export const GROUPINGS = [
  {id: 'project', name: 'Project'},
  {id: 'user', name: 'User'},
];

function userName(user) {
  return `${user.first_name} ${user.last_name}`;
}

const highLevelGroupings = {
  project: {
    // TODO: this should be grouped by the entry task project, not the workspace project
    // (the task will only have one project).
    group: (e) => e.task.workspace.projects[0],
    presentation: (x) => x.name,
    resource: 'project'
  },
  user: {
    resource: 'user',
    group: (e) => e.user.id,
    presentation: (x) => userName(x),
    toRow: (x) => {return {user: userName(x)};}
  },
  task: {
    resource: 'task',
    group: (e) => e.task.id,
    presentation: (x) => x.name,
    toRow: ({name, state}) => {return {taskName: name, taskState: state};}
  }
};

function expandFields(data, groupedEntries, grouping) {
   return _.map(groupedEntries, (originalEntries, groupId) => {
     const name = grouping.presentation(data[(grouping.resource)][groupId]);
     const entries = _.map(originalEntries, (entry) => {
       return _.reduce(entry, (acc, val, key) => {
         if (val instanceof Object) {
           return Object.assign({}, acc, highLevelGroupings[key].toRow(val));
         }
         return Object.assign({}, acc, {key: val});
       }, {});
     });
     return {name, entries};
   });
}

export function generateReport(state, entryIds, groupingKey) {
  // TODO: memoize
  const entries = _.map(entryIds, (eid) => state.data.entry[eid]);
  const fullTotal = _.reduce(entries, (sum, e) => (sum + e.minutes), 0);
  const expandedEntries = expandItems(state, entries,
                                      {task: {workspace: {projects: {}}}, user: {}});

  const grouping = highLevelGroupings[groupingKey];
  const groupedEntries = _.groupBy(expandedEntries, grouping.group);
  return {
    ready: true,
    total: fullTotal / 60,
    latest: state.reportData.latest,
    children: expandFields(state.data, groupedEntries, grouping)
  };
}
