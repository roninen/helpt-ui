import { createUserManager } from 'redux-oidc';

require('process');
const OPENID_CONNECT_CLIENT_ID = process.env.OPENID_CONNECT_CLIENT_ID;

const userManagerConfig = {
  client_id: OPENID_CONNECT_CLIENT_ID,
  redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/callback`,
  response_type: 'id_token',
  scope: 'openid profile', // https://www.googleapis.com/auth/youtube.readonly',
  authority: 'https://api.hel.fi/sso-test/openid/',
  silent_redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/silent_renew.html`,
  automaticSilentRenew: true,
  filterProtocolClaims: true,
  loadUserInfo: true
};

const userManager = createUserManager(userManagerConfig);

export default userManager;
