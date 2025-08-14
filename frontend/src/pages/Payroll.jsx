import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Download, Upload, X, Save, Users, Calendar, DollarSign, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { AppleButton, AppleInput, AppleCard } from '../components/ui';

const Payroll = () => {
  const [payrollRecords, setPayrollRecords] = useState([
    {
      id: 1,
      employee: 'Ahmad Ali',
      period: 'December 2023',
      grossSalary: 150000,
      deductions: 15000,
      netSalary: 135000,
      status: 'paid',
      paymentDate: '2024-01-05',
      department: 'Management'
    },
    {
      id: 2,
      employee: 'Hassan Khan',
      period: 'December 2023',
      grossSalary: 120000,
      deductions: 12000,
      netSalary: 108000,
      status: 'paid',
      paymentDate: '2024-01-05',
      department: 'Partners'
    },
    {
      id: 3,
      employee: 'Fatima Shah',
      period: 'December 2023',
      grossSalary: 95000,
      deductions: 9500,
      netSalary: 85500,
      status: 'pending',
      paymentDate: '',
      department: 'Finance'
    },
    {
      id: 4,
      employee: 'Omar Malik',
      period: 'December 2023',
      grossSalary: 85000,
      deductions: 8500,
      netSalary: 76500,
      status: 'pending',
      paymentDate: '',
      department: 'Operations'
    }
  ]);
  
  const [filteredRecords, setFilteredRecords] = useState(payrollRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [payrollFormData, setPayrollFormData] = useState({
    employee: '',
    period: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
    grossSalary: '',
    deductions: '',
    netSalary: '',
    status: 'pending',
    paymentDate: '',
    department: ''
  });

  const statuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];
  const departments = ['Management', 'Partners', 'Finance', 'Operations', 'Marketing', 'HR', 'IT'];

  // Filter payroll records
  React.useEffect(() => {
    let filtered = payrollRecords;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(record =>
        record.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    setFilteredRecords(filtered);
  }, [payrollRecords, searchQuery, statusFilter]);

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

  const handleAddPayroll = () => {
    const newRecord = {
      id: Math.max(...payrollRecords.map(r => r.id)) + 1,
      ...payrollFormData,
      grossSalary: parseFloat(payrollFormData.grossSalary),
      deductions: parseFloat(payrollFormData.deductions),
      netSalary: parseFloat(payrollFormData.netSalary)
    };

    setPayrollRecords([...payrollRecords, newRecord]);
    setIsAddModalOpen(false);
    resetPayrollForm();
  };

  const handleEditPayroll = () => {
    setPayrollRecords(payrollRecords.map(record => 
      record.id === selectedRecord.id 
        ? { 
            ...record, 
            ...payrollFormData,
            grossSalary: parseFloat(payrollFormData.grossSalary),
            deductions: parseFloat(payrollFormData.deductions),
            netSalary: parseFloat(payrollFormData.netSalary)
          }
        : record
    ));
    setIsEditModalOpen(false);
    resetPayrollForm();
  };

  const handleDeletePayroll = (recordId) => {
    if (window.confirm('Are you sure you want to delete this payroll record?')) {
      setPayrollRecords(payrollRecords.filter(record => record.id !== recordId));
    }
  };

  const resetPayrollForm = () => {
    setPayrollFormData({
      employee: '',
      period: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
      grossSalary: '',
      deductions: '',
      netSalary: '',
      status: 'pending',
      paymentDate: '',
      department: ''
    });
    setSelectedRecord(null);
  };

  const openEditModal = (record) => {
    setSelectedRecord(record);
    setPayrollFormData({
      employee: record.employee,
      period: record.period,
      grossSalary: record.grossSalary.toString(),
      deductions: record.deductions.toString(),
      netSalary: record.netSalary.toString(),
      status: record.status,
      paymentDate: record.paymentDate,
      department: record.department
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (record) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  const exportPayroll = () => {
    const csvContent = [
      ['Employee', 'Period', 'Gross Salary', 'Deductions', 'Net Salary', 'Status', 'Payment Date', 'Department'],
      ...filteredRecords.map(r => [
        r.employee,
        r.period,
        r.grossSalary,
        r.deductions,
        r.netSalary,
        r.status,
        r.paymentDate,
        r.department
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalGross = payrollRecords.reduce((sum, record) => sum + record.grossSalary, 0);
  const totalDeductions = payrollRecords.reduce((sum, record) => sum + record.deductions, 0);
  const totalNet = payrollRecords.reduce((sum, record) => sum + record.netSalary, 0);
  const pendingPayments = payrollRecords.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage employee payroll and payments
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <AppleButton
            variant="secondary"
            icon={Download}
            onClick={exportPayroll}
          >
            Export CSV
          </AppleButton>
          <AppleButton
            variant="primary"
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            New Payroll
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
              <p className="text-sm font-medium text-gray-500">Total Gross</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalGross)}</p>
            </div>
          </div>
        </AppleCard>

        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Deductions</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDeductions)}</p>
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
              <p className="text-sm font-medium text-gray-500">Total Net</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalNet)}</p>
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
              <p className="text-sm font-medium text-gray-500">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">{pendingPayments}</p>
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
                placeholder="Search payroll records..."
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
        
        {/* Payroll Records Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deductions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Date
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-800 font-medium text-sm">
                            {record.employee.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{record.employee}</div>
                        <div className="text-sm text-gray-500">{record.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(record.grossSalary)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(record.deductions)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(record.netSalary)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.paymentDate 
                      ? new Date(record.paymentDate).toLocaleDateString()
                      : 'Not paid'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <AppleButton
                        variant="ghost"
                        size="small"
                        icon={Eye}
                        onClick={() => openViewModal(record)}
                      />
                      <AppleButton
                        variant="ghost"
                        size="small"
                        icon={Edit}
                        onClick={() => openEditModal(record)}
                      />
                      <AppleButton
                        variant="ghost"
                        size="small"
                        icon={Trash2}
                        onClick={() => handleDeletePayroll(record.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <FileText className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payroll records found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first payroll record.'
                }
              </p>
            </div>
          )}
        </div>
      </AppleCard>

      {/* Add Payroll Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Payroll</h3>
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
                  value={payrollFormData.employee}
                  onChange={(e) => setPayrollFormData({...payrollFormData, employee: e.target.value})}
                  placeholder="Enter employee name"
                />
              </div>

              <div>
                <AppleInput
                  label="Period"
                  type="text"
                  value={payrollFormData.period}
                  onChange={(e) => setPayrollFormData({...payrollFormData, period: e.target.value})}
                  placeholder="e.g., December 2023"
                />
              </div>

              <div>
                <AppleInput
                  label="Gross Salary (PKR)"
                  type="number"
                  value={payrollFormData.grossSalary}
                  onChange={(e) => setPayrollFormData({...payrollFormData, grossSalary: e.target.value})}
                  placeholder="Enter gross salary"
                />
              </div>

              <div>
                <AppleInput
                  label="Deductions (PKR)"
                  type="number"
                  value={payrollFormData.deductions}
                  onChange={(e) => setPayrollFormData({...payrollFormData, deductions: e.target.value})}
                  placeholder="Enter deductions"
                />
              </div>

              <div>
                <AppleInput
                  label="Net Salary (PKR)"
                  type="number"
                  value={payrollFormData.netSalary}
                  onChange={(e) => setPayrollFormData({...payrollFormData, netSalary: e.target.value})}
                  placeholder="Enter net salary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={payrollFormData.status}
                  onChange={(e) => setPayrollFormData({...payrollFormData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <AppleInput
                  label="Payment Date"
                  type="date"
                  value={payrollFormData.paymentDate}
                  onChange={(e) => setPayrollFormData({...payrollFormData, paymentDate: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={payrollFormData.department}
                  onChange={(e) => setPayrollFormData({...payrollFormData, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
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
                onClick={handleAddPayroll}
              >
                Add Payroll
              </AppleButton>
            </div>
          </div>
        </div>
      )}

      {/* Edit Payroll Modal */}
      {isEditModalOpen && selectedRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit Payroll</h3>
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
                  value={payrollFormData.employee}
                  onChange={(e) => setPayrollFormData({...payrollFormData, employee: e.target.value})}
                />
              </div>

              <div>
                <AppleInput
                  label="Period"
                  type="text"
                  value={payrollFormData.period}
                  onChange={(e) => setPayrollFormData({...payrollFormData, period: e.target.value})}
                />
              </div>

              <div>
                <AppleInput
                  label="Gross Salary (PKR)"
                  type="number"
                  value={payrollFormData.grossSalary}
                  onChange={(e) => setPayrollFormData({...payrollFormData, grossSalary: e.target.value})}
                />
              </div>

              <div>
                <AppleInput
                  label="Deductions (PKR)"
                  type="number"
                  value={payrollFormData.deductions}
                  onChange={(e) => setPayrollFormData({...payrollFormData, deductions: e.target.value})}
                />
              </div>

              <div>
                <AppleInput
                  label="Net Salary (PKR)"
                  type="number"
                  value={payrollFormData.netSalary}
                  onChange={(e) => setPayrollFormData({...payrollFormData, netSalary: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={payrollFormData.status}
                  onChange={(e) => setPayrollFormData({...payrollFormData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <AppleInput
                  label="Payment Date"
                  type="date"
                  value={payrollFormData.paymentDate}
                  onChange={(e) => setPayrollFormData({...payrollFormData, paymentDate: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={payrollFormData.department}
                  onChange={(e) => setPayrollFormData({...payrollFormData, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
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
                onClick={handleEditPayroll}
              >
                Save Changes
              </AppleButton>
            </div>
          </div>
        </div>
      )}

      {/* View Payroll Modal */}
      {isViewModalOpen && selectedRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Payroll Details</h3>
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
                    {selectedRecord.employee.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedRecord.employee}</h2>
                  <p className="text-gray-600">{selectedRecord.period}</p>
                  <div className="mt-2">
                    {getStatusBadge(selectedRecord.status)}
                  </div>
                </div>
              </div>

              {/* Salary Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Gross Salary</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(selectedRecord.grossSalary)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Deductions</p>
                  <p className="text-xl font-bold text-red-600">{formatCurrency(selectedRecord.deductions)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Net Salary</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(selectedRecord.netSalary)}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Employee Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Department:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedRecord.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Period:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedRecord.period}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Payment Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <div>{getStatusBadge(selectedRecord.status)}</div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Payment Date:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedRecord.paymentDate 
                          ? new Date(selectedRecord.paymentDate).toLocaleDateString()
                          : 'Not paid'}
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
                  openEditModal(selectedRecord);
                }}
              >
                Edit Payroll
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

export default Payroll;