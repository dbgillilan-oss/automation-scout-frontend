import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../lib/useAuth';
import { clients } from '../../../lib/api';
import Link from 'next/link';
import Head from 'next/head';

export default function ClientDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, user, loading } = useAuth();
  const [client, setClient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loadingClient, setLoadingClient] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && id) {
      loadClient();
    }
  }, [isAuthenticated, id]);

  const loadClient = async () => {
    try {
      setLoadingClient(true);
      const response = await clients.get(id);
      
      if (response.data.success) {
        setClient(response.data.client);
      } else {
        setError(response.data.error || 'Failed to load client');
      }
    } catch (error) {
      console.error('Error loading client:', error);
      setError('Failed to load client');
    } finally {
      setLoadingClient(false);
    }
  };

  const sendInvite = async () => {
    if (!client) return;
    
    try {
      const inviteData = {
        email: client.contactEmail,
        name: client.contactName || 'Valued Client',
        company: client.name,
        downloadLink: `https://install.automationscout.com/packages/${client.tenantToken}`,
        clientId: client.id
      };
      
      const response = await fetch('/api/invites/installation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(inviteData)
      });
      
      if (response.ok) {
        alert(`Installation invite sent to ${client.contactEmail}`);
      } else {
        alert('Failed to send invite. Please try again.');
      }
    } catch (error) {
      console.error('Error sending invite:', error);
      alert('Failed to send invite. Please try again.');
    }
  };

  const editClient = () => {
    // TODO: Implement edit modal or redirect to edit page
    alert('Edit functionality coming soon!');
  };

  if (loading || loadingClient) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // useAuth hook will redirect to login
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#dc3545' }}>
        Error: {error}
      </div>
    );
  }

  if (!client) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        Client not found
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Scout Master - {client.name}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ 
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
        margin: 0,
        padding: '20px',
        background: '#f5f5f5',
        minHeight: '100vh'
      }}>
        {/* Breadcrumb */}
        <div style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
          <Link href="/admin/clients" style={{ color: '#007bff', textDecoration: 'none' }}>
            ← Back to Client Dashboard
          </Link>
        </div>

        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '30px' 
        }}>
          <div>
            <h1 style={{ margin: 0, color: '#000' }}>{client.name}</h1>
            <div style={{ color: '#666', fontSize: '16px' }}>{client.package} Package</div>
          </div>
          <div>
            <button
              onClick={sendInvite}
              style={{
                background: '#2ECC40',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Send Invite
            </button>
            <button
              onClick={editClient}
              style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Edit Client
            </button>
          </div>
        </div>

        {/* Client Overview */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Client Overview</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginTop: '15px'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '15px',
              background: '#f8f9fa',
              borderRadius: '6px'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ECC40' }}>
                {client.metrics?.activeWidgets || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Active Widgets
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '15px',
              background: '#f8f9fa',
              borderRadius: '6px'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ECC40' }}>
                {client.metrics?.invitesSent || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Invites Sent
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '15px',
              background: '#f8f9fa',
              borderRadius: '6px'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ECC40' }}>
                {client.metrics?.activeWorkflows || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Active Workflows
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '15px',
              background: '#f8f9fa',
              borderRadius: '6px'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ECC40' }}>
                {client.metrics?.discoveredWorkflows || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Needs Review
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e9ecef',
          background: 'white',
          borderRadius: '8px 8px 0 0'
        }}>
          {['overview', 'widgets', 'workflows', 'invites'].map(tab => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '15px 20px',
                cursor: 'pointer',
                borderBottom: activeTab === tab ? '2px solid #2ECC40' : '2px solid transparent',
                background: activeTab === tab ? '#f8fff8' : 'transparent',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{
          background: 'white',
          borderRadius: '0 0 8px 8px',
          minHeight: '400px',
          padding: '20px'
        }}>
          {activeTab === 'overview' && (
            <div>
              <h4>Client Information</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e9ecef' }}>
                      <strong>Organization Name</strong>
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e9ecef' }}>
                      {client.name}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e9ecef' }}>
                      <strong>Package</strong>
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e9ecef' }}>
                      {client.package}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e9ecef' }}>
                      <strong>Contact Name</strong>
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e9ecef' }}>
                      {client.contactName || 'Not provided'}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e9ecef' }}>
                      <strong>Contact Email</strong>
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e9ecef' }}>
                      {client.contactEmail}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e9ecef' }}>
                      <strong>Health Status</strong>
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e9ecef' }}>
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          display: 'inline-block',
                          marginRight: '8px',
                          background: client.metrics?.health === 'green' ? '#28a745' :
                                     client.metrics?.health === 'amber' ? '#ffc107' :
                                     client.metrics?.health === 'red' ? '#dc3545' : '#6c757d'
                        }}
                      />
                      {client.metrics?.health || 'Unknown'}
                    </td>
                  </tr>
                  {client.notes && (
                    <tr>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e9ecef' }}>
                        <strong>Notes</strong>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #e9ecef' }}>
                        {client.notes}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'widgets' && (
            <div>
              <h4>Active Widgets</h4>
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                Widget data will be loaded from the API
              </div>
            </div>
          )}

          {activeTab === 'workflows' && (
            <div>
              <h4>Workflows</h4>
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                Workflow data will be loaded from the API
              </div>
            </div>
          )}

          {activeTab === 'invites' && (
            <div>
              <h4>Sent Invitations</h4>
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                Invitation history will be loaded from the API
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}