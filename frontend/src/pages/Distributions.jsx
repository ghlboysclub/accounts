import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Download, Upload, X, Save, PieChart, Calendar, Tag, User, Building, FileText, CheckCircle, Clock, XCircle, DollarSign, TrendingUp } from 'lucide-react';
import { AppleButton, AppleInput, AppleCard } from '../components/ui';

const Distributions = () => {
  const [distributions, setDistributions] = useState([
    {
      id: 1,
      partner: 'Ahmad Ali',
      amount: 87600,
      date: '2024-01-15',
      period: 'Q4 2023',
      status: 'paid',
      method: 'Bank Transfer',
      reference: 'DIST-2024-001',
      percentage: 18
    },
    {
      id: 2,
      partner: 'Hassan Khan',
      amount: 87600,
      date: '2024-01-15',
      period: 'Q4 2023',
      status: 'paid',
      method: 'Bank Transfer',
      reference: 'DIST-2024-002',
      percentage: 18
    },
    {
      id: 3,
      partner: 'Fatima Shah',
      amount: 72900,
      date: '2024-01-15',
      period: 'Q4 2023',
      status: 'paid',
      method: 'Bank Transfer',
      reference: 'DIST-2024-003',
      percentage: 15
    },
    {
      id: 4,
      partner: 'Omar Malik',
      amount: 60737,
      date: '2024-01-15',
      period: 'Q4 2023',
      status: 'paid',
      method: 'Bank Transfer',
      reference: 'DIST-2024-004',
      percentage: 12.5
    },
    {
      id: 5,
      partner: 'Ahmad Ali',
      amount: 78500,
      date: '2023-10-15',
      period: 'Q3 2023',
      status: 'paid',
      method: 'Bank Transfer',
      reference: 'DIST-2023-001',
      percentage: 18
    },
    {
      id: 6,
      partner: 'Hassan Khan',
      amount: 78500,
      date: '2023-10-15',
      period: 'Q3 2023',
      status: 'paid',
      method: 'Bank Transfer',
      reference: 'DIST-2023-002',
      percentage: 18
    }
  ]);
  
  const [filteredDistributions, setFilteredDistributions] = useState(distributions);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDistribution, setSelectedDistribution] = useState(null);
  const [distributionFormData, setDistributionFormData] = useState({
    partner: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    period: '',
    status: 'pending',
    method: 'Bank Transfer',
    reference: ''
  });

  const periods = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023'];
  const methods = ['Bank Transfer', 'Check', 'Cash', 'PayPal'];
  const statuses = [
    { value: 'paid', label: 'Paid', color: 'text-green-600' },
    { value: 'pending', label: 'Pending', color: 'text-yellow-600' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-600' }
  ];

  // Filter distributions
  React.useEffect(() => {
    let filtered = distributions;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(distribution =>
        distribution.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        distribution.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        distribution.period.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(distribution => distribution.status === statusFilter);
    }

    // Filter by period
    if (periodFilter !== 'all') {
      filtered = filtered.filter(distribution => distribution.period === periodFilter);
    }

    setFilteredDistributions(filtered);
  }, [distributions, searchQuery, statusFilter, periodFilter]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusObj = statuses.find(s => s.value === status);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusObj.color}`}>
        {statusObj.label}
      </span>
    );
  };

  const handleAddDistribution = () => {
    const newDistribution = {
      id: Math.max(...distributions.map(d => d.id)) + 1,
      ...distributionFormData,
      amount: parseFloat(distributionFormData.amount) || 0
    };

    setDistributions([...distributions, newDistribution]);
    setIsAddModalOpen(false);
    resetDistributionForm();
  };

  const handleDeleteDistribution = (distributionId) => {
    if (window.confirm('Are you sure you want to delete this distribution?')) {
      setDistributions(distributions.filter(distribution => distribution.id !== distributionId));
    }
  };

  const resetDistributionForm = () => {
    setDistributionFormData({
      partner: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      period: '',
      status: 'pending',
      method: 'Bank Transfer',
      reference: ''
    });
    setSelectedDistribution(null);
  };

  const openViewModal = (distribution) => {
    setSelectedDistribution(distribution);
    setIsViewModalOpen(true);
  };

  const exportDistributions = () => {
    const csvContent = [
      ['Partner', 'Amount', 'Date', 'Period', 'Status', 'Method', 'Reference'],
      ...filteredDistributions.map(d => [
        d.partner,
        d.amount,
        d.date,
        d.period,
        d.status,
        d.method,
        d.reference
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `distributions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalDistributed = distributions.reduce((sum, distribution) => sum + distribution.amount, 0);
  const pendingDistributions = distributions.filter(d => d.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Distributions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage partner profit distributions
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <AppleButton
            variant="secondary"
            icon={Download}
            onClick={exportDistributions}
          >
            Export Distributions
          </AppleButton>
          <AppleButton
            variant="primary"
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Distribution
          </AppleButton>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Distributed</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDistributed)}</p>
            </div>
          </div>
        </AppleCard>

        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Distributions</p>
              <p className="text-2xl font-bold text-gray-900">{pendingDistributions}</p>
            </div>
          </div>
        </AppleCard>

        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <PieChart className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Partners</p>
              <p className="text-2xl font-bold text-gray-900">
                {[...new Set(distributions.map(d => d.partner))].length}
              </p>
            </div>
          </div>
        </AppleCard>
      </div>

      {/* Filters */}
      <AppleCard>
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <AppleInput
                type="text"
                placeholder="Search distributions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </div>
            
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
              >
                <option value="all">All Status</option>
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
              >
                <option value="all">All Periods</option>
                {periods.map(period => (
                  <option key={period} value={period}>{period}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Distributions Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDistributions.map((distribution) => (
                <tr key={distribution.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{distribution.partner}</div>
                        <div className="text-sm text-gray-500">{distribution.reference}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{distribution.period}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(distribution.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(distribution.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {distribution.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(distribution.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <AppleButton
                        variant="ghost"
                        size="small"
                        icon={Eye}
                        onClick={() => openViewModal(distribution)}
                      />
                      <AppleButton
                        variant="ghost"
                        size="small"
                        icon={Trash2}
                        onClick={() => handleDeleteDistribution(distribution.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredDistributions.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <PieChart className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No distributions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || statusFilter !== 'all' || periodFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first distribution.'
                }
              </p>
            </div>
          )}
        </div>
      </AppleCard>

      {/* Add Distribution Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Distribution</h3>
              <AppleButton
                variant="ghost"
                size="small"
                icon={X}
                onClick={() => setIsAddModalOpen(false)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <AppleInput
                  label="Partner"
                  type="text"
                  value={distributionFormData.partner}
                  onChange={(e) => setDistributionFormData({...distributionFormData, partner: e.target.value})}
                  placeholder="Enter partner name"
                />
              </div>

              <div>
                <AppleInput
                  label="Amount (PKR)"
                  type="number"
                  value={distributionFormData.amount}
                  onChange={(e) => setDistributionFormData({...distributionFormData, amount: e.target.value})}
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={distributionFormData.date}
                  onChange={(e) => setDistributionFormData({...distributionFormData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Period
                </label>
                <select
                  value={distributionFormData.period}
                  onChange={(e) => setDistributionFormData({...distributionFormData, period: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select period</option>
                  {periods.map(period => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Method
                </label>
                <select
                  value={distributionFormData.method}
                  onChange={(e) => setDistributionFormData({...distributionFormData, method: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {methods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={distributionFormData.status}
                  onChange={(e) => setDistributionFormData({...distributionFormData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <AppleInput
                  label="Reference"
                  type="text"
                  value={distributionFormData.reference}
                  onChange={(e) => setDistributionFormData({...distributionFormData, reference: e.target.value})}
                  placeholder="Enter reference number"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <AppleButton
                variant="secondary"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </AppleButton>
              <AppleButton
                variant="primary"
                onClick={handleAddDistribution}
              >
                Add Distribution
              </AppleButton>
            </div>
          </div>
        </div>
      )}

      {/* View Distribution Modal */}
      {isViewModalOpen && selectedDistribution && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Distribution Details</h3>
              <AppleButton
                variant="ghost"
                size="small"
                icon={X}
                onClick={() => setIsViewModalOpen(false)}
              />
            </div>

            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-12 w-12">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <PieChart className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900">{selectedDistribution.partner}</h2>
                  <p className="text-gray-600">{selectedDistribution.period}</p>
                  <div className="mt-2">
                    {getStatusBadge(selectedDistribution.status)}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedDistribution.amount)}</p>
                  <p className="text-sm text-gray-500">Distribution Amount</p>
                </div>
              </div>

              {/* Distribution Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Distribution Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Date:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(selectedDistribution.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Reference:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedDistribution.reference}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Method:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedDistribution.method}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Partner Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Partner:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedDistribution.partner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Period:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedDistribution.period}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <AppleButton
                variant="secondary"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </AppleButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Distributions;