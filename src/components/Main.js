require('normalize.css/normalize.css');
require('styles/App.scss');


import React from 'react';

class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">Hours manager</a>
          </div>
            <ul className="nav navbar-nav navbar-right">
              <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Calle Coodari <span className="caret"></span></a>
                <ul className="dropdown-menu">
                  <li><a href="#">Reports</a></li>
                  <li role="separator" className="divider"></li>
                  <li><a href="#">Log Out</a></li>
                </ul>
              </li>
            </ul>
        </div>
      </nav>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-8 hours-panel">
            {this.props.main}
          </div>
          <div className="col-sm-4 tasks-panel">
            {this.props.sidebar}
          </div>
        </div>
      </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
