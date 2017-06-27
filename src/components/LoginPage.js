import React from 'react';
import userManager from '../util/user-manager';

class LoginPage extends React.Component {
  onLoginButtonClick(event) {
    event.preventDefault();
    userManager.signinRedirect();
  }

  componentDidMount() {
    if (this.props.location && this.props.location.pathname == '/logout/') {
      userManager.removeUser();
    }
  }

  render() {
    return (
      <div style={styles.root}>
        <h3>Tervetuloa Helsingin kaupungin projektinseurantaan</h3>
        <p>Kirjaudu sisään jatkaaksesi</p>
        <button onClick={this.onLoginButtonClick}>Kirjaudu</button>
      </div>
    );
  }
}

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexShrink: 1
  }
}

export default LoginPage;
