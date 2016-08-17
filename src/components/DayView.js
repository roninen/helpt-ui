import React from 'react';

var TestBar = (props) => {
  return (
    <span className="killer-app" data-name={props.name}>It's really {props.name} crappy!</span>
  );
}

var DayView = () => {
  return (
    <div className="panel panel-primary">
      <div className="panel-heading"><DayNavigation /></div>
      <div className="panel-body">
        <TimedTask />
        <TimedTask />
        <TimedTask />
        <EmptyTaskPrompt />
      </div>
      <div className="panel-footer day-footer"><DayFooter /></div>
    </div>
  );
}

var DayNavigation = () => {
  return (
    <div className="calendar-navigation-header row">
      <div className="col-xs-1 prev"><span className="glyphicon glyphicon-triangle-left"></span></div>
      <div className="col-xs-10 current-date"><h4>Wednesday 17.8.2016</h4></div>
      <div className="col-xs-1 next"><span className="glyphicon glyphicon-triangle-right"></span></div>
    </div>
  );
}
 
var EmptyTaskPrompt = () => {
  return (
    <div className="panel panel-default add-task-prompt">
      <div className="panel-body">Add tasks from your task list</div>
    </div>
  );
}

var DayFooter = () => {
  return (
    <div className="day-footer panel-body">
      <div className="col-sm-9">Total of the day</div>
      <div className="col-sm-3"><div className="day-total">7.5h</div></div>
    </div>
  );
}

var TimedTask = () => {
  return (
    <div className="panel panel-default">
      <div className="panel-body">
        <div className="col-sm-9">
        Task added to daily tasklist for time tracking
        </div>
        <div className="input-group input-group-lg col-sm-3 hours-entry">
          <span className="input-group-btn"><button className="btn btn-primary" type="button">-</button></span>
          <input type="text" className="form-control" placeholder="0" />
          <span className="input-group-btn"><button className="btn btn-primary" type="button">+</button></span>
        </div>
      </div>
    </div>
  );
}


export default DayView;
