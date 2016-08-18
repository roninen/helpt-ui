import React from 'react';

var DayView = () => {
  return (
    <div className="panel panel-primary">
      <div className="panel-heading"><DayNavigation /></div>
      <div className="panel-body">
        <TimedTask source="Github" hours="2.5" />
        <TimedTask source="Trello" hours="2.5" />
        <TimedTask source="Github" hours="0" />
        <EmptyTaskPrompt />
      </div>
      <div className="panel-footer day-footer"><DayFooter /></div>
    </div>
  );
}

var DayNavigation = () => {
  return (
    <div className="calendar-navigation-header clearfix">
      <div className="col-xs-2 prev"><a className="btn btn-primary"><span className="glyphicon glyphicon-triangle-left"></span></a></div>
      <div className="col-xs-8 current-date"><h4>Wednesday 17.8.2016</h4></div>
      <div className="col-xs-2 next text-right"><a className="btn btn-primary"><span className="glyphicon glyphicon-triangle-right"></span></a></div>
    </div>
  );
}
 
var EmptyTaskPrompt = () => {
  return (
    <div className="well well-sm add-task-prompt">
      Add tasks from your task list
    </div>
  );
}

var DayFooter = () => {
  return (
    <div className="day-footer panel-body">
      <div className="col-sm-8">Total of the day</div>
      <div className="col-sm-4"><div className="day-total">7.5h</div></div>
    </div>
  );
}

var TimedTask = (props) => {
  var sourceServiceIcon = "glyphicon glyphicon-tree-deciduous task-source-icon"; //using this as default and placemarker for github
  if (props.source == "Trello") sourceServiceIcon = "glyphicon glyphicon-signal task-source-icon";
  var removeIcon = "glyphicon glyphicon-minus";
  if (props.hours == 0) removeIcon = "glyphicon glyphicon-trash";
  return (
    <div className="panel panel-default">
      <div className="panel-body">
        <div className="col-sm-8">
        <div className="task-source">
          <a href="#link-to-service">
            <span className={sourceServiceIcon}></span>
            <span className="task-source-header">{props.source}/City-of-Helsinki/servicemap issue#514</span>
          </a>
        </div>
        Task added to daily tasklist for time tracking
        </div>
        <div className="input-group input-group-lg col-sm-4 hours-entry">
          <span className="input-group-btn"><button className="btn btn-default" type="button"><span className={removeIcon}></span></button></span>
          <input type="text" className="form-control" placeholder="0" value={props.hours} />
          <span className="input-group-btn"><button className="btn btn-default" type="button"><span className="glyphicon glyphicon-plus"></span></button></span>
        </div>
      </div>
    </div>
  );
}


export default DayView;
