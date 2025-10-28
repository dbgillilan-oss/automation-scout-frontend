// Demo client detail data
const demoClientDetails = {
  'client_001': {
    id: 'client_001',
    name: 'TechCorp Solutions',
    email: 'admin@techcorp.com',
    status: 'active',
    plan: 'enterprise',
    connectedSince: '2024-01-15',
    lastActivity: '2025-10-27',
    widgets: [
      { id: 'w1', name: 'Sales Dashboard', type: 'analytics', status: 'active' },
      { id: 'w2', name: 'Inventory Tracker', type: 'data', status: 'active' }
    ],
    workflows: [
      { id: 'wf1', name: 'Lead Processing', triggers: 5, status: 'active' },
      { id: 'wf2', name: 'Order Fulfillment', triggers: 12, status: 'active' }
    ],
    apiCalls: 15847,
    dataProcessed: '2.3 GB',
    automationHours: 47.2
  },
  'client_002': {
    id: 'client_002',
    name: 'StartupXYZ',
    email: 'founder@startupxyz.com',
    status: 'active',
    plan: 'professional',
    connectedSince: '2024-03-22',
    lastActivity: '2025-10-26',
    widgets: [
      { id: 'w3', name: 'Customer Portal', type: 'interface', status: 'active' }
    ],
    workflows: [
      { id: 'wf3', name: 'User Onboarding', triggers: 8, status: 'active' }
    ],
    apiCalls: 5234,
    dataProcessed: '890 MB',
    automationHours: 12.5
  }
};

export default function handler(req, res) {
  const { id } = req.query;
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const client = demoClientDetails[id];
  
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }

  return res.status(200).json(client);
}