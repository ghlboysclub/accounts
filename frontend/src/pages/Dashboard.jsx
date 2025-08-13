// frontend/src/pages/Dashboard.jsx - Working version without API
import React, { useState } from 'react';
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: '',
    description: ''
  });

  // Sample data - no API calls needed
  const [clients, setClients] = useState([
    { id: 1, name: 'Apple Inc.', email: 'contact@apple.com', amount: '$45,230', status: 'Active', lastTransaction: '2024-08-12' },
    { id: 2, name: 'Microsoft Corp.', email: 'billing@microsoft.com', amount: '$38,920', status: 'Active', lastTransaction: '2024-08-11' },
    { id: 3, name: 'Google LLC', email: 'payments@google.com', amount: '$32,180', status: 'Pending', lastTransaction: '2024-08-10' }
  ]);

  const kpiData = [
    {
      title: 'Total Revenue',
      value: '$124,590',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'emerald'
    },
    {
      title: 'Active Clients',
      value: '1,248',
      change: '+3.2%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Growth Rate',
      value: '23.4%',
      change: '+5.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Transactions',
      value: '4,892',
      change: '+8.1%',
      trend: 'up',
      icon: CreditCard,
      color: 'orange'
    }
  ];

  const { success, error, warning, info, NotificationContainer } = useAppleNotification();

  const handleAddClient = () => {
    if (!formData.name || !formData.email) {
      error('Please fill in all required fields');
      return;
    }

    const newClient = {
      id: clients.length + 1,
      name: formData.name,
      email: formData.email,
      amount: `$${formData.amount || '0'}`,
      status: 'Active',
      lastTransaction: new Date().toISOString().split('T')[0]
    };

    setClients([...clients, newClient]);
    setIsAddModalOpen(false);
    setFormData({ name: '', email: '', amount: '', description: '' });
    success('Client added successfully!');
  };

  const handleDeleteClient = () => {
    setClients(clients.filter(client => client.id !== selectedClient.id));
    setIsDeleteModalOpen(false);
    setSelectedClient(null);
    success('Client deleted successfully!');
  };

  const handleEditClient = (index, client) => {
    setFormData({
      name: client.name,
      email: client.email,
      amount: client.amount.replace('$', ''),
      description: ''
    });
    setIsAddModalOpen(true);
    info(`Editing ${client.name}`);
  };

  const handleDeleteConfirm = (index, client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const handleViewClient = (index, client) => {
    info(`Viewing ${client.name} - Status: ${client.status}`);
  };

  const tableHeaders = ['Name', 'Email', 'Amount', 'Status', 'Last Transaction'];

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
            />
            
            <AppleButton
              variant="ghost"
              icon={RefreshCw}
              onClick={() => info('Dashboard refreshed!')}
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
                <div className="text-emerald-500 text-sm font-semibold">
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
          data={clients}
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
          <AppleCard hoverable onClick={() => info('Generating monthly report...')}>
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Monthly Report</h3>
              <p className="text-gray-600">Generate comprehensive financial report</p>
            </div>
          </AppleCard>

          <AppleCard hoverable onClick={() => warning('Calendar integration coming soon!')}>
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Schedule Meeting</h3>
              <p className="text-gray-600">Book consultation with clients</p>
            </div>
          </AppleCard>

          <AppleCard hoverable onClick={() => success('Data backup initiated!')}>
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
        message={`Are you sure you want to delete ${selectedClient?.name}? This action cannot be undone.`}
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