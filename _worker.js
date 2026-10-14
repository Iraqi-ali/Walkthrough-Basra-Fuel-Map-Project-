export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      // Return dummy data for Cloudflare Workers API routes
      if (url.pathname === '/api/stations') {
        return new Response(JSON.stringify({
          last_updated: new Date().toISOString(),
          stations: [],
          visitor_count: 0,
          reports_summary: {}
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    // Otherwise serve static assets
    return env.ASSETS.fetch(request);
  }
};
