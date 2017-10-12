import React from 'react';
import { connect } from 'react-redux';

import { Grid, Row, Col, FormGroup, FormControl, ControlLabel, Table, Well, Label,
         Glyphicon, ButtonToolbar, DropdownButton, MenuItem, Button  } from 'react-bootstrap';
import Datetime from 'react-datetime';

import moment from 'moment';
import 'moment/locale/fi';

import { expandItems } from '../util/data';
import { generateReport } from '../lib/report';
import { fetchResourceFiltered, selectReportProject,
         filterEntriesForReport } from '../actions/index'

class UserOrganizationSuggestions extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      matching: false
    };
  }

  onValueChange = (ev) => {
    const oldMatching = this.state.matching;
    this.setState({
      value: ev.target.value,
      matching: ev.target.value.toLowerCase() == 'juha yrjölä'
    });
  }

  render() {
    let validationState = null;
    if (this.state.value.length) {
      validationState = this.state.matching ? 'success' : 'warning'
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
      return <MenuItem key={p.id} active={p.id === selectedProject} eventKey={p.id} onSelect={this.onProjectSelect}>{p.name}</MenuItem>
    });
    const selectedProjectObject = _.find(projects, (p) => selectedProject === p.id);
    let dropdownButtonTitle = 'All projects'
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

class ReportFilterForm extends React.Component {
  getReport = () => {
    this.props.getReport(this.props.filter);
  }
  render() {
    const { filter } = this.props;
    return (
      <div className="main-content">
        <h2>Hours Report</h2>
        <form className="report-filters">
          <Row>
            <Col sm={6}>
              <UserOrganizationSuggestions />
            </Col>
            <Col sm={6}>
              <ProjectMenu selectedProject={filter.project} projects={this.props.projects} selectReportProject={this.props.selectReportProject} />
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Row>
                <Col xs={5}>
                  <FormGroup>
                    <ControlLabel>Starting</ControlLabel>
                    <Datetime timeFormat={false} locale="fi" input={true} />
                  </FormGroup>
                </Col>
                <Col xs={2}>
                  <div className="timespan-icon"><Glyphicon glyph="arrow-right" /></div>
                </Col>
                <Col xs={5}>
                  <FormGroup>
                    <ControlLabel>Ending</ControlLabel>
                    <Datetime timeFormat={false} locale="fi" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                <Button onClick={this.getReport}>Create report</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

function ReportHeader({filter, latest, total}) {
  let name = '';
  if (filter.user) {
    name = `${filter.user.first_name} ${filter.user.last_name}`
  }
  else if (filter.organization) {
    name = filter.organization.name;
  }
  function dateFmt(date) {
    return moment(date).format('ddd ll');
  }
  return (
    <Well>
      <h3>{name} {dateFmt(filter.begin)} &ndash; {dateFmt(filter.end)}</h3>
      <p>Latest entry: {dateFmt(latest)}</p>
      <p>Total hours: {total}</p>
    </Well>
  );
}

function Report({filter, report}) {
  return (
    <Grid>
    <ReportHeader filter={filter} latest={report.latest} total={report.total} />
    <Table responsive className="report-table">
      <thead>
        <tr>
          <th colSpan="5">
            <h4>Project 2</h4>
          </th>
        </tr>
        <tr>
          <th>User</th>
          <th>Task</th>
          <th>Status</th>
          <th className="text-right">Estimate</th>
          <th className="text-right">Hours</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Kaisa Kehittäjä</td>
          <td>
            <div className="task-listing-item-content">
              <div className="task-source"><a tabIndex="-2" href="https://trello.com/c/598ae652f38d421a141f9b10"><i aria-hidden="true" className="fa task-source-icon fa-trello"></i><span className="task-source-header">Aok:n kanban</span></a></div>
              <div className="task-description"><a tabIndex="-1" href="https://trello.com/c/598ae652f38d421a141f9b10">Helpt-kälin raportointinäkymien visuaalinen koodaus</a></div>
            </div>
          </td>
          <td><Label bsStyle="success">Done</Label></td>
          <td className="text-right">2.5</td>
          <td className="text-right">5</td>
        </tr>
        <tr>
          <td>Kaisa Kehittäjä</td>
          <td>
            <div className="task-listing-item-content">
              <div className="task-source"><a tabIndex="-2" href="https://trello.com/c/598ae652f38d421a141f9b10"><i aria-hidden="true" className="fa task-source-icon fa-trello"></i><span className="task-source-header">Aok:n kanban</span></a></div>
              <div className="task-description"><a tabIndex="-1" href="https://trello.com/c/598ae652f38d421a141f9b10">Helpt-kälin raportointinäkymien visuaalinen koodaus</a></div>
            </div>
          </td>
          <td><Label bsStyle="success">Done</Label></td>
          <td className="text-right">2.5</td>
          <td className="text-right">5</td>
        </tr>
        <tr>
          <td>Kaisa Kehittäjä</td>
          <td>
            <div className="task-listing-item-content">
              <div className="task-source"><a tabIndex="-2" href="https://trello.com/c/598ae652f38d421a141f9b10"><i aria-hidden="true" className="fa task-source-icon fa-trello"></i><span className="task-source-header">Aok:n kanban</span></a></div>
              <div className="task-description"><a tabIndex="-1" href="https://trello.com/c/598ae652f38d421a141f9b10">Helpt-kälin raportointinäkymien visuaalinen koodaus</a></div>
            </div>
          </td>
          <td><Label bsStyle="success">Done</Label></td>
          <td className="text-right">2.5</td>
          <td className="text-right">5</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="4" className="text-right">Project total</td><td className="text-right">10</td>
        </tr>
      </tfoot>
    </Table>
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
      return <div>Loading...</div>
    }
    let reportComponent = null;
    if (report.ready) {
      console.log(report);
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
          <ReportFilterForm filter={filter} projects={projects} selectReportProject={this.props.selectReportProject} getReport={this.props.getReport} />
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
  return generateReport(state, _.keys(state.reportData.entry));
}

function mapStateToProps(state, ownProps) {
  return {
    filter: state.reportFilter,
    report: calculateReport(state),
    projects: _.values(state.data.project)
  }
}

const setReportFilter = null;
const clearReportFilter = null;
const updateReport = null;
const clearReport = null;

const mapDispatchToProps = (dispatch) => {
  return {
    fetchProjects: () => {
      dispatch(fetchResourceFiltered(['project'], {}));
    },
    selectReportProject: (key) => {
      dispatch(selectReportProject(key));
    },
    getReport: (filter) => {
      dispatch(filterEntriesForReport(filter));
    }
    // setReportFilter,
    // clearReportFilter,
    // updateReport,
    // clearReport
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportPage);
