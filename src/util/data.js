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
