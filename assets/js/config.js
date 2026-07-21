// Environment-aware API configuration
const API_CONFIG = (() => {
  const hostname = window.location.hostname;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return {
      baseUrl: 'http://localhost:3000/api',
      headers: {}
    };
  } else {
    // Production: use Railway backend
    return {
      baseUrl: 'https://wissenhaus-backend-production.up.railway.app/api',
      headers: {}
    };
  }
})();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = API_CONFIG;
}
