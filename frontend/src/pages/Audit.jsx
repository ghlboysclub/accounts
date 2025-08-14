import React, { useState } from 'react';
import { Search, Filter, Eye, Download, X, User, Calendar, Shield, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { AppleButton, AppleInput, AppleCard } from '../components/ui';

const Audit = () => {
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 1,
      user: 'Ahmad Ali',
      action: 'Login',
      resource: 'System',
      timestamp: '2024-01-15T10:30:00Z',
      ipAddress: '192.168.1.100',
      status: 'success',
      details: 'User logged in successfully'
    },
    {
      id: 2,
      user: 'Hassan Khan',
      action: 'Create',
      resource: 'Transaction',
      timestamp: '2024-01-15T09:45:00Z',
      ipAddress: '192.168.1.101',
      status: 'success',
      details: 'Created new transaction for TechCorp payment'
    },
    {
      id: 3,
      user: 'Fatima Shah',
      action: 'Update',
      resource: 'Client',
      timestamp: '2024-01-14T16:20:00Z',
      ipAddress: '192.168.1.102',
      status: 'success',
      details: 'Updated client information for Digital Solutions Ltd'
    },
    {
      id: 4,
      user: 'Omar Malik',
      action: 'Delete',
      resource: 'Document',
      timestamp: '2024-01-14T14:15:00Z',
      ipAddress: '192.168.1.103',
      status: 'success',
      details: 'Deleted old financial report'
    },
    {
      id: 5,
      user: 'Admin',
      action: 'Login',
      resource: 'System',
      timestamp: '2024-01-14T09:00:00Z',
      ipAddress: '192.168.1.100',
      status: 'failed',
      details: 'Failed login attempt - invalid credentials'
    }
  ]);
  
  const [filteredLogs, setFilteredLogs] = useState(auditLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [isViewLogModalOpen, setIsViewLogModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const actions = ['Login', 'Logout', 'Create', 'Read', 'Update', 'Delete', 'Export', 'Import'];
  const statuses = [
    { value: 'success', label: 'Success', color: 'text-green-600' },
    { value: 'failed', label: 'Failed', color: 'text-red-600' },
    { value: 'pending', label: 'Pending', color: 'text-yellow-600' }
  ];

  // Filter audit logs
  React.useEffect(() => {
    let filtered = auditLogs;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(log =>
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    // Filter by action
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    setFilteredLogs(filtered);
  }, [auditLogs, searchQuery, statusFilter, actionFilter]);

  const getStatusBadge = (status) => {
    const statusObj = statuses.find(s => s.value === status);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusObj.color}`}>
        {statusObj.label}
      </span>
    );
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'Login':
        return <User className="h-4 w-4 text-blue-600" />;
      case 'Logout':
        return <User className="h-4 w-4 text-gray-600" />;
      case 'Create':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Read':
        return <Eye className="h-4 w-4 text-blue-600" />;
      case 'Update':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'Delete':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'Export':
        return <Download className="h-4 w-4 text-purple-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const openViewLogModal = (log) => {
    setSelectedLog(log);
    setIsViewLogModalOpen(true);
  };

  const exportAuditLogs = () => {
    const csvContent = [
      ['User', 'Action', 'Resource', 'Timestamp', 'IP Address', 'Status', 'Details'],
      ...filteredLogs.map(log => [
        log.user,
        log.action,
        log.resource,
        log.timestamp,
        log.ipAddress,
        log.status,
        log.details
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalLogs = auditLogs.length;
  const successLogs = auditLogs.filter(log => log.status === 'success').length;
  const failedLogs = auditLogs.filter(log => log.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
          <p className="mt-1 text-sm text-gray-500">
            System activity logs and security events
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <AppleButton
            variant="secondary"
            icon={Download}
            onClick={exportAuditLogs}
          >
            Export Logs
          </AppleButton>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Logs</p>
              <p className="text-2xl font-bold text-gray-900">{totalLogs}</p>
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
              <p className="text-sm font-medium text-gray-500">Successful Actions</p>
              <p className="text-2xl font-bold text-gray-900">{successLogs}</p>
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
              <p className="text-sm font-medium text-gray-500">Failed Actions</p>
              <p className="text-2xl font-bold text-gray-900">{failedLogs}</p>
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
                placeholder="Search audit logs..."
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
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
              >
                <option value="all">All Actions</option>
                {actions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Audit Logs Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User & Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
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
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-800 font-medium text-sm">
                            {log.user.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          {getActionIcon(log.action)}
                          <div className="ml-2 text-sm font-medium text-gray-900">{log.user}</div>
                        </div>
                        <div className="text-sm text-gray-500">{log.action} {log.resource}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.resource}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ipAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(log.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <AppleButton
                      variant="ghost"
                      size="small"
                      icon={Eye}
                      onClick={() => openViewLogModal(log)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Shield className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No audit logs found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || statusFilter !== 'all' || actionFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No audit logs have been recorded yet.'
                }
              </p>
            </div>
          )}
        </div>
      </AppleCard>

      {/* View Log Modal */}
      {isViewLogModalOpen && selectedLog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Audit Log Details</h3>
              <AppleButton
                variant="ghost"
                size="small"
                icon={X}
                onClick={() => setIsViewLogModalOpen(false)}
              />
            </div>

            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-12 w-12">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-800 font-medium text-lg">
                      {selectedLog.user.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900">{selectedLog.user}</h2>
                  <p className="text-gray-600">{selectedLog.action} {selectedLog.resource}</p>
                  <div className="mt-2">
                    {getStatusBadge(selectedLog.status)}
                  </div>
                </div>
              </div>

              {/* Log Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Activity Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Action:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedLog.action}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Resource:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedLog.resource}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <div>{getStatusBadge(selectedLog.status)}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Metadata</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Timestamp:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(selectedLog.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">IP Address:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedLog.ipAddress}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Details</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{selectedLog.details}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <AppleButton
                variant="secondary"
                onClick={() => setIsViewLogModalOpen(false)}
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

export default Audit;