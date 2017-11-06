import _ from 'lodash';
import { expandItems } from '../util/data';

/*
  {
    total: <sumtotal all projects>
    latest:
    projects: [   // TODO: rename to children, add type tag (more generic)
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
      state: data.task[taskId].state,
      total: _.reduce(entries, (sum, e) => (sum + e.minutes), 0)/60
    };
  });
}

function expandByUser(data, byUser) {
  return _.map(byUser, (entries, userId) => {
    const tasks = _.sortBy(expandByTask(data, _.groupBy(entries, (e) => e.task.id)), (t) => { return -t.total; });
    const userTotal = _.reduce(tasks, (sum, t) => (sum + t.total), 0);
    return {
      id: userId,
      name: userName(data.user[userId]),
      tasks: tasks,
      total: userTotal
    };
  });
}

function expandByProject(data, byProject) {
  return _.map(byProject, (entries, projectId) => {
    const users = expandByUser(data, _.groupBy(entries, (e) => e.user.id));
    const projectTotal = _.reduce(users, (sum, u) => (sum + u.total), 0);
    return {
      id: projectId,
      name: projectId && projectId !== 'undefined' ? data.project[projectId].name : 'unknown',
      users: users,
      total: projectTotal
    };
  });
}


export function generateReport(state, entryIds) {
  // TODO: memoize
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
    latest: state.reportData.latest,
    projects: expandByProject(state.data, groupedByProject)
  };
}
