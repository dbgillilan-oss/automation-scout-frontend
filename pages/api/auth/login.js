// For demo purposes - in production this would connect to your real API
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Demo credentials
  if (email === 'dbgillilan@gmail.com' && password === 'live_business_password') {
    const token = 'demo_token_' + Date.now();
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: 'user_scout_master_001',
        email: 'dbgillilan@gmail.com',
        name: 'David Gillilan',
        role: 'scout_master'
      }
    });
  }

  return res.status(401).json({ 
    success: false, 
    message: 'Invalid credentials' 
  });
}