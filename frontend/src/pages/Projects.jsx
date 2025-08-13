import React, { useState, useEffect } from 'react';
import { 
  FolderOpen, 
  Plus, 
  Calendar, 
  Users as ProjectUsers,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Building,
  Tag,
  DollarSign,
  X
} from 'lucide-react';
import { AppleButton, AppleInput, AppleCard } from '../components/ui';

const Projects = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'TechCorp Website Development',
      client: 'TechCorp USA',
      status: 'active',
      progress: 75,
      team: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      deadline: '2025-03-15T00:00:00Z',
      startDate: '2025-01-15T00:00:00Z',
      budget: 50000,
      spent: 37500,
      description: 'Complete website redesign with modern UI/UX',
      tags: ['web', 'design', 'development'],
      priority: 'high'
    },
    {
      id: 2,
      name: 'Mobile App UI Design',
      client: 'Digital Solutions Ltd',
      status: 'planning',
      progress: 10,
      team: ['Sarah Wilson', 'Tom Brown'],
      deadline: '2025-05-20T00:00:00Z',
      startDate: '2025-02-01T00:00:00Z',
      budget: 25000,
      spent: 2500,
      description: 'Design system and UI components for mobile app',
      tags: ['mobile', 'ui', 'design'],
      priority: 'medium'
    },
    {
      id: 3,
      name: 'E-commerce Platform',
      client: 'Global Enterprises',
      status: 'completed',
      progress: 100,
      team: ['Alex Chen', 'Maria Garcia', 'David Kim'],
      deadline: '2025-02-28T00:00:00Z',
      startDate: '2024-11-01T00:00:00Z',
      budget: 100000,
      spent: 95000,
      description: 'Full e-commerce platform with payment integration',
      tags: ['ecommerce', 'platform', 'payment'],
      priority: 'high'
    }
  ]);
  
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    status: 'planning',
    progress: 0,
    team: '',
    deadline: '',
    startDate: '',
    budget: 0,
    spent: 0,
    description: '',
    tags: '',
    priority: 'medium'
  });

  // Filter projects based on search and filters
  useEffect(() => {
    let filtered = projects;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(project => project.priority === priorityFilter);
    }
    
    setFilteredProjects(filtered);
  }, [projects, searchQuery, statusFilter, priorityFilter]);

  // Handle form submission for adding new project
  const handleAddProject = () => {
    if (!formData.name || !formData.client) {
      alert('Please fill in required fields (Name and Client)');
      return;
    }

    const newProject = {
      id: Math.max(...projects.map(p => p.id)) + 1,
      ...formData,
      team: formData.team ? formData.team.split(',').map(member => member.trim()) : [],
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
    };

    setProjects([...projects, newProject]);
    setIsAddModalOpen(false);
    resetForm();
  };

  // Handle form submission for editing project
  const handleEditProject = () => {
    if (!formData.name || !formData.client) {
      alert('Please fill in required fields (Name and Client)');
      return;
    }

    setProjects(projects.map(project => 
      project.id === selectedProject.id 
        ? { 
            ...project, 
            ...formData,
            team: formData.team ? formData.team.split(',').map(member => member.trim()) : [],
            tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
          }
        : project
    ));
    setIsEditModalOpen(false);
    resetForm();
  };

  // Handle project deletion
  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      setProjects(projects.filter(project => project.id !== projectId));
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      client: '',
      status: 'planning',
      progress: 0,
      team: '',
      deadline: '',
      startDate: '',
      budget: 0,
      spent: 0,
      description: '',
      tags: '',
      priority: 'medium'
    });
    setSelectedProject(null);
  };

  // Open edit modal with project data
  const openEditModal = (project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name,
      client: project.client,
      status: project.status,
      progress: project.progress,
      team: project.team.join(', '),
      deadline: project.deadline,
      startDate: project.startDate,
      budget: project.budget,
      spent: project.spent,
      description: project.description,
      tags: project.tags.join(', '),
      priority: project.priority
    });
    setIsEditModalOpen(true);
  };

  // Open view modal
  const openViewModal = (project) => {
    setSelectedProject(project);
    setIsViewModalOpen(true);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusStyles = {
      planning: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800',
      onHold: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    const priorityStyles = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };

    const priorityIcons = {
      low: <Clock className="h-3 w-3 mr-1" />,
      medium: <AlertCircle className="h-3 w-3 mr-1" />,
      high: <XCircle className="h-3 w-3 mr-1" />
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityStyles[priority]}`}>
        {priorityIcons[priority]}
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage your active projects</p>
        </div>
        <AppleButton 
          variant="primary" 
          icon={Plus}
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 sm:mt-0"
        >
          New Project
        </AppleButton>
      </div>

      {/* Filters */}
      <AppleCard>
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <AppleInput
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </div>
            
            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
              >
                <option value="all">All Status</option>
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="onHold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            {/* Priority Filter */}
            <div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>
      </AppleCard>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <AppleCard key={project.id}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex space-x-2">
                {getStatusBadge(project.status)}
                {getPriorityBadge(project.priority)}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
            <p className="text-gray-600 mb-4">Client: {project.client}</p>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <ProjectUsers className="h-4 w-4 mr-1" />
                {project.team.length} team members
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(project.deadline).toLocaleDateString()}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-gray-600">Budget: </span>
                <span className="font-medium text-gray-900">{formatCurrency(project.budget)}</span>
              </div>
              <div className="flex space-x-2">
                <AppleButton
                  variant="ghost"
                  size="small"
                  icon={Eye}
                  onClick={() => openViewModal(project)}
                  title="View Details"
                />
                <AppleButton
                  variant="ghost"
                  size="small"
                  icon={Edit}
                  onClick={() => openEditModal(project)}
                  title="Edit Project"
                />
                <AppleButton
                  variant="ghost"
                  size="small"
                  icon={Trash2}
                  onClick={() => handleDeleteProject(project.id)}
                  title="Delete Project"
                />
              </div>
            </div>
          </AppleCard>
        ))}
      </div>

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Project</h3>
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
                  label="Project Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter project name"
                  required
                />
              </div>
              
              <div>
                <AppleInput
                  label="Client"
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                  placeholder="Enter client name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="onHold">On Hold</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <AppleInput
                  label="Progress (%)"
                  type="number"
                  value={formData.progress}
                  onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value) || 0})}
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <AppleInput
                  label="Budget (PKR)"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value) || 0})}
                />
              </div>
              
              <div>
                <AppleInput
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              
              <div>
                <AppleInput
                  label="Deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                />
              </div>
              
              <div className="md:col-span-2">
                <AppleInput
                  label="Team Members (comma separated)"
                  type="text"
                  value={formData.team}
                  onChange={(e) => setFormData({...formData, team: e.target.value})}
                  placeholder="John Doe, Jane Smith, Mike Johnson"
                />
              </div>
              
              <div className="md:col-span-2">
                <AppleInput
                  label="Tags (comma separated)"
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="web, design, development"
                />
              </div>
              
              <div className="md:col-span-2">
                <AppleInput
                  label="Description"
                  type="textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter project description"
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
                onClick={handleAddProject}
              >
                Add Project
              </AppleButton>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {isEditModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit Project</h3>
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
                  label="Project Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <AppleInput
                  label="Client"
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="onHold">On Hold</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <AppleInput
                  label="Progress (%)"
                  type="number"
                  value={formData.progress}
                  onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value) || 0})}
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <AppleInput
                  label="Budget (PKR)"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value) || 0})}
                />
              </div>
              
              <div>
                <AppleInput
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              
              <div>
                <AppleInput
                  label="Deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                />
              </div>
              
              <div className="md:col-span-2">
                <AppleInput
                  label="Team Members (comma separated)"
                  type="text"
                  value={formData.team}
                  onChange={(e) => setFormData({...formData, team: e.target.value})}
                />
              </div>
              
              <div className="md:col-span-2">
                <AppleInput
                  label="Tags (comma separated)"
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                />
              </div>
              
              <div className="md:col-span-2">
                <AppleInput
                  label="Description"
                  type="textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                onClick={handleEditProject}
              >
                Save Changes
              </AppleButton>
            </div>
          </div>
        </div>
      )}

      {/* View Project Modal */}
      {isViewModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Project Details</h3>
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
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FolderOpen className="h-8 w-8 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h2>
                  <p className="text-gray-600">Client: {selectedProject.client}</p>
                  <div className="flex space-x-2 mt-2">
                    {getStatusBadge(selectedProject.status)}
                    {getPriorityBadge(selectedProject.priority)}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{selectedProject.progress}%</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
              
              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{selectedProject.description}</p>
              </div>
              
              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Project Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Start Date:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(selectedProject.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Deadline:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(selectedProject.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Budget:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(selectedProject.budget)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Spent:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(selectedProject.spent)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Remaining:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(selectedProject.budget - selectedProject.spent)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Team & Tags</h4>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-500 block mb-1">Team Members:</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.team.map((member, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            <User className="h-3 w-3 mr-1" />
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-500 block mb-1">Tags:</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Progress */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Progress</h4>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-purple-600 h-3 rounded-full"
                    style={{ width: `${selectedProject.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <AppleButton
                variant="primary"
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(selectedProject);
                }}
              >
                Edit Project
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

export default Projects;