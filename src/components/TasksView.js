import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { mapUserResourceDispatchToProps } from '../actions/index';

class TasksView extends React.Component {
  componentWillReceiveProps(props) {
    props.fetchUpdatedResourceForUser('task', props.user);
  }
  render() {
    let { tasks } = this.props;
    const taskItems = _.map(tasks, (task) => {
        return (
          <li key={task.workspace + ':' + task.origin_id} className="list-group-item">
              <TaskItem task={task} />
          </li>);
    });
    return (
      <div className="panel panel-default task-listing-view">
          <div className="panel-body">
              <h4>Your assigned tasks<br/>
                  <small>You have { _.size(tasks) } active tasks</small></h4>
              <ul className="list-group">
                  { taskItems }
              </ul>
          </div>
      </div>
    );
  }
}

export const TaskItem = ({task}) => {
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
      <div className="task-listing-item-actions col-xs-2">
        <a className="btn btn-default btn-lg time-task-button" href="#" role="button" data-toggle="tooltip" data-placement="left" title="Add to day"><span className="glyphicon glyphicon-time"></span></a>
      </div>
    </div>
  );
};

function mapStateToProps(state, ownProps) {
  const { user } = ownProps;
  if (!user) {
    return {tasks: []};
  }
  return {
    tasks: _.pickBy(state.data.task, (task) => {
      return task.assigned == user.id;
    })
  };
}

export default connect(mapStateToProps, mapUserResourceDispatchToProps)(TasksView);
