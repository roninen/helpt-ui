import React from 'react';
import { connect } from 'react-redux';

import { Grid, Row, Col, FormGroup, FormControl, ControlLabel, Well,
         Glyphicon, ButtonToolbar, DropdownButton, MenuItem, Button  } from 'react-bootstrap';
import Datetime from 'react-datetime';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

import moment from 'moment';

import _ from 'lodash';

import { generateReport, GROUPINGS } from '../lib/report';
import { fetchResourceFiltered, selectReportProject, selectReportGrouping,
         filterEntriesForReport, setReportDates } from '../actions/index';
import ProjectsSummary from './ProjectsSummary';

class UserOrganizationSuggestions extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      matching: false
    };
  }

  onValueChange = (ev) => {
    this.setState({
      value: ev.target.value,
      matching: ev.target.value.toLowerCase() == 'juha yrjölä'
    });
  }

  render() {
    let validationState = null;
    if (this.state.value.length) {
      validationState = this.state.matching ? 'success' : 'warning';
    }

    return (
      <FormGroup controlId="formBasicText" validationState={validationState}>
        <ControlLabel>User/Organisation</ControlLabel>
        <FormControl
          value={this.state.value}
          type="text"
          onChange={this.onValueChange}
          placeholder="Placeholder here / this should be predictive dropdown"
        />
        <FormControl.Feedback />
      </FormGroup>
    );
  }
}

class ProjectMenu extends React.Component {
  onProjectSelect = (key) => {
    this.props.selectReportProject(key);
  }
  render() {
    const { projects, selectedProject } = this.props;
    const menuItems = _.map(projects, (p) => {
      return <MenuItem key={p.id} active={p.id === selectedProject} eventKey={p.id} onSelect={this.onProjectSelect}>{p.name}</MenuItem>;
    });
    const selectedProjectObject = _.find(projects, (p) => selectedProject === p.id);
    let dropdownButtonTitle = 'All projects';
    if (selectedProjectObject) {
      dropdownButtonTitle = selectedProjectObject.name;
    }
    return (
      <FormGroup controlId="formBasicText">
      <ControlLabel>Project</ControlLabel>
      <ButtonToolbar>
      <DropdownButton title={dropdownButtonTitle} id="dropdown-size-medium" block>
        <MenuItem key='clear' eventKey='clear' active={selectedProject === null} onSelect={this.onProjectSelect}>All projects</MenuItem>
        <MenuItem divider />
        { menuItems }
      </DropdownButton>
      </ButtonToolbar>
      </FormGroup>
    );
  }
}

class GroupingMenu extends React.Component {
  onGroupingSelect = (key) => {
    this.props.selectReportGrouping(key);
  }
  render() {
    const { selectedGrouping } = this.props;
    const menuItems = _.map(GROUPINGS, (g) => {
      return <MenuItem key={g.id} active={g.id === selectedGrouping} eventKey={g.id} onSelect={this.onGroupingSelect}>{g.name}</MenuItem>;
    });
    const selectedGroupingObject = _.find(GROUPINGS, (g) => selectedGrouping === g.id);
    const dropdownButtonTitle = selectedGroupingObject.name;
    return (
      <FormGroup controlId="formBasicText">
      <ControlLabel>Group by</ControlLabel>
      <ButtonToolbar>
      <DropdownButton title={dropdownButtonTitle} id="dropdown-size-medium" block>
        { menuItems }
      </DropdownButton>
      </ButtonToolbar>
      </FormGroup>
    );
  }
}

