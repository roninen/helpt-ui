import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { mapUserResourceDispatchToProps } from '../actions/index';
import * as timeUtils from '../util/time';
import * as dataUtils from '../util/data';

class TasksView extends React.Component {
  componentWillReceiveProps(props) {
    props.fetchUpdatedResourceForUser('task', props.user);
  }
  render() {
    let { user, tasks, momentDate, makeEntryFromTask } = this.props;
    const taskItems = _.map(tasks, (task) => {
        return (
          <li key={task.workspace + ':' + task.origin_id} className="list-group-item">
              <TaskItem task={task} makeEntryFromTask={makeEntryFromTask} momentDate={momentDate} user={user}/>
          </li>);
    });
    return (
      <div className="panel panel-default task-listing-view">
          <div className="panel-body">
              <h4>Tasks assigned to you<br/>
                  <small>You have { _.size(tasks) } active tasks that can be selected for this date.</small></h4>
              <ul className="list-group">
                  { taskItems }
              </ul>
          </div>
      </div>
    );
  }
}

export const TaskItem = ({task, makeEntryFromTask, user, momentDate}) => {
  const onClick = () => {
    makeEntryFromTask(user.id, task, momentDate);
  };
  return (
    <div className="task-listing-item row">
      <div className="task-listing-item-content col-xs-10">
        <div className="task-source">
          <a href="#link-to-service" tabIndex="-1">
            <span className="glyphicon glyphicon-tree-deciduous task-source-icon"></span>
            <span className="task-source-header">Github/City-of-Helsinki/{ task.workspace } issue#{ task.origin_id }</span>
          </a>
        </div>
        <div className="task-description">{ task.description }</div>
      </div>
      <div className="task-listing-item-actions col-xs-2 text-right">
        <a className="btn btn-default btn-lg time-task-button" href="#" onClick={onClick} role="button" data-toggle="tooltip" data-placement="left" title="Add to day">
          <span className="glyphicon glyphicon-time"></span>
        </a>
      </div>
    </div>
  );
};

function mapStateToProps(state, ownProps) {
  const { user } = ownProps;
  const date = ownProps.routeParams.date || timeUtils.today();
  if (!user) {
    return {tasks: []};
  }
  return {
    user: user,
    tasks: _.pickBy(state.data.task, (task) => {
      return (
        task.assigned == user.id &&
          !dataUtils.findEntryForTask(state, user.id, task, date));
    }),
    momentDate: moment(date)
  };
}



export default connect(mapStateToProps, mapUserResourceDispatchToProps)(TasksView);
