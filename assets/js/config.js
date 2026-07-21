// Environment-aware API configuration
const API_CONFIG = (() => {
  const hostname = window.location.hostname;
  const bypassSecret = 'BoPWioFfAtObrjgZGXhej1Y2nSLoTbRu';

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return {
      baseUrl: 'http://localhost:3000/api',
      headers: {}
    };
  } else {
    // Production: use Vercel backend with bypass header
    return {
      baseUrl: 'https://wissenhaus-backend-6bh66oejo-olagbayebenz-7030s-projects.vercel.app/api',
      headers: {
        'x-vercel-protection-bypass': bypassSecret
      }
    };
  }
})();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = API_CONFIG;
}
