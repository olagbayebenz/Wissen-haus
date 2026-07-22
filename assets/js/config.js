// Environment-aware API configuration
const API_CONFIG = (() => {
  const hostname = window.location.hostname;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return {
      baseUrl: 'http://localhost:3000/api',
      headers: {}
    };
  } else {
    return {
      baseUrl: 'https://wissenhaus-backend-production.up.railway.app/api',
      headers: {}
    };
  }
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = API_CONFIG;
}
