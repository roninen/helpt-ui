import _ from 'lodash';

import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import TimedTask from './TimedTask';

import {modifyResource } from '../actions/index';

import moment from 'moment';
import * as timeUtils from '../util/time';
import * as dataUtils from '../util/data';

class DayView extends React.Component {
  render() {
    const { entries, momentDate, modifyResource } = this.props;
    const filteredEntries = _.filter(_.values(entries), (entry) => { return entry.state != 'deleted'; });
    const entryComponents = _.map(filteredEntries, (entry, index) => {
      const source = (entry.task.workspace.data_source !== undefined) ? entry.task.workspace.data_source.type : 'github';
      return (<TimedTask
              key={entry.id}
              entryIndex={index}
              modifyResource={modifyResource}
              source={source}
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
          <DayFooter totalMinutes={totalMinutes} />
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
      <div className="row">
        <div className="col-xs-2 prev"><PreviousDateLink momentDate={momentDate} /></div>
        <div className="col-xs-8 current-date"><h4>{timeUtils.formatHumanDate(momentDate)}</h4></div>
        <div className="col-xs-2 next text-right"><NextDateLink momentDate={momentDate} /></div>
      </div>
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
    <div className="day-footer panel-footer">
      <div className="row">
        <div className="col-sm-8">Total of the day</div>
        <div className="col-sm-4"><div className="day-total">{timeUtils.minutesToHours(totalMinutes)} h</div></div>
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
    entries: dataUtils.expandItems(state, _.pickBy(state.data.entry, entry => (
      entry.user == user.profile.sub && entry.date == date
    )), {task: {workspace: {data_source: {}}}}),
    tasks: dataUtils.expandItems(state, state.data.task, {workspace: {}}),
    momentDate: moment(date)
  };
}

const mapDispatchToProps = {
  modifyResource
};

export default connect(mapStateToProps, mapDispatchToProps)(DayView);
