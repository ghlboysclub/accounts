import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Download, Upload, X, Save, Target, Calendar, Tag, User, Building, CheckCircle, Clock, XCircle, TrendingUp, Award } from 'lucide-react';
import { AppleButton, AppleInput, AppleCard } from '../components/ui';

const Goals = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Increase Revenue by 25%',
      description: 'Achieve 25% growth in quarterly revenue through new client acquisition and upselling',
      category: 'Financial',
      priority: 'high',
      status: 'in-progress',
      progress: 65,
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      assignedTo: 'Ahmad Ali',
      tags: ['revenue', 'growth', 'q1'],
      createdAt: '2023-12-15T09:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      title: 'Launch Mobile App',
      description: 'Complete development and launch of the new mobile application for clients',
      category: 'Product',
      priority: 'high',
      status: 'pending',
      progress: 0,
      startDate: '2024-02-01',
      endDate: '2024-05-31',
      assignedTo: 'Hassan Khan',
      tags: ['mobile', 'app', 'development'],
      createdAt: '2024-01-10T14:30:00Z',
      updatedAt: '2024-01-10T14:30:00Z'
    },
    {
      id: 3,
      title: 'Expand Team',
      description: 'Hire 3 new developers and 2 marketing specialists to support growth',
      category: 'HR',
      priority: 'medium',
      status: 'completed',
      progress: 100,
      startDate: '2023-11-01',
      endDate: '2024-01-31',
      assignedTo: 'Fatima Shah',
      tags: ['hiring', 'team', 'expansion'],
      createdAt: '2023-10-20T11:15:00Z',
      updatedAt: '2024-01-20T16:45:00Z'
    },
    {
      id: 4,
      title: 'Improve Client Satisfaction',
      description: 'Increase client satisfaction scores to 4.5/5 or higher',
      category: 'Customer',
      priority: 'medium',
      status: 'in-progress',
      progress: 40,
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      assignedTo: 'Omar Malik',
      tags: ['client', 'satisfaction', 'support'],
      createdAt: '2023-12-05T10:45:00Z',
      updatedAt: '2024-01-12T09:30:00Z'
    }
  ]);
  
  const [filteredGoals, setFilteredGoals] = useState(goals);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [goalFormData, setGoalFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    status: 'pending',
    progress: 0,
    startDate: '',
    endDate: '',
    assignedTo: '',
    tags: ''
  });

  const categories = ['Financial', 'Product', 'HR', 'Customer', 'Marketing', 'Operations', 'Other'];
  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-red-600' }
  ];
  const statuses = [
    { value: 'pending', label: 'Pending', color: 'text-yellow-600' },
    { value: 'in-progress', label: 'In Progress', color: 'text-blue-600' },
    { value: 'completed', label: 'Completed', color: 'text-green-600' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-600' }
  ];

  // Filter goals
  React.useEffect(() => {
    let filtered = goals;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(goal =>
        goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(goal => goal.status === statusFilter);
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(goal => goal.category === categoryFilter);
    }

    setFilteredGoals(filtered);
  }, [goals, searchQuery, statusFilter, categoryFilter]);

  const getPriorityBadge = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityObj.color}`}>
        {priorityObj.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusObj = statuses.find(s => s.value === status);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusObj.color}`}>
        {statusObj.label}
      </span>
    );
  };

  const handleAddGoal = () => {
    const newGoal = {
      id: Math.max(...goals.map(g => g.id)) + 1,
      ...goalFormData,
      tags: goalFormData.tags ? goalFormData.tags.split(',').map(tag => tag.trim()) : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setGoals([newGoal, ...goals]);
    setIsAddModalOpen(false);
    resetGoalForm();
  };

  const handleDeleteGoal = (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setGoals(goals.filter(goal => goal.id !== goalId));
    }
  };

  const resetGoalForm = () => {
    setGoalFormData({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      status: 'pending',
      progress: 0,
      startDate: '',
      endDate: '',
      assignedTo: '',
      tags: ''
    });
    setSelectedGoal(null);
  };

  const openViewModal = (goal) => {
    setSelectedGoal(goal);
    setIsViewModalOpen(true);
  };

  const exportGoals = () => {
    const csvContent = [
      ['Title', 'Description', 'Category', 'Priority', 'Status', 'Progress', 'Start Date', 'End Date', 'Assigned To'],
      ...filteredGoals.map(g => [
        g.title,
        g.description,
        g.category,
        g.priority,
        g.status,
        g.progress,
        g.startDate,
        g.endDate,
        g.assignedTo
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `goals-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const inProgressGoals = goals.filter(g => g.status === 'in-progress').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage your organizational goals
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <AppleButton
            variant="secondary"
            icon={Download}
            onClick={exportGoals}
          >
            Export Goals
          </AppleButton>
          <AppleButton
            variant="primary"
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Goal
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
              <p className="text-sm font-medium text-gray-500">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900">{totalGoals}</p>
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
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedGoals}</p>
            </div>
          </div>
        </AppleCard>

        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressGoals}</p>
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
                placeholder="Search goals..."
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
        
        {/* Goals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {filteredGoals.map((goal) => (
            <div key={goal.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{goal.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{goal.description}</p>
                  </div>
                  <div className="flex space-x-1">
                    <AppleButton
                      variant="ghost"
                      size="small"
                      icon={Eye}
                      onClick={() => openViewModal(goal)}
                    />
                    <AppleButton
                      variant="ghost"
                      size="small"
                      icon={Trash2}
                      onClick={() => handleDeleteGoal(goal.id)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {goal.category}
                  </span>
                  <div className="flex space-x-2">
                    {getPriorityBadge(goal.priority)}
                    {getStatusBadge(goal.status)}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {goal.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {tag}
                    </span>
                  ))}
                  {goal.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{goal.tags.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <User className="h-3 w-3 mr-1" />
                    <span>{goal.assignedTo}</span>
                  </div>
                  <div className="text-gray-500">
                    {new Date(goal.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredGoals.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Target className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No goals found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first goal.'
              }
            </p>
            <div className="mt-6">
              <AppleButton
                variant="primary"
                icon={Plus}
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Goal
              </AppleButton>
            </div>
          </div>
        )}
      </AppleCard>

      {/* Add Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Goal</h3>
              <AppleButton
                variant="ghost"
                size="small"
                icon={X}
                onClick={() => setIsAddModalOpen(false)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="md:col-span-2">
                <AppleInput
                  label="Goal Title"
                  type="text"
                  value={goalFormData.title}
                  onChange={(e) => setGoalFormData({...goalFormData, title: e.target.value})}
                  placeholder="Enter goal title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={goalFormData.description}
                  onChange={(e) => setGoalFormData({...goalFormData, description: e.target.value})}
                  placeholder="Enter goal description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={goalFormData.category}
                  onChange={(e) => setGoalFormData({...goalFormData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={goalFormData.priority}
                  onChange={(e) => setGoalFormData({...goalFormData, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={goalFormData.status}
                  onChange={(e) => setGoalFormData({...goalFormData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <AppleInput
                  label="Progress (%)"
                  type="number"
                  value={goalFormData.progress}
                  onChange={(e) => setGoalFormData({...goalFormData, progress: parseInt(e.target.value) || 0})}
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={goalFormData.startDate}
                  onChange={(e) => setGoalFormData({...goalFormData, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={goalFormData.endDate}
                  onChange={(e) => setGoalFormData({...goalFormData, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <AppleInput
                  label="Assigned To"
                  type="text"
                  value={goalFormData.assignedTo}
                  onChange={(e) => setGoalFormData({...goalFormData, assignedTo: e.target.value})}
                  placeholder="Enter assignee name"
                />
              </div>

              <div className="md:col-span-2">
                <AppleInput
                  label="Tags (comma separated)"
                  type="text"
                  value={goalFormData.tags}
                  onChange={(e) => setGoalFormData({...goalFormData, tags: e.target.value})}
                  placeholder="Enter tags"
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
                onClick={handleAddGoal}
              >
                Add Goal
              </AppleButton>
            </div>
          </div>
        </div>
      )}

      {/* View Goal Modal */}
      {isViewModalOpen && selectedGoal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Goal Details</h3>
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
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900">{selectedGoal.title}</h2>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {selectedGoal.category}
                    </span>
                    {getPriorityBadge(selectedGoal.priority)}
                    {getStatusBadge(selectedGoal.status)}
                  </div>
                </div>
              </div>

              {/* Goal Description */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{selectedGoal.description}</p>
                </div>
              </div>

              {/* Progress */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Progress</h4>
                <div className="mb-1">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-medium text-gray-900">{selectedGoal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full" 
                      style={{ width: `${selectedGoal.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Goal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Goal Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Start Date:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(selectedGoal.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">End Date:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(selectedGoal.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Assigned To:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedGoal.assignedTo}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Info</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Created:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(selectedGoal.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Last Updated:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(selectedGoal.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {selectedGoal.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedGoal.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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

export default Goals;