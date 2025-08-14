import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Download, Upload, X, Save, TrendingUp, Calendar, Tag, User, Building, FileText, CheckCircle, Clock, XCircle, DollarSign, PieChart } from 'lucide-react';
import { AppleButton, AppleInput, AppleCard } from '../components/ui';

const Investments = () => {
  const [investments, setInvestments] = useState([
    {
      id: 1,
      name: 'Tech Startup Investment',
      type: 'Equity',
      amount: 500000,
      currentValue: 625000,
      date: '2023-06-15',
      maturityDate: '2025-06-15',
      interestRate: 12.5,
      status: 'active',
      provider: 'Venture Capital Partners',
      category: 'Startup',
      risk: 'high',
      returns: '+25%'
    },
    {
      id: 2,
      name: 'Government Bonds',
      type: 'Bonds',
      amount: 1000000,
      currentValue: 1050000,
      date: '2023-01-10',
      maturityDate: '2026-01-10',
      interestRate: 5.0,
      status: 'active',
      provider: 'National Bank',
      category: 'Government',
      risk: 'low',
      returns: '+5%'
    },
    {
      id: 3,
      name: 'Real Estate Fund',
      type: 'Mutual Fund',
      amount: 750000,
      currentValue: 810000,
      date: '2023-03-22',
      maturityDate: '2025-03-22',
      interestRate: 8.0,
      status: 'active',
      provider: 'Real Estate Investment Trust',
      category: 'Real Estate',
      risk: 'medium',
      returns: '+8%'
    },
    {
      id: 4,
      name: 'Fixed Deposit',
      type: 'Fixed Deposit',
      amount: 250000,
      currentValue: 262500,
      date: '2023-09-01',
      maturityDate: '2024-09-01',
      interestRate: 10.0,
      status: 'matured',
      provider: 'Habib Bank Limited',
      category: 'Bank',
      risk: 'low',
      returns: '+5%'
    }
  ]);
  
  const [filteredInvestments, setFilteredInvestments] = useState(investments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [investmentFormData, setInvestmentFormData] = useState({
    name: '',
    type: '',
    amount: '',
    currentValue: '',
    date: new Date().toISOString().split('T')[0],
    maturityDate: '',
    interestRate: '',
    status: 'active',
    provider: '',
    category: '',
    risk: 'medium'
  });

  const categories = ['Startup', 'Government', 'Real Estate', 'Bank', 'Mutual Fund', 'Other'];
  const types = ['Equity', 'Bonds', 'Fixed Deposit', 'Mutual Fund', 'Real Estate', 'Other'];
  const risks = [
    { value: 'low', label: 'Low Risk', color: 'text-green-600' },
    { value: 'medium', label: 'Medium Risk', color: 'text-yellow-600' },
    { value: 'high', label: 'High Risk', color: 'text-red-600' }
  ];
  const statuses = [
    { value: 'active', label: 'Active', color: 'text-green-600' },
    { value: 'matured', label: 'Matured', color: 'text-blue-600' },
    { value: 'closed', label: 'Closed', color: 'text-gray-600' }
  ];

  // Filter investments
  React.useEffect(() => {
    let filtered = investments;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(investment =>
        investment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        investment.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        investment.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        investment.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(investment => investment.status === statusFilter);
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(investment => investment.category === categoryFilter);
    }

    setFilteredInvestments(filtered);
  }, [investments, searchQuery, statusFilter, categoryFilter]);

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

  const getRiskBadge = (risk) => {
    const riskObj = risks.find(r => r.value === risk);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskObj.color}`}>
        {riskObj.label}
      </span>
    );
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Startup': 'bg-purple-100 text-purple-800',
      'Government': 'bg-blue-100 text-blue-800',
      'Real Estate': 'bg-green-100 text-green-800',
      'Bank': 'bg-yellow-100 text-yellow-800',
      'Mutual Fund': 'bg-indigo-100 text-indigo-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleAddInvestment = () => {
    const newInvestment = {
      id: Math.max(...investments.map(i => i.id)) + 1,
      ...investmentFormData,
      amount: parseFloat(investmentFormData.amount) || 0,
      currentValue: parseFloat(investmentFormData.currentValue) || 0,
      interestRate: parseFloat(investmentFormData.interestRate) || 0
    };

    setInvestments([...investments, newInvestment]);
    setIsAddModalOpen(false);
    resetInvestmentForm();
  };

  const handleDeleteInvestment = (investmentId) => {
    if (window.confirm('Are you sure you want to delete this investment?')) {
      setInvestments(investments.filter(investment => investment.id !== investmentId));
    }
  };

  const resetInvestmentForm = () => {
    setInvestmentFormData({
      name: '',
      type: '',
      amount: '',
      currentValue: '',
      date: new Date().toISOString().split('T')[0],
      maturityDate: '',
      interestRate: '',
      status: 'active',
      provider: '',
      category: '',
      risk: 'medium'
    });
    setSelectedInvestment(null);
  };

  const openViewModal = (investment) => {
    setSelectedInvestment(investment);
    setIsViewModalOpen(true);
  };

  const exportInvestments = () => {
    const csvContent = [
      ['Name', 'Type', 'Amount', 'Current Value', 'Date', 'Maturity Date', 'Interest Rate', 'Status', 'Provider', 'Category', 'Risk'],
      ...filteredInvestments.map(i => [
        i.name,
        i.type,
        i.amount,
        i.currentValue,
        i.date,
        i.maturityDate,
        i.interestRate,
        i.status,
        i.provider,
        i.category,
        i.risk
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `investments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalInvested = investments.reduce((sum, investment) => sum + investment.amount, 0);
  const totalCurrentValue = investments.reduce((sum, investment) => sum + investment.currentValue, 0);
  const totalReturns = totalCurrentValue - totalInvested;
  const returnPercentage = totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(2) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage your investment portfolio
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <AppleButton
            variant="secondary"
            icon={Download}
            onClick={exportInvestments}
          >
            Export Investments
          </AppleButton>
          <AppleButton
            variant="primary"
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Investment
          </AppleButton>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInvested)}</p>
            </div>
          </div>
        </AppleCard>

        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Current Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCurrentValue)}</p>
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
              <p className="text-sm font-medium text-gray-500">Total Returns</p>
              <p className={`text-2xl font-bold ${totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalReturns)}
              </p>
            </div>
          </div>
        </AppleCard>

        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Return %</p>
              <p className={`text-2xl font-bold ${returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {returnPercentage}%
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
                placeholder="Search investments..."
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
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Investments Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Investment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Returns
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
              {filteredInvestments.map((investment) => {
                const returns = investment.currentValue - investment.amount;
                const returnPercent = investment.amount > 0 ? ((returns / investment.amount) * 100).toFixed(2) : 0;
                
                return (
                  <tr key={investment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{investment.name}</div>
                          <div className="text-sm text-gray-500">{investment.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <Building className="h-4 w-4 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">{investment.provider}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(investment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(investment.category)}`}>
                        {investment.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(investment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(returns)} ({returnPercent}%)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(investment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <AppleButton
                          variant="ghost"
                          size="small"
                          icon={Eye}
                          onClick={() => openViewModal(investment)}
                        />
                        <AppleButton
                          variant="ghost"
                          size="small"
                          icon={Trash2}
                          onClick={() => handleDeleteInvestment(investment.id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredInvestments.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <TrendingUp className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No investments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first investment.'
                }
              </p>
            </div>
          )}
        </div>
      </AppleCard>

      {/* Add Investment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Investment</h3>
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
                  label="Investment Name"
                  type="text"
                  value={investmentFormData.name}
                  onChange={(e) => setInvestmentFormData({...investmentFormData, name: e.target.value})}
                  placeholder="Enter investment name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={investmentFormData.type}
                  onChange={(e) => setInvestmentFormData({...investmentFormData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <AppleInput
                  label="Amount (PKR)"
                  type="number"
                  value={investmentFormData.amount}
                  onChange={(e) => setInvestmentFormData({...investmentFormData, amount: e.target.value})}
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <AppleInput
                  label="Current Value (PKR)"
                  type="number"
                  value={investmentFormData.currentValue}
                  onChange={(e) => setInvestmentFormData({...investmentFormData, currentValue: e.target.value})}
                  placeholder="Enter current value"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={investmentFormData.date}
                  onChange={(e) => setInvestmentFormData({...investmentFormData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maturity Date
                </label>
                <input
                  type="date"
                  value={investmentFormData.maturityDate}
                  onChange={(e) => setInvestmentFormData({...investmentFormData, maturityDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <AppleInput
                  label="Interest Rate (%)"
                  type="number"
                  step="0.01"
                  value={investmentFormData.interestRate}
                  onChange={(e) => setInvestmentFormData({...investmentFormData, interestRate: e.target.value})}
                  placeholder="Enter interest rate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={investmentFormData.category}
                  onChange={(e) => setInvestmentFormData({...investmentFormData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <AppleInput
                  label="Provider"
                  type="text"
                  value={investmentFormData.provider}
                  onChange={(e) => setInvestmentFormData({...investmentFormData, provider: e.target.value})}
                  placeholder="Enter provider name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={investmentFormData.status}
                  onChange={(e) => setInvestmentFormData({...investmentFormData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Risk Level
                </label>
                <select
                  value={investmentFormData.risk}
                  onChange={(e) => setInvestmentFormData({...investmentFormData, risk: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {risks.map(risk => (
                    <option key={risk.value} value={risk.value}>{risk.label}</option>
                  ))}
                </select>
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
                onClick={handleAddInvestment}
              >
                Add Investment
              </AppleButton>
            </div>
          </div>
        </div>
      )}

      {/* View Investment Modal */}
      {isViewModalOpen && selectedInvestment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Investment Details</h3>
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
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900">{selectedInvestment.name}</h2>
                  <p className="text-gray-600">{selectedInvestment.type}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    {getStatusBadge(selectedInvestment.status)}
                    {getRiskBadge(selectedInvestment.risk)}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedInvestment.currentValue)}</p>
                  <p className="text-sm text-gray-500">Current Value</p>
                </div>
              </div>

              {/* Investment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Investment Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Initial Amount:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(selectedInvestment.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Date:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(selectedInvestment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Maturity Date:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(selectedInvestment.maturityDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Interest Rate:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedInvestment.interestRate}%
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Provider Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Provider:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedInvestment.provider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Category:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(selectedInvestment.category)}`}>
                        {selectedInvestment.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Returns:</span>
                      <span className={`text-sm font-medium ${selectedInvestment.currentValue - selectedInvestment.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(selectedInvestment.currentValue - selectedInvestment.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Return %:</span>
                      <span className={`text-sm font-medium ${selectedInvestment.currentValue - selectedInvestment.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedInvestment.amount > 0 ? (((selectedInvestment.currentValue - selectedInvestment.amount) / selectedInvestment.amount) * 100).toFixed(2) : 0}%
                      </span>
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

export default Investments;