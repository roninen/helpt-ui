import _ from 'lodash';
import { expandItems } from '../util/data'

/*
  {
    total: <sumtotal all projects>
    latest:
    projects: [
      {
        id: <n>,
        total: <sum>,
        users: [
          {
            name:
            id:
            total:
            tasks: [
              name:
              id:
              status:
              estimate: undefined,
              total:
            ]
          }
        ]
      }
    ]
*/

function userName(user) {
  return `${user.first_name} ${user.last_name}`;
}

function expandByTask(data, byTask) {
  return _.map(byTask, (entries, taskId) => {
    return {
      id: taskId,
      name: data.task[taskId].name,
      total: _.reduce(entries, (sum, e) => (sum + e.minutes), 0)/60
    }
  });
}

function expandByUser(data, byUser) {
  return _.map(byUser, (entries, userId) => {
    return {
      id: userId,
      name: userName(data.user[userId]),
      tasks: expandByTask(data, _.groupBy(entries, (e) => e.task.id))
    }
  });
}

function expandByProject(data, byProject) {
  return _.map(byProject, (entries, projectId) => {
    return {
      id: projectId,
      name: projectId && projectId !== 'undefined' ? data.project[projectId].name : 'unknown',
      users: expandByUser(data, _.groupBy(entries, (e) => e.user.id))
    }
  });
}


export function generateReport(state, entryIds) {
  let report = {};
  const entries = _.map(entryIds, (eid) => {
    return state.data.entry[eid];
  });
  const expandedEntries = expandItems(
    state, entries, {task: {workspace: {projects: {}}}, user: {}});
  let fullTotal = _.reduce(entries, (sum, e) => { return (sum + e.minutes) }, 0);
  const groupedByProject = _.groupBy(expandedEntries, (e) => e.task.workspace.projects[0]);
  return {
    ready: true,
    total: fullTotal / 60,
    latest: null,
    projects: expandByProject(state.data, groupedByProject)
  };
}
