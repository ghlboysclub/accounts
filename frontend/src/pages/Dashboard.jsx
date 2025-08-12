// frontend/src/pages/Dashboard.jsx - Updated with real API integration
import React, { useState, useEffect } from 'react';
import { 
  AppleButton, 
  AppleInput, 
  AppleCard, 
  AppleTable, 
  AppleModal,
  AppleConfirmModal,
  useAppleNotification 
} from '../components/ui';
import { 
  dashboardAPI, 
  clientsAPI, 
  handleApiError 
} from '../utils/api';
import { 
  Plus, 
  Search, 
  DollarSign, 
  Users, 
  TrendingUp,
  CreditCard,
  Calendar,
  User,
  Mail,
  RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: '',
    description: ''
  });

  // Data states
  const [kpiData, setKpiData] = useState([]);
  const [clients, setClients] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const { success, error, warning, info, NotificationContainer } = useAppleNotification();

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Parallel API calls for better performance
      const [statsResponse, clientsResponse, transactionsResponse] = await Promise.all([
        dashboardAPI.getStats(),
        clientsAPI.getAll({ limit: 10, sort: 'createdAt', order: 'desc' }),
        dashboardAPI.getRecentTransactions(5)
      ]);

      // Transform stats data for KPI cards
      const transformedKPI = [
        {
          title: 'Total Revenue',
          value: `$${statsResponse.totalRevenue?.toLocaleString() || '0'}`,
          change: `+${statsResponse.revenueGrowth || 0}%`,
          trend: (statsResponse.revenueGrowth || 0) >= 0 ? 'up' : 'down',
          icon: DollarSign,
          color: 'emerald'
        },
        {
          title: 'Active Clients',
          value: statsResponse.totalClients?.toLocaleString() || '0',
          change: `+${statsResponse.clientGrowth || 0}%`,
          trend: (statsResponse.clientGrowth || 0) >= 0 ? 'up' : 'down',
          icon: Users,
          color: 'blue'
        },
        {
          title: 'Growth Rate',
          value: `${statsResponse.growthRate || 0}%`,
          change: `+${statsResponse.growthChange || 0}%`,
          trend: (statsResponse.growthChange || 0) >= 0 ? 'up' : 'down',
          icon: TrendingUp,
          color: 'purple'
        },
        {
          title: 'Transactions',
          value: statsResponse.totalTransactions?.toLocaleString() || '0',
          change: `+${statsResponse.transactionGrowth || 0}%`,
          trend: (statsResponse.transactionGrowth || 0) >= 0 ? 'up' : 'down',
          icon: CreditCard,
          color: 'orange'
        }
      ];

      setKpiData(transformedKPI);
      setClients(clientsResponse.data || clientsResponse);
      setRecentTransactions(transactionsResponse.data || transactionsResponse);

    } catch (err) {
      handleApiError(err, (type, message) => {
        if (type === 'error') error(message);
        else warning(message);
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    info('Refreshing dashboard data...');
    loadDashboardData();
  };

  const handleAddClient = async () => {
    try {
      const clientData = {
        name: formData.name,
        email: formData.email,
        initialAmount: parseFloat(formData.amount) || 0,
        description: formData.description
      };

      const newClient = await clientsAPI.create(clientData);
      
      // Update local state
      setClients([newClient, ...clients]);
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', amount: '', description: '' });
      
      success('Client added successfully!');
      
      // Refresh stats
      loadDashboardData();

    } catch (err) {
      handleApiError(err, (type, message) => {
        error(message || 'Failed to add client. Please try again.');
      });
    }
  };

  const handleDeleteClient = async () => {
    try {
      await clientsAPI.delete(selectedClient.id);
      
      // Update local state
      setClients(clients.filter(client => client.id !== selectedClient.id));
      setIsDeleteModalOpen(false);
      setSelectedClient(null);
      
      success('Client deleted successfully!');
      
      // Refresh stats
      loadDashboardData();

    } catch (err) {
      handleApiError(err, (type, message) => {
        error(message || 'Failed to delete client. Please try again.');
      });
    }
  };

  const handleEditClient = async (index, client) => {
    try {
      // Pre-populate form with existing data
      setFormData({
        name: client.name || '',
        email: client.email || '',
        amount: client.totalAmount?.toString().replace('$', '') || '0',
        description: client.description || ''
      });
      setIsAddModalOpen(true);
      info(`Editing ${client.name}`);
    } catch (err) {
      error('Failed to load client data for editing.');
    }
  };

  const handleDeleteConfirm = (index, client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const handleViewClient = async (index, client) => {
    try {
      const fullClient = await clientsAPI.getById(client.id);
      info(`Viewing ${fullClient.name} - Total transactions: ${fullClient.transactionCount || 0}`);
    } catch (err) {
      handleApiError(err, (type, message) => {
        warning(message || 'Could not load client details.');
      });
    }
  };

  // Transform clients data for table
  const tableData = clients.map(client => ({
    id: client.id,
    name: client.name || 'N/A',
    email: client.email || 'N/A',
    amount: client.totalAmount || '$0',
    status: client.status || 'Active',
    lastTransaction: client.lastTransactionDate 
      ? new Date(client.lastTransactionDate).toLocaleDateString() 
      : 'Never'
  }));

  const tableHeaders = ['Name', 'Email', 'Amount', 'Status', 'Last Transaction'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-gray-200/50 px-8 py-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your financial overview</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <AppleInput
              placeholder="Search clients..."
              icon={Search}
              className="w-80"
              onChange={(e) => {
                // Implement real-time search
                if (e.target.value.length > 2) {
                  clientsAPI.search(e.target.value)
                    .then(results => setClients(results.data || results))
                    .catch(err => console.error('Search failed:', err));
                } else if (e.target.value === '') {
                  loadDashboardData();
                }
              }}
            />
            
            <AppleButton
              variant="ghost"
              icon={RefreshCw}
              onClick={handleRefresh}
            >
              Refresh
            </AppleButton>
            
            <AppleButton
              variant="primary"
              icon={Plus}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Client
            </AppleButton>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <AppleCard key={index} hoverable>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-${kpi.color}-100`}>
                  <kpi.icon className={`w-6 h-6 text-${kpi.color}-600`} />
                </div>
                <div className={`text-sm font-semibold ${
                  kpi.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {kpi.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</h3>
              <p className="text-gray-600 text-sm">{kpi.title}</p>
            </AppleCard>
          ))}
        </div>

        {/* Clients Table */}
        <AppleTable
          headers={tableHeaders}
          data={tableData}
          onEdit={handleEditClient}
          onDelete={handleDeleteConfirm}
          onView={handleViewClient}
          searchable={true}
          sortable={true}
          exportable={true}
          pagination={true}
          itemsPerPage={10}
        />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <AppleCard hoverable onClick={() => {
            // Navigate to analytics page or generate report
            info('Generating monthly report...');
            // Add your report generation logic here
          }}>
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Monthly Report</h3>
              <p className="text-gray-600">Generate comprehensive financial report</p>
            </div>
          </AppleCard>

          <AppleCard hoverable onClick={() => {
            // Navigate to calendar or booking system
            warning('Calendar integration coming soon!');
          }}>
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Schedule Meeting</h3>
              <p className="text-gray-600">Book consultation with clients</p>
            </div>
          </AppleCard>

          <AppleCard hoverable onClick={() => {
            // Implement data backup functionality
            success('Data backup initiated!');
            // Add your backup logic here
          }}>
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Backup Data</h3>
              <p className="text-gray-600">Secure your financial records</p>
            </div>
          </AppleCard>
        </div>
      </div>

      {/* Add Client Modal */}
      <AppleModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFormData({ name: '', email: '', amount: '', description: '' });
        }}
        title="Add New Client"
        type="default"
        size="medium"
      >
        <div className="space-y-6">
          <AppleInput
            label="Client Name"
            placeholder="Enter client name"
            icon={User}
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          
          <AppleInput
            label="Email Address"
            type="email"
            placeholder="client@example.com"
            icon={Mail}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          
          <AppleInput
            label="Initial Amount"
            type="number"
            placeholder="0.00"
            icon={DollarSign}
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
          />
          
          <AppleInput
            label="Description"
            placeholder="Additional notes about the client..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          
          <div className="flex items-center justify-end space-x-3 pt-4">
            <AppleButton
              variant="secondary"
              onClick={() => {
                setIsAddModalOpen(false);
                setFormData({ name: '', email: '', amount: '', description: '' });
              }}
            >
              Cancel
            </AppleButton>
            <AppleButton
              variant="primary"
              onClick={handleAddClient}
              disabled={!formData.name || !formData.email}
            >
              Add Client
            </AppleButton>
          </div>
        </div>
      </AppleModal>

      {/* Delete Confirmation Modal */}
      <AppleConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedClient(null);
        }}
        onConfirm={handleDeleteClient}
        title="Delete Client"
        message={`Are you sure you want to delete ${selectedClient?.name}? This action cannot be undone and will also remove all associated transactions.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
      />

      {/* Notification Container */}
      <NotificationContainer />
    </div>
  );
};

export default Dashboard;