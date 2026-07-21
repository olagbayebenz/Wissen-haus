// Environment-aware API configuration
const API_CONFIG = (() => {
  const hostname = window.location.hostname;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return {
      baseUrl: 'http://localhost:3000/api'
    };
  } else {
    // Production: use Vercel backend
    return {
      baseUrl: 'https://wissenhaus-backend-6bh66oejo-olagbayebenz-7030s-projects.vercel.app/api'
    };
  }
})();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = API_CONFIG;
}
