import bundle from './ODC-Mouse-FormsCoBraLab-Mouse-Weight-Form.js'

// The base production URL for your instance (e.g., https://demo.opendatacapture.org)
const BASE_URL = 'http://localhost:5500';

// The credentials for a user with permission to create instruments (e.g., initial admin)
const CREDENTIALS = {
  password: 'test1Passwo123',
  username: 'testusername'
};



const accessToken = await fetch(`${BASE_URL}/v1/auth/login`, {
  body: JSON.stringify(CREDENTIALS),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  method: 'POST'
})
  .then((response) => response.json())
  .then(({ accessToken }) => accessToken);

const response = await fetch(`${BASE_URL}/v1/instruments`, {
  body: JSON.stringify({ bundle }),
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  method: 'POST'
});

console.log(`${response.status} ${response.statusText}`);