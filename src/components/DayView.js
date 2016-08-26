import _ from 'lodash';

import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import TimedTask from './TimedTask';

import {
  fetchUpdatedResourceForUser,
  modifyResource } from '../actions/index';

import moment from 'moment';
import * as timeUtils from '../util/time';

class DayView extends React.Component {
  render() {
    const { entries, momentDate, modifyResource } = this.props;
    const filteredEntries = _.filter(_.values(entries), (entry) => { return entry.state != 'deleted'; });
    const entryComponents = _.map(filteredEntries, (entry, index) => {
      return (<TimedTask
              key={entry.id}
              entryIndex={index}
              modifyResource={modifyResource}
              source={entry.workspace.source || 'github'}
              entry={entry}
              tasks={this.props.tasks}
              persistedMinutes={entry.minutes} />);
    });
    const totalMinutes = _.reduce(filteredEntries, (sum, entry) => { return sum + entry.minutes; }, 0);
    return (
      <div className="panel panel-primary">
          <div className="panel-heading"><DayNavigation momentDate={momentDate} /></div>
          <div className="panel-body">
              { entryComponents }
              <EmptyTaskPrompt taskCount={filteredEntries.length} />
          </div>
          <div className="panel-footer day-footer"><DayFooter totalMinutes={totalMinutes} /></div>
      </div>
    );
  }
}

var DateLink = ({to, direction}) => {
  const iconClass = `glyphicon glyphicon-triangle-${direction == 'past' ? 'left' : 'right'}`;
  return (
    <Link to={to} className="btn btn-primary" tabIndex="-1"><span className={iconClass}></span></Link>
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
 
var EmptyTaskPrompt = ({taskCount}) => {
  const more = taskCount > 0 ? 'more' : '';
  return (
    <div className="well well-sm add-task-prompt">
      Add {more} tasks from your list of assigned tasks
    </div>
  );
};

var DayFooter = ({totalMinutes}) => {
  return (
    <div className="day-footer panel-body">
      <div className="col-sm-8">Total of the day</div>
      <div className="col-sm-4"><div className="day-total">{timeUtils.minutesToHours(totalMinutes)} hours</div></div>
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

const mapDispatchToProps = {
  modifyResource
};

export default connect(mapStateToProps, mapDispatchToProps)(DayView);
