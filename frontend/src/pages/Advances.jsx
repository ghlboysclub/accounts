import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Download, Upload, X, Save, Target, Calendar, DollarSign, User, CheckCircle, Clock, XCircle } from 'lucide-react';
import { AppleButton, AppleInput, AppleCard } from '../components/ui';

const Advances = () => {
  const [advances, setAdvances] = useState([
    {
      id: 1,
      employee: 'Ahmad Ali',
      amount: 50000,
      date: '2024-01-10',
      dueDate: '2024-02-10',
      purpose: 'Medical emergency',
      status: 'approved',
      repaid: 25000,
      remaining: 25000
    },
    {
      id: 2,
      employee: 'Hassan Khan',
      amount: 30000,
      date: '2024-01-05',
      dueDate: '2024-02-05',
      purpose: 'Family wedding',
      status: 'pending',
      repaid: 0,
      remaining: 30000
    },
    {
      id: 3,
      employee: 'Fatima Shah',
      amount: 75000,
      date: '2023-12-20',
      dueDate: '2024-01-20',
      purpose: 'Home renovation',
      status: 'approved',
      repaid: 75000,
      remaining: 0
    },
    {
      id: 4,
      employee: 'Omar Malik',
      amount: 40000,
      date: '2023-12-15',
      dueDate: '2024-01-15',
      purpose: 'Education fees',
      status: 'rejected',
      repaid: 0,
      remaining: 40000
    }
  ]);
  
  const [filteredAdvances, setFilteredAdvances] = useState(advances);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAdvance, setSelectedAdvance] = useState(null);
  const [advanceFormData, setAdvanceFormData] = useState({
    employee: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    purpose: '',
    status: 'pending',
    repaid: '',
    remaining: ''
  });

  const statuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
    { value: 'repaid', label: 'Repaid', color: 'bg-blue-100 text-blue-800' }
  ];

  // Filter advances
  React.useEffect(() => {
    let filtered = advances;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(advance =>
        advance.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        advance.purpose.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(advance => advance.status === statusFilter);
    }

    setFilteredAdvances(filtered);
  }, [advances, searchQuery, statusFilter]);

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

  const handleAddAdvance = () => {
    const newAdvance = {
      id: Math.max(...advances.map(a => a.id)) + 1,
      ...advanceFormData,
      amount: parseFloat(advanceFormData.amount),
      repaid: parseFloat(advanceFormData.repaid) || 0,
      remaining: parseFloat(advanceFormData.amount) - (parseFloat(advanceFormData.repaid) || 0)
    };

    setAdvances([...advances, newAdvance]);
    setIsAddModalOpen(false);
    resetAdvanceForm();
  };

  const handleEditAdvance = () => {
    setAdvances(advances.map(advance => 
      advance.id === selectedAdvance.id 
        ? { 
            ...advance, 
            ...advanceFormData,
            amount: parseFloat(advanceFormData.amount),
            repaid: parseFloat(advanceFormData.repaid) || 0,
            remaining: parseFloat(advanceFormData.amount) - (parseFloat(advanceFormData.repaid) || 0)
          }
        : advance
    ));
    setIsEditModalOpen(false);
    resetAdvanceForm();
  };

  const handleDeleteAdvance = (advanceId) => {
    if (window.confirm('Are you sure you want to delete this advance request?')) {
      setAdvances(advances.filter(advance => advance.id !== advanceId));
    }
  };

  const resetAdvanceForm = () => {
    setAdvanceFormData({
      employee: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      purpose: '',
      status: 'pending',
      repaid: '',
      remaining: ''
    });
    setSelectedAdvance(null);
  };

  const openEditModal = (advance) => {
    setSelectedAdvance(advance);
    setAdvanceFormData({
      employee: advance.employee,
      amount: advance.amount.toString(),
      date: advance.date,
      dueDate: advance.dueDate,
      purpose: advance.purpose,
      status: advance.status,
      repaid: advance.repaid.toString(),
      remaining: advance.remaining.toString()
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (advance) => {
    setSelectedAdvance(advance);
    setIsViewModalOpen(true);
  };

  const exportAdvances = () => {
    const csvContent = [
      ['Employee', 'Amount', 'Date', 'Due Date', 'Purpose', 'Status', 'Repaid', 'Remaining'],
      ...filteredAdvances.map(a => [
        a.employee,
        a.amount,
        a.date,
        a.dueDate,
        a.purpose,
        a.status,
        a.repaid,
        a.remaining
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `advances-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalAdvances = advances.reduce((sum, advance) => sum + advance.amount, 0);
  const totalRepaid = advances.reduce((sum, advance) => sum + advance.repaid, 0);
  const pendingAdvances = advances.filter(a => a.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advances</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage employee advance payments
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <AppleButton
            variant="secondary"
            icon={Download}
            onClick={exportAdvances}
          >
            Export CSV
          </AppleButton>
          <AppleButton
            variant="primary"
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            New Advance
          </AppleButton>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Advances</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAdvances)}</p>
            </div>
          </div>
        </AppleCard>

        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Repaid</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRepaid)}</p>
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
              <p className="text-sm font-medium text-gray-500">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">{pendingAdvances}</p>
            </div>
          </div>
        </AppleCard>
      </div>

      {/* Filters */}
      <AppleCard>
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex-1 max-w-lg">
              <AppleInput
                type="text"
                placeholder="Search advances..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="flex space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
              >
                <option value="all">All Status</option>
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Advances Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purpose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Repaid
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdvances.map((advance) => (
                <tr key={advance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-800 font-medium text-sm">
                            {advance.employee.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{advance.employee}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(advance.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(advance.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(advance.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {advance.purpose}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(advance.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(advance.repaid)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <AppleButton
                        variant="ghost"
                        size="small"
                        icon={Eye}
                        onClick={() => openViewModal(advance)}
                      />
                      <AppleButton
                        variant="ghost"
                        size="small"
                        icon={Edit}
                        onClick={() => openEditModal(advance)}
                      />
                      <AppleButton
                        variant="ghost"
                        size="small"
                        icon={Trash2}
                        onClick={() => handleDeleteAdvance(advance.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredAdvances.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Target className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No advances found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first advance.'
                }
              </p>
            </div>
          )}
        </div>
      </AppleCard>

      {/* Add Advance Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Advance</h3>
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
                  label="Employee"
                  type="text"
                  value={advanceFormData.employee}
                  onChange={(e) => setAdvanceFormData({...advanceFormData, employee: e.target.value})}
                  placeholder="Enter employee name"
                />
              </div>

              <div>
                <AppleInput
                  label="Amount (PKR)"
                  type="number"
                  value={advanceFormData.amount}
                  onChange={(e) => setAdvanceFormData({...advanceFormData, amount: e.target.value})}
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <AppleInput
                  label="Date"
                  type="date"
                  value={advanceFormData.date}
                  onChange={(e) => setAdvanceFormData({...advanceFormData, date: e.target.value})}
                />
              </div>

              <div>
                <AppleInput
                  label="Due Date"
                  type="date"
                  value={advanceFormData.dueDate}
                  onChange={(e) => setAdvanceFormData({...advanceFormData, dueDate: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={advanceFormData.status}
                  onChange={(e) => setAdvanceFormData({...advanceFormData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <AppleInput
                  label="Repaid Amount (PKR)"
                  type="number"
                  value={advanceFormData.repaid}
                  onChange={(e) => setAdvanceFormData({...advanceFormData, repaid: e.target.value})}
                  placeholder="Enter repaid amount"
                />
              </div>

              <div className="md:col-span-2">
                <AppleInput
                  label="Purpose"
                  type="textarea"
                  value={advanceFormData.purpose}
                  onChange={(e) => setAdvanceFormData({...advanceFormData, purpose: e.target.value})}
                  placeholder="Enter purpose of advance"
                  rows={3}
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
                onClick={handleAddAdvance}
              >
                Add Advance
              </AppleButton>
            </div>
          </div>
        </div>
      )}

      {/* Edit Advance Modal */}
      {isEditModalOpen && selectedAdvance && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit Advance</h3>
              <AppleButton
                variant="ghost"
                size="small"
                icon={X}
                onClick={() => setIsEditModalOpen(false)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <AppleInput
                  label="Employee"
                  type="text"
                  value={advanceFormData.employee}
                  onChange={(e) => setAdvanceFormData({...advanceFormData, employee: e.target.value})}
                />
              </div>

              <div>
                <AppleInput
                  label="Amount (PKR)"
                  type="number"
                  value={advanceFormData.amount}
                  onChange={(e) => setAdvanceFormData({...advanceFormData, amount: e.target.value})}
                />
              </div>

              <div>
                <AppleInput
                  label="Date"
                  type="date"
                  value={advanceFormData.date}
                  onChange={(e) => setAdvanceFormData({...advanceFormData, date: e.target.value})}
                />
              </div>

              <div>
                <AppleInput
                  label="Due Date"
                  type="date"
                  value={advanceFormData.dueDate}
                  onChange={(e) => setAdvanceFormData({...advanceFormData, dueDate: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={advanceFormData.status}
                  onChange={(e) => setAdvanceFormData({...advanceFormData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <AppleInput
                  label="Repaid Amount (PKR)"
                  type="number"
                  value={advanceFormData.repaid}
                  onChange={(e) => setAdvanceFormData({...advanceFormData, repaid: e.target.value})}
                />
              </div>

              <div className="md:col-span-2">
                <AppleInput
                  label="Purpose"
                  type="textarea"
                  value={advanceFormData.purpose}
                  onChange={(e) => setAdvanceFormData({...advanceFormData, purpose: e.target.value})}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <AppleButton
                variant="secondary"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </AppleButton>
              <AppleButton
                variant="primary"
                onClick={handleEditAdvance}
              >
                Save Changes
              </AppleButton>
            </div>
          </div>
        </div>
      )}

      {/* View Advance Modal */}
      {isViewModalOpen && selectedAdvance && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Advance Details</h3>
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
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-800 font-medium">
                    {selectedAdvance.employee.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedAdvance.employee}</h2>
                  <p className="text-gray-600">{selectedAdvance.purpose}</p>
                  <div className="mt-2">
                    {getStatusBadge(selectedAdvance.status)}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Advance Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Amount:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(selectedAdvance.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Date:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(selectedAdvance.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Due Date:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(selectedAdvance.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Payment Status</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Repaid:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(selectedAdvance.repaid)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Remaining:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(selectedAdvance.remaining)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Percentage:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.round((selectedAdvance.repaid / selectedAdvance.amount) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <AppleButton
                variant="primary"
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(selectedAdvance);
                }}
              >
                Edit Advance
              </AppleButton>
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

export default Advances;