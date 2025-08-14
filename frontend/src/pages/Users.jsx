import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Download, Upload, X, Save, Users as UsersIcon, User, Shield, Mail, Phone, MapPin, Calendar, Lock, CheckCircle, XCircle } from 'lucide-react';
import { AppleButton, AppleInput, AppleCard } from '../components/ui';

const Users = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Ahmad Ali',
      email: 'ahmad.ali@ghlboysclub.com',
      role: 'Admin',
      status: 'active',
      phone: '+92 300 1234567',
      department: 'Management',
      joinDate: '2023-01-15',
      lastLogin: '2024-01-15T09:30:00Z'
    },
    {
      id: 2,
      name: 'Hassan Khan',
      email: 'hassan.khan@ghlboysclub.com',
      role: 'Partner',
      status: 'active',
      phone: '+92 300 2345678',
      department: 'Partners',
      joinDate: '2023-02-20',
      lastLogin: '2024-01-14T16:45:00Z'
    },
    {
      id: 3,
      name: 'Fatima Shah',
      email: 'fatima.shah@ghlboysclub.com',
      role: 'Accountant',
      status: 'active',
      phone: '+92 300 3456789',
      department: 'Finance',
      joinDate: '2023-03-10',
      lastLogin: '2024-01-15T08:20:00Z'
    },
    {
      id: 4,
      name: 'Omar Malik',
      email: 'omar.malik@ghlboysclub.com',
      role: 'Manager',
      status: 'inactive',
      phone: '+92 300 4567890',
      department: 'Operations',
      joinDate: '2023-04-05',
      lastLogin: '2023-12-15T14:30:00Z'
    }
  ]);
  
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    role: 'User',
    status: 'active',
    phone: '',
    department: '',
    joinDate: new Date().toISOString().split('T')[0],
    password: ''
  });

  const roles = ['Admin', 'Partner', 'Manager', 'Accountant', 'User'];
  const statuses = [
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' }
  ];
  const departments = ['Management', 'Partners', 'Finance', 'Operations', 'Marketing', 'HR', 'IT'];

  // Filter users
  React.useEffect(() => {
    let filtered = users;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, statusFilter, roleFilter]);

  const getStatusBadge = (status) => {
    const statusObj = statuses.find(s => s.value === status);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusObj.color}`}>
        {statusObj.label}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      'Admin': 'bg-purple-100 text-purple-800',
      'Partner': 'bg-blue-100 text-blue-800',
      'Manager': 'bg-green-100 text-green-800',
      'Accountant': 'bg-yellow-100 text-yellow-800',
      'User': 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[role] || 'bg-gray-100 text-gray-800'}`}>
        {role}
      </span>
    );
  };

  const handleAddUser = () => {
    const newUser = {
      id: Math.max(...users.map(u => u.id)) + 1,
      ...userFormData,
      lastLogin: null
    };

    setUsers([...users, newUser]);
    setIsAddModalOpen(false);
    resetUserForm();
  };

  const handleEditUser = () => {
    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, ...userFormData }
        : user
    ));
    setIsEditModalOpen(false);
    resetUserForm();
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const resetUserForm = () => {
    setUserFormData({
      name: '',
      email: '',
      role: 'User',
      status: 'active',
      phone: '',
      department: '',
      joinDate: new Date().toISOString().split('T')[0],
      password: ''
    });
    setSelectedUser(null);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone,
      department: user.department,
      joinDate: user.joinDate,
      password: ''
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Status', 'Phone', 'Department', 'Join Date', 'Last Login'],
      ...filteredUsers.map(u => [
        u.name,
        u.email,
        u.role,
        u.status,
        u.phone,
        u.department,
        u.joinDate,
        u.lastLogin || 'Never'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const adminUsers = users.filter(u => u.role === 'Admin').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage system users and permissions
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <AppleButton
            variant="secondary"
            icon={Download}
            onClick={exportUsers}
          >
            Export CSV
          </AppleButton>
          <AppleButton
            variant="primary"
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add User
          </AppleButton>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
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
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
            </div>
          </div>
        </AppleCard>

        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Admin Users</p>
              <p className="text-2xl font-bold text-gray-900">{adminUsers}</p>
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
                placeholder="Search users..."
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
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-800 font-medium text-sm">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin 
                      ? new Date(user.lastLogin).toLocaleDateString() 
                      : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <AppleButton
                        variant="ghost"
                        size="small"
                        icon={Eye}
                        onClick={() => openViewModal(user)}
                      />
                      <AppleButton
                        variant="ghost"
                        size="small"
                        icon={Edit}
                        onClick={() => openEditModal(user)}
                      />
                      <AppleButton
                        variant="ghost"
                        size="small"
                        icon={Trash2}
                        onClick={() => handleDeleteUser(user.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <UsersIcon className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || statusFilter !== 'all' || roleFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first user.'
                }
              </p>
            </div>
          )}
        </div>
      </AppleCard>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New User</h3>
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
                  label="Full Name"
                  type="text"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <AppleInput
                  label="Email"
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({...userFormData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={userFormData.status}
                  onChange={(e) => setUserFormData({...userFormData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <AppleInput
                  label="Phone"
                  type="tel"
                  value={userFormData.phone}
                  onChange={(e) => setUserFormData({...userFormData, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={userFormData.department}
                  onChange={(e) => setUserFormData({...userFormData, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <AppleInput
                  label="Join Date"
                  type="date"
                  value={userFormData.joinDate}
                  onChange={(e) => setUserFormData({...userFormData, joinDate: e.target.value})}
                />
              </div>

              <div>
                <AppleInput
                  label="Password"
                  type="password"
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                  placeholder="Enter password"
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
                onClick={handleAddUser}
              >
                Add User
              </AppleButton>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
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
                  label="Full Name"
                  type="text"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
                />
              </div>

              <div>
                <AppleInput
                  label="Email"
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({...userFormData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={userFormData.status}
                  onChange={(e) => setUserFormData({...userFormData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <AppleInput
                  label="Phone"
                  type="tel"
                  value={userFormData.phone}
                  onChange={(e) => setUserFormData({...userFormData, phone: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={userFormData.department}
                  onChange={(e) => setUserFormData({...userFormData, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <AppleInput
                  label="Join Date"
                  type="date"
                  value={userFormData.joinDate}
                  onChange={(e) => setUserFormData({...userFormData, joinDate: e.target.value})}
                />
              </div>

              <div>
                <AppleInput
                  label="Password"
                  type="password"
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                  placeholder="Leave blank to keep current password"
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
                onClick={handleEditUser}
              >
                Save Changes
              </AppleButton>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">User Details</h3>
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
                    {selectedUser.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}</h2>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    {getRoleBadge(selectedUser.role)}
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{selectedUser.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{selectedUser.department}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Account Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Role:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedUser.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <div>{getStatusBadge(selectedUser.status)}</div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Join Date:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(selectedUser.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Last Login:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedUser.lastLogin 
                          ? new Date(selectedUser.lastDate).toLocaleDateString()
                          : 'Never'}
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
                  openEditModal(selectedUser);
                }}
              >
                Edit User
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

export default Users;