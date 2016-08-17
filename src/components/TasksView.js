import React from 'react';

var TasksView = () => {
  return (
    <div className="panel panel-default">
      <div className="panel-body">
        <h4>All tasks assigned for Current User<br/>
        <small>Calle Coodari has 233 active tasks</small></h4>
        
        <ul className="list-group">
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
    <div className="task-listing-item">
      <div className="add-task"><a className="btn btn-default" href="#" role="button"><span className="glyphicon glyphicon-plus-sign"></span></a></div>
      <div className="task-description">Task assigned to Current User in external issue tracking service</div>
    </div>
  )
}

export default TasksView;
