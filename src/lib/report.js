import _ from 'lodash';
import { expandItems } from '../util/data';

export const GROUPINGS = [
  {id: 'project.user', name: 'Project → User'},
  {id: 'user.date.project', name: 'User → Date → Project'},
  {id: 'user.project.date', name: 'User → Project → Date'}
];

/*
  {
    total: <sumtotal all projects>
    latest:
    type: project
    children: [
      {
        id: <n>,
        total: <sum>,
        type: user,
        children: [
          {
            name:
            id:
            total:
            type: task
            children: [
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
      children: tasks,
      type: 'task',
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
      children: users,
      type: 'user',
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
    type: 'project',
    children: expandByProject(state.data, groupedByProject)
  };
}
