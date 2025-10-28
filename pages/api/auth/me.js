export default function handler(req, res) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7);
  
  // For demo purposes - verify demo token
  if (token.startsWith('demo_token_')) {
    return res.status(200).json({
      id: 'user_scout_master_001',
      email: 'dbgillilan@gmail.com',
      name: 'David Gillilan',
      role: 'scout_master'
    });
  }

  return res.status(401).json({ message: 'Invalid token' });
}