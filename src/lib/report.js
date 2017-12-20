import _ from 'lodash';
import { expandItems } from '../util/data';

export const GROUPINGS = [
  {id: 'project', name: 'Project'},
  {id: 'user', name: 'User'}
];

function userName(user) {
  if ((user.first_name && user.first_name.length > 0) || (user.last_name && user.last_name.length > 0)) {
    return `${user.first_name} ${user.last_name}`;
  }
  return user.email;
}

const MISSING_PROJECT_NAME = 'Missing project';

const highLevelGroupings = {
  project: {
    // TODO: this should be grouped by the entry task project, not the workspace project
    // (the task will only have one project).
    group: (e) => e.task.workspace.projects.length > 0 ? e.task.workspace.projects[0].id : 'missing_project',
    presentation: (x) => x ? x.name : MISSING_PROJECT_NAME,
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
    toRow: ({name, state, workspace}) => {
      return {
        taskName: name,
        taskState: state,
        projectName: workspace.projects.length > 0 ? workspace.projects[0].name : MISSING_PROJECT_NAME
      };
    }
  }
};

function expandFields(data, groupedEntries, grouping) {
   return _.map(groupedEntries, (originalEntries, groupId) => {
     const name = grouping.presentation(data[(grouping.resource)][groupId]);
     const entries = _.map(originalEntries, (entry) => {
       return _.reduce(entry, (acc, val, key) => {
         if (val instanceof Object) {
           return Object.assign(acc, highLevelGroupings[key].toRow(val));
         }
         return Object.assign(acc, {[key]: val});
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
                                      {task: {workspace: {projects: {name: {}}}}, user: {}});
  const grouping = highLevelGroupings[groupingKey];
  const groupedEntries = _.groupBy(expandedEntries, grouping.group);
  return {
    ready: true,
    total: fullTotal / 60,
    latest: state.reportData.latest,
    children: expandFields(state.data, groupedEntries, grouping)
  };
}
