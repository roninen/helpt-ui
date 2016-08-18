import React from 'react';

var TasksView = () => {
  return (
    <div className="panel panel-default task-listing-view">
      <div className="panel-body">
        <h4>Your assigned tasks<br/>
        <small>You have 233 active tasks</small></h4>
        <ul className="list-group">
          <li className="list-group-item"><TaskItem /></li>
          <li className="list-group-item"><TaskItem /></li>
          <li className="list-group-item"><TaskItem /></li>
          <li className="list-group-item"><TaskItem /></li>
          <li className="list-group-item"><TaskItem /></li>
          <li className="list-group-item"><TaskItem /></li>
          <li className="list-group-item"><TaskItem /></li>
        </ul>
      </div>
    </div>
  );
}

var TaskItem = () => {
  return (
    <div className="task-listing-item row">
      <div className="task-listing-item-content col-xs-10">
        <div className="task-source">
          <a href="#link-to-service">
            <span className="glyphicon glyphicon-tree-deciduous task-source-icon"></span>
            <span className="task-source-header">Github/City-of-Helsinki/servicemap issue#514</span>
          </a>
        </div>
        <div className="task-description">Task assigned to Current User in external issue tracking service</div>
      </div>
      <div className="task-listing-item-actions col-xs-2">
        <a className="btn btn-default btn-lg time-task-button" href="#" role="button" data-toggle="tooltip" data-placement="left" title="Add to day"><span className="glyphicon glyphicon-time"></span></a>
      </div>
    </div>
  )
}

export default TasksView;
