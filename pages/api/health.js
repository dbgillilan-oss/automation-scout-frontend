// Vercel serverless function for light API operations
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Quick health check for frontend
    res.status(200).json({
      status: 'healthy',
      service: 'AutomationScout Frontend API',
      timestamp: new Date().toISOString(),
      containerAPI: process.env.NODE_ENV === 'production' 
        ? 'https://api.automationscout.com'
        : 'http://localhost:3003'
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}