class ReportFilterForm extends React.Component {
  getReport = () => {
    const begin = this.beginInput.state.selectedDate;
    const end = this.endInput.state.selectedDate;
    this.props.setReportDates(begin, end);
    this.props.getReport(this.props.filter, {begin, end});
  }
  render() {
    const { filter } = this.props;
    return (
      <div className="main-content">
        <h2>Hours Report</h2>
        <form className="report-filters">
          <Row>
            <Col sm={6}>
            </Col>
            <Col sm={6}>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Row>
                <Col xs={5}>
                  <FormGroup>
                    <ControlLabel>Starting</ControlLabel>
                    <Datetime ref={(input) => this.beginInput = input} timeFormat={false} locale="en" input={true} />
                  </FormGroup>
                </Col>
                <Col xs={2}>
                  <div className="timespan-icon"><Glyphicon glyph="arrow-right" /></div>
                </Col>
                <Col xs={5}>
                  <FormGroup>
                    <ControlLabel>Ending</ControlLabel>
                    <Datetime ref={(input) => this.endInput = input} timeFormat={false} locale="en" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                <GroupingMenu selectedGrouping={filter.grouping} groupins={this.props.groupings} selectReportGrouping={this.props.selectReportGrouping} />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                <Button onClick={this.getReport}>Create report</Button>
                </Col>
              </Row>
            </Col>
            <Col sm={6}>
              <ProjectMenu selectedProject={filter.project} projects={this.props.projects} selectReportProject={this.props.selectReportProject} />
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

function ReportHeader({filter, latest, total, report}) {
  let name = '';
  if (filter.user) {
    name = `${filter.user.first_name} ${filter.user.last_name}`;
  }
  else if (filter.organization) {
    name = filter.organization.name;
  }
  function dateFmt(date) {
    return moment(date).format('ddd MM-DD-YYYY');
  }
  let dateRange = null;
  if (filter.begin) {
    dateRange = dateFmt(filter.begin);
    if (filter.end) {
      dateRange += ' – ';
    }
  }
  if (filter.end) {
    dateRange += dateFmt(filter.end);
  }
  const latestEntry = latest ? `Latest entry: ${dateFmt(latest)}` : null;
  let projectsSummary = null;
  if (report.children.length > 1 && report.type === 'project') {
    projectsSummary = <Well><ProjectsSummary report={report}/></Well>;
  }
  return (
    <div className="results-header">
    <Well>
      <h3>{name} { dateRange }</h3>
      <p>{latestEntry}</p>
      <p>Total hours: {total}</p>
    </Well>
    { projectsSummary }
    </div>
  );
}

function ReportTable({projectLog, grouping}) {
  const uniquify = vals => _.uniq(vals).join(' & ');
  const columns = [
    {
      Header: 'User',
      accessor: 'user',
      aggregate: uniquify,
      show: (grouping !== 'user')
    },
    {
      Header: 'Task',
      accessor: 'taskName'
    },
    {
      Header: 'Status',
      accessor: 'taskState',
      maxWidth: 100,
      aggregate: uniquify
    },
    {
      Header: 'Date',
      accessor: 'date',
      maxWidth: 200,
      aggregate: (vals) => {
        const moments = _.map(vals, (v) => {
          return moment(v);
        });
        const max = moment.max(moments);
        const min = moment.min(moments);
        if (max.isSame(min)) {
          return max.format('YYYY-MM-DD');
        }
        return `${min.format('YYYY-MM-DD')}…${max.format('YYYY-MM-DD')}`;
      }
    },
    { Header: 'Project',
      accessor: 'projectName',
      show: (grouping !== 'project'),
      aggregate: uniquify
    },
    {
      Header: 'Minutes',
      accessor: 'minutes',
      maxWidth: 100,
      aggregate: vals => _.sum(vals),
      Footer: (
        <span>
            <strong>Total:</strong>{" "}
            {_.sum(_.map(projectLog.entries, d => d.minutes))}
        </span>
      )
    }
  ];
  return (
    <div>
        <h4>{projectLog.name}</h4>
        <ReactTable
            data={projectLog.entries}
            columns={columns}
            minRows={5}
            pivotBy={['user'], ['taskName']}
            showPageJump={false}
            />
    </div>
  );
}

function Report({filter, report}) {
  const reports = _.map(report.children, (p, i) => {
    return <ReportTable key={i} projectLog={p} grouping={filter.grouping} />;
  });
  return (
    <Grid>
    <ReportHeader report={report} filter={filter} latest={report.latest} total={report.total} />
    { reports }
    </Grid>
  );
}

class ReportPage extends React.Component {
  componentWillMount() {
    this.props.fetchProjects();
  }

  render() {
    const { filter, report, projects } = this.props;
    if (_.size(projects == 0)) {
      return <div>Loading...</div>;
    }
    let reportComponent = null;
    if (report.ready) {
      reportComponent = <Report filter={filter} report={report} />;
    }
    return (
      <div className="report">
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <div className="navbar-brand" href="#">Helpt</div>
          </div>
            <ul className="nav navbar-nav navbar-right">
              <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" tabIndex="-1">
                    User
                    <span className="caret"></span></a>
                <ul className="dropdown-menu">
                  <li><a href="#">Reports</a></li>
                  <li role="separator" className="divider"></li>
                  <li><a href="/logout/">Log Out</a></li>
                </ul>
              </li>
            </ul>
        </div>
      </nav>

      <section className="header-section">
        <Grid>
          <ReportFilterForm
              filter={filter}
              projects={projects}
              selectReportProject={this.props.selectReportProject}
              selectReportGrouping={this.props.selectReportGrouping}
              getReport={this.props.getReport}
              setReportDates={this.props.setReportDates} />
        </Grid>
      </section>
      <section className="report-contents">
        { reportComponent }
      </section>
    </div>

    );
  }
}


function calculateReport(state) {
  if (state.reportData.ready === false) {
    return {
      ready: false
    };
  }
  return generateReport(state, _.keys(state.reportData.entry), state.reportFilter.grouping);
}

function mapStateToProps(state) {
  return {
    filter: state.reportFilter,
    report: calculateReport(state),
    projects: _.values(state.data.project)
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchProjects: () => {
      dispatch(fetchResourceFiltered(['project'], {}));
    },
    selectReportProject: (key) => {
      dispatch(selectReportProject(key));
    },
    selectReportGrouping: (key) => {
      dispatch(selectReportGrouping(key));
    },
    getReport: (filter, opts) => {
      dispatch(filterEntriesForReport(filter, opts));
    },
    setReportDates: (begin, end) => {
      dispatch(setReportDates(begin, end));
    }
    // setReportFilter,
    // clearReportFilter,
    // updateReport,
    // clearReport
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportPage);
