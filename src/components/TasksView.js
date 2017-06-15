import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import * as timeUtils from '../util/time';
import * as dataUtils from '../util/data';
import ExternalLinks from '../util/external-links';
import { DropdownButton, FormControl, Glyphicon, Panel, ListGroup, ListGroupItem, MenuItem } from 'react-bootstrap';
import { selectWorkspaceFilter } from '../actions/index';

class TasksView extends React.Component {
  render() {
    let { user, entries, tasks, momentDate, makeEntryFromTask, undeleteEntry,
          workspaces, activeWorkspaces, dataSources, selectedWorkspace
        } = this.props;

    const makeOrReuseEntryFromTask = (task) => {
      const deletedEntry = dataUtils.findEntryForTask(
        entries, user.profile.sub, task,
        momentDate.format(timeUtils.LINK_DATEFORMAT),
        {findDeleted: true});
      if (deletedEntry) {
        undeleteEntry(deletedEntry);
      }
      else {
        makeEntryFromTask(user.profile.sub, task, momentDate);
      }
    };
    const taskItems = _.map(tasks, (task) => {
        return (
          <ListGroupItem key={task.id}>
              <TaskItem task={task} makeEntryFromTask={makeOrReuseEntryFromTask} momentDate={momentDate} user={user}/>
          </ListGroupItem>);
    });
    const tasksTitle = _.size(tasks) + ' tasks assigned to you';

    let index = 0;
    function getIndex() {
      return `inactive-${++index}`;
    }

    function onMenuItemSelect (key) {
      this.props.selectWorkspace(key);
    }

    function iteratee(acc, value, key) {
      return acc.concat(
        [<MenuItem key={getIndex()} divider />,
         <MenuItem key={getIndex()} header>{dataSources[key].name}</MenuItem>].concat(
           _.map(value, (ws) => <MenuItem onSelect={onMenuItemSelect} eventKey={ws.id} key={ws.id}>{ws.origin_id}</MenuItem>)));
    }
    const menuitems = [<MenuItem key={getIndex()}>Show all</MenuItem>];
    const workspaceFilters = _.reduce(activeWorkspaces, iteratee, menuitems);
    const selectedTitle =  selectedWorkspace ? selectedWorkspace.data_source.name + '/' + selectedWorkspace.origin_id : 'Filter by workspace';

    return (
      <Panel header={tasksTitle}>
          <form>
              <DropdownButton bsStyle="default" title={selectedTitle} id="" className="workspace-select">
                  {workspaceFilters}
              </DropdownButton>
          </form>

          <div className="form-group has-feedback tasks-search">
              <FormControl type="text" placeholder="Search" />
              <Glyphicon glyph="search" className="form-control-feedback" />
          </div>
          <ListGroup fill>
              { taskItems }
          </ListGroup>
      </Panel>
    );
  }
}

export const TaskItem = ({task, makeEntryFromTask}) => {
  const onClick = () => {
    makeEntryFromTask(task);
  };
  const { workspace } = task;
  let taskLink='#!';
  if (workspace.data_source !== undefined && workspace.data_source.type !== undefined) {
    taskLink = ExternalLinks[workspace.data_source.type].link(task);
  }
  return (
    <div className="task-listing-item">
      <a className="btn btn-default time-task-button pull-right" href="#" onClick={onClick} role="button" data-toggle="tooltip" data-placement="left" title="Add to day">
        <span className="fa fa-calendar-plus-o"></span>
      </a>
      <div className="task-listing-item-content">
        <div className="task-source">
          <a href={taskLink} tabIndex="-1">
            <i className="fa fa-github-square task-source-icon" aria-hidden="true"></i>
            <span className="task-source-header">{ task.workspace.origin_id }/{ task.origin_id }</span>
          </a>
        </div>
        <div className="task-description">{ task.name }</div>
      </div>
    </div>
  );
};

function mapStateToProps(state, ownProps) {
  const { user } = ownProps;
  const date = ownProps.routeParams.date || timeUtils.today();
  if (!user) {
    return {tasks: []};
  }
  const tasks = _.pickBy(state.data.task, (task) => {
    return (
      task.assigned_users.includes(user.profile.sub) &&
        !dataUtils.findEntryForTask(state.data.entry, user.profile.sub, task, date));
  });
  let selectedWorkspace = null;
  const wid = state.transient.selectedWorkspace;
  if (wid) {
    selectedWorkspace = state.data.workspace[wid];
  }
  let filteredTasks = tasks;
  if (wid !== null) {
    filteredTasks = _.filter(tasks, (t) => t.workspace == wid);
  }
  const sortedTasks = _.orderBy(filteredTasks, ['updated_at'], ['desc']);
  const workspaces = dataUtils.expandItems(state, state.data.workspace, {data_source: {}});
  return {
    user: user,
    tasks: dataUtils.expandItems(
      state, sortedTasks, {workspace: {data_source: {}}}),
    activeWorkspaces: dataUtils.activeWorkspaces(state, tasks),
    workspaces: workspaces,
    dataSources: state.data.data_source,
    momentDate: moment(date),
    selectedWorkspace: selectedWorkspace ? selectedWorkspace.setIn(['data_source'], state.data.data_source[selectedWorkspace.data_source]) : null
  };
}


const mapDispatchToProps = (dispatch) => {
  return {
    selectWorkspace: (workspaceId) => {
      dispatch(selectWorkspaceFilter(workspaceId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TasksView);
