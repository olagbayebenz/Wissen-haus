// Environment-aware API configuration
const API_CONFIG = (() => {
  const hostname = window.location.hostname;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return {
      baseUrl: 'http://localhost:3000/api'
    };
  } else {
    // Production: assume API is at the same domain
    const protocol = window.location.protocol;
    return {
      baseUrl: `${protocol}//${hostname}/api`
    };
  }
})();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = API_CONFIG;
}
