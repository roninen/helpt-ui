import React from 'react';
import { Grid, Row, Col, FormGroup, FormControl, ControlLabel, Table, Panel, Well, Label, Glyphicon, ButtonToolbar, DropdownButton, MenuItem  } from 'react-bootstrap';
import Datetime from 'react-datetime';
import 'moment/locale/fi';

class ReportPage extends React.Component {

  render() {
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
          <div className="main-content">
            <h2>Hours Report</h2>
              <form className="report-filters">
                <Row>
                <Col sm={6}>
                  <FormGroup
                    controlId="formBasicText"
                  >
                    <ControlLabel>User/Organisation</ControlLabel>
                    <FormControl
                      type="text"
                      placeholder="Placeholder here / this should be predictive dropdown"
                    />
                    <FormControl.Feedback />
                  </FormGroup>
                </Col>
                <Col sm={6}>
                  <FormGroup
                    controlId="formBasicText"
                  >
                    <ControlLabel>Project</ControlLabel>
                    <ButtonToolbar>
                      <DropdownButton title="All projects" id="dropdown-size-medium" block>
                        <MenuItem eventKey="1">Project 1</MenuItem>
                        <MenuItem eventKey="2">Project 2</MenuItem>
                        <MenuItem eventKey="3">Project 3</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey="4">Project 4</MenuItem>
                      </DropdownButton>
                    </ButtonToolbar>
                  </FormGroup>
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
                  </Col>
                </Row>
              </form>
          </div>
        </Grid>
      </section>
      <section className="report-contents">
        <Grid>
          <Well>
            <h3>AOK 10.9.2017 - 23.9.2017</h3>
            <p>Latest entry: Wed 20.9.2017 9:31</p>
            <p>Total hours: 10</p>
          </Well>
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
      </section>
    </div>

    );
  }
}

export default ReportPage;
