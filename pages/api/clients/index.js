// Demo clients data
const demoClients = [
  {
    id: 'client_001',
    name: 'TechCorp Solutions',
    email: 'admin@techcorp.com',
    status: 'active',
    plan: 'enterprise',
    connectedSince: '2024-01-15',
    lastActivity: '2025-10-27',
    widgets: 12,
    workflows: 8
  },
  {
    id: 'client_002', 
    name: 'StartupXYZ',
    email: 'founder@startupxyz.com',
    status: 'active',
    plan: 'professional',
    connectedSince: '2024-03-22',
    lastActivity: '2025-10-26',
    widgets: 6,
    workflows: 4
  }
];

export default function handler(req, res) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(demoClients);
  }

  if (req.method === 'POST') {
    const newClient = {
      id: 'client_' + Date.now(),
      ...req.body,
      connectedSince: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString().split('T')[0],
      widgets: 0,
      workflows: 0
    };
    
    return res.status(201).json(newClient);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}