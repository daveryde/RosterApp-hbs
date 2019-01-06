const axios = require('axios');

module.exports = {
  loginUser: newToken => {
    localStorage.setItem('jwtToken', newToken);
    return;
  },
  logoutUser: () => {
    localStorage.removeItem('jwtToken');
    return;
  } //,
  // setAuthToken: token => {
  //   if (token) {
  //     // Apply to every request
  //     axios.defaults.headers.common['Authorization'] = token;
  //   } else {
  //     // Delete auth header
  //     delete axios.defaults.headers.common['Authorization'];
  //   }
  // }
};
