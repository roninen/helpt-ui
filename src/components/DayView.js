import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { mapUserResourceDispatchToProps } from '../actions/index';
import moment from 'moment';
import * as timeUtils from '../util/time';

class DayView extends React.Component {
  componentWillReceiveProps(props) {
    props.fetchUpdatedResourceForUser('entry', props.user);
  }
  render() {
    const { entries, momentDate } = this.props;
    const entryComponents = _.map(entries, (entry) => {
      return <TimedTask key={entry.id} source={entry.workspace.source || 'github'} entry={entry} tasks={this.props.tasks} hours={timeUtils.minutesToHours(entry.minutes)} />;
    });
    return (
      <div className="panel panel-primary">
          <div className="panel-heading"><DayNavigation momentDate={momentDate} /></div>
          <div className="panel-body">
              { entryComponents }
              <EmptyTaskPrompt />
          </div>
          <div className="panel-footer day-footer"><DayFooter /></div>
      </div>
    );
  }
}

var DateLink = ({to, direction}) => {
  const iconClass = `glyphicon glyphicon-triangle-${direction == 'past' ? 'left' : 'right'}`;
  return (
    <Link to={to} className="btn btn-primary"><span className={iconClass}></span></Link>
  );
};

var PreviousDateLink = ({momentDate}) => {
  const date = momentDate.clone().subtract(1, 'days').format(timeUtils.LINK_DATEFORMAT);
  return <DateLink to={`/date/${date}`} direction='past' />;
};

var NextDateLink = ({momentDate}) => {
  const newDate = momentDate.clone().add(1, 'days');
  if (timeUtils.isFuture(newDate)) {
    return null;
  }
  let to;
  if (timeUtils.isToday(newDate)) {
    to = '/today/';
  }
  else {
    to = `/date/${newDate.format(timeUtils.LINK_DATEFORMAT)}`;
  }
  return <DateLink to={to} direction='future' />;
};

var DayNavigation = ({momentDate}) => {
  return (
    <div className="calendar-navigation-header clearfix">
      <div className="col-xs-2 prev"><PreviousDateLink momentDate={momentDate} /></div>
      <div className="col-xs-8 current-date"><h4>{timeUtils.formatHumanDate(momentDate)}</h4></div>
      <div className="col-xs-2 next text-right"><NextDateLink momentDate={momentDate} /></div>
    </div>
  );
}
 
var EmptyTaskPrompt = () => {
  return (
    <div className="well well-sm add-task-prompt">
      Add tasks from your task list
    </div>
  );
};

var DayFooter = () => {
  return (
    <div className="day-footer panel-body">
      <div className="col-sm-8">Total of the day</div>
      <div className="col-sm-4"><div className="day-total">7.5h</div></div>
    </div>
  );
};

function sourceSystemIcon(source) {
  //using this as default and placemarker for github
  if (source == 'Trello') return 'glyphicon glyphicon-signal task-source-icon';
  return 'glyphicon glyphicon-tree-deciduous task-source-icon';
}

var TimedTask = ({source, hours, entry, tasks}) => {
  var sourceServiceIcon = sourceSystemIcon(source);
  var removeIcon = 'glyphicon glyphicon-minus';
  if (hours == 0) removeIcon = 'glyphicon glyphicon-trash';
  const currentTask = tasks[`${entry.workspace}:${entry.task}`];
  const taskDescription = currentTask ? currentTask.description : null;
  return (
    <div className="panel panel-default">
      <div className="panel-body">
        <div className="col-sm-8">
        <div className="task-source">
          <a href="#link-to-service">
            <span className={sourceServiceIcon}></span>
            <span className="task-source-header">{source}/City-of-Helsinki/servicemap issue#514</span>
          </a>
        </div>
        { taskDescription }
        </div>
        <div className="input-group input-group-lg col-sm-4 hours-entry">
          <span className="input-group-btn"><button className="btn btn-default" type="button"><span className={removeIcon}></span></button></span>
          <input type="text" className="form-control" placeholder="0" defaultValue={hours} />
          <span className="input-group-btn"><button className="btn btn-default" type="button"><span className="glyphicon glyphicon-plus"></span></button></span>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state, ownProps) {
  const { user } = ownProps;
  const date = ownProps.routeParams.date || timeUtils.today();
  if (!user) {
    return {entries: []};
  }
  return {
    entries: _.pickBy(state.data.entry, (entry) => {
      return (
        entry.user == user.id &&
        entry.date == date);
    }),
    tasks: state.data.task,
    momentDate: moment(date)
  };
}

export default connect(mapStateToProps, mapUserResourceDispatchToProps)(DayView);
