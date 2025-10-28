import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/useAuth';
import { clients } from '../../lib/api';
import Link from 'next/link';
import Head from 'next/head';

// Disable static generation
export async function getServerSideProps() {
  return { props: {} };
}

export default function AdminClients() {
  const { isAuthenticated, user, loading } = useAuth();
  const [clientList, setClientList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    package: 'Standard',
    contactName: '',
    contactEmail: '',
    notes: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadClients();
    }
  }, [isAuthenticated]);

  const loadClients = async () => {
    try {
      setLoadingClients(true);
      const response = await clients.list();
      
      if (response.data.success) {
        setClientList(response.data.clients);
      } else {
        setError(response.data.error || 'Failed to load clients');
      }
    } catch (error) {
      console.error('Error loading clients:', error);
      setError('Failed to load clients');
    } finally {
      setLoadingClients(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await clients.create(formData);
      
      if (response.data.success) {
        setShowModal(false);
        setFormData({
          name: '',
          package: 'Standard',
          contactName: '',
          contactEmail: '',
          notes: ''
        });
        
        // Send invitation
        try {
          const inviteData = {
            email: formData.contactEmail,
            name: formData.contactName || 'Valued Client',
            company: formData.name,
            downloadLink: `https://install.automationscout.com/packages/${response.data.client.tenantToken}`,
            clientId: response.data.client.id
          };
          
          await fetch('/api/invites/installation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(inviteData)
          });
          
          alert(`Client "${formData.name}" created successfully! Installation invite sent to ${formData.contactEmail}`);
        } catch (inviteError) {
          alert(`Client created, but failed to send invite. You can send it manually from the client detail page.`);
        }
        
        loadClients(); // Refresh the list
      } else {
        alert('Failed to create client: ' + response.data.error);
      }
    } catch (error) {
      console.error('Error creating client:', error);
      alert('Failed to create client. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // useAuth hook will redirect to login
  }

  return (
    <>
      <Head>
        <title>Scout Master - Client Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ 
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
        margin: 0,
        padding: '20px',
        background: '#f5f5f5',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '30px' 
        }}>
          <h1 style={{ margin: 0, color: '#000' }}>
            🚀 Scout Master - Client Dashboard
          </h1>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: '#2ECC40',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-block'
            }}
            onMouseOver={(e) => e.target.style.background = '#27AE3C'}
            onMouseOut={(e) => e.target.style.background = '#2ECC40'}
          >
            + Add Client
          </button>
        </div>

        {/* Clients Grid */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {/* Grid Header */}
          <div style={{
            background: '#f8f9fa',
            borderBottom: '1px solid #e9ecef',
            padding: '12px 16px',
            fontWeight: '600',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr 80px',
            gap: '16px'
          }}>
            <div>Client Name</div>
            <div>Package</div>
            <div>Active Widgets</div>
            <div>Invites Sent</div>
            <div>Active Workflows</div>
            <div>Inactive Workflows</div>
            <div>Discovered Workflows</div>
            <div>Health</div>
          </div>

          {/* Grid Content */}
          <div>
            {loadingClients ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                Loading clients...
              </div>
            ) : error ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#dc3545' }}>
                Error loading clients: {error}
              </div>
            ) : clientList.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                No clients yet. Add your first client to get started.
              </div>
            ) : (
              clientList.map(client => (
                <div
                  key={client.id}
                  style={{
                    borderBottom: '1px solid #e9ecef',
                    padding: '12px 16px',
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr 80px',
                    gap: '16px',
                    alignItems: 'center'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f8f9fa'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                >
                  <div>
                    <Link href={`/admin/clients/${client.id}`} style={{
                      fontWeight: '600',
                      color: '#000',
                      textDecoration: 'none'
                    }}>
                      {client.name}
                    </Link>
                  </div>
                  <div>{client.package}</div>
                  <div>
                    <Link href={`/admin/clients/${client.id}/widgets?filter=active`} style={{
                      color: '#007bff',
                      textDecoration: 'none',
                      cursor: 'pointer'
                    }}>
                      {client.metrics?.activeWidgets || 0}
                    </Link>
                  </div>
                  <div>
                    <Link href={`/admin/clients/${client.id}/invites`} style={{
                      color: '#007bff',
                      textDecoration: 'none',
                      cursor: 'pointer'
                    }}>
                      {client.metrics?.invitesSent || 0}
                    </Link>
                  </div>
                  <div>
                    <Link href={`/admin/clients/${client.id}/workflows?filter=active`} style={{
                      color: '#007bff',
                      textDecoration: 'none',
                      cursor: 'pointer'
                    }}>
                      {client.metrics?.activeWorkflows || 0}
                    </Link>
                  </div>
                  <div>
                    <Link href={`/admin/clients/${client.id}/workflows?filter=inactive`} style={{
                      color: '#007bff',
                      textDecoration: 'none',
                      cursor: 'pointer'
                    }}>
                      {client.metrics?.inactiveWorkflows || 0}
                    </Link>
                  </div>
                  <div>
                    <Link href={`/admin/clients/${client.id}/workflows?filter=discovered`} style={{
                      color: '#007bff',
                      textDecoration: 'none',
                      cursor: 'pointer'
                    }}>
                      {client.metrics?.discoveredWorkflows || 0}
                    </Link>
                  </div>
                  <div>
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: client.metrics?.health === 'green' ? '#28a745' :
                                   client.metrics?.health === 'amber' ? '#ffc107' :
                                   client.metrics?.health === 'red' ? '#dc3545' : '#6c757d'
                      }}
                      title={`Health: ${client.metrics?.health || 'unknown'}`}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Client Modal */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              background: 'white',
              padding: '20px',
              width: '90%',
              maxWidth: '500px',
              borderRadius: '8px'
            }}>
              <h2 style={{ marginTop: 0 }}>Add New Client</h2>
              
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                    Package Type
                  </label>
                  <select
                    name="package"
                    value={formData.package}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Basic">Basic</option>
                    <option value="Professional">Professional</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Custom">Custom</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                    Contact Name
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '10px'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: '#2ECC40',
                      color: 'white',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Create Client & Send Invite
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}