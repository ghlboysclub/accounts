import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Download, Upload, X, Save, FileText, Calendar, Tag, User, Building, CheckCircle, Clock, XCircle, StickyNote, Pin, Archive, Star } from 'lucide-react';
import { AppleButton, AppleInput, AppleCard } from '../components/ui';

const Notes = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Q4 Meeting Notes',
      content: 'Discussed Q4 financial targets and strategies. Key points: Increase marketing budget by 15%, Focus on mobile app development, Expand to new markets in Q1 2024.',
      category: 'Meetings',
      tags: ['q4', 'meeting', 'strategy'],
      priority: 'high',
      isPinned: true,
      isArchived: false,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      title: 'Client Feedback - TechCorp',
      content: 'Received feedback from TechCorp on the latest project deliverables. They are happy with the progress but requested additional features in the next iteration.',
      category: 'Clients',
      tags: ['techcorp', 'feedback', 'client'],
      priority: 'medium',
      isPinned: false,
      isArchived: false,
      createdAt: '2024-01-14T15:45:00Z',
      updatedAt: '2024-01-14T15:45:00Z'
    },
    {
      id: 3,
      title: 'Project Requirements',
      content: 'Gathered detailed requirements for the new mobile app project. Key features: User authentication, Payment integration, Real-time notifications, Analytics dashboard.',
      category: 'Projects',
      tags: ['mobile', 'app', 'requirements'],
      priority: 'high',
      isPinned: true,
      isArchived: false,
      createdAt: '2024-01-13T09:20:00Z',
      updatedAt: '2024-01-13T09:20:00Z'
    },
    {
      id: 4,
      title: 'Team Ideas',
      content: 'Brainstorming session results: New marketing campaign ideas, Office improvement suggestions, Team building activities for Q1.',
      category: 'Ideas',
      tags: ['brainstorming', 'ideas', 'team'],
      priority: 'low',
      isPinned: false,
      isArchived: false,
      createdAt: '2024-01-12T14:15:00Z',
      updatedAt: '2024-01-12T14:15:00Z'
    }
  ]);
  
  const [filteredNotes, setFilteredNotes] = useState(notes);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteFormData, setNoteFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    priority: 'medium'
  });

  const categories = ['Meetings', 'Clients', 'Projects', 'Ideas', 'Personal', 'Other'];
  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-red-600' }
  ];

  // Filter notes
  React.useEffect(() => {
    let filtered = notes;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(note => note.category === categoryFilter);
    }

    setFilteredNotes(filtered);
  }, [notes, searchQuery, categoryFilter]);

  const getPriorityBadge = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityObj.color}`}>
        {priorityObj.label}
      </span>
    );
  };

  const handleAddNote = () => {
    const newNote = {
      id: Math.max(...notes.map(n => n.id)) + 1,
      ...noteFormData,
      tags: noteFormData.tags ? noteFormData.tags.split(',').map(tag => tag.trim()) : [],
      isPinned: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNotes([newNote, ...notes]);
    setIsAddModalOpen(false);
    resetNoteForm();
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== noteId));
    }
  };

  const resetNoteForm = () => {
    setNoteFormData({
      title: '',
      content: '',
      category: '',
      tags: '',
      priority: 'medium'
    });
    setSelectedNote(null);
  };

  const openViewModal = (note) => {
    setSelectedNote(note);
    setIsViewModalOpen(true);
  };

  const exportNotes = () => {
    const csvContent = [
      ['Title', 'Content', 'Category', 'Priority', 'Created At'],
      ...filteredNotes.map(n => [
        n.title,
        n.content,
        n.category,
        n.priority,
        n.createdAt
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalNotes = notes.length;
  const pinnedNotes = notes.filter(n => n.isPinned).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Capture and organize your thoughts and ideas
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <AppleButton
            variant="secondary"
            icon={Download}
            onClick={exportNotes}
          >
            Export Notes
          </AppleButton>
          <AppleButton
            variant="primary"
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Note
          </AppleButton>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <StickyNote className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Notes</p>
              <p className="text-2xl font-bold text-gray-900">{totalNotes}</p>
            </div>
          </div>
        </AppleCard>

        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Pin className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pinned Notes</p>
              <p className="text-2xl font-bold text-gray-900">{pinnedNotes}</p>
            </div>
          </div>
        </AppleCard>

        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Archive className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{[...new Set(notes.map(n => n.category))].length}</p>
            </div>
          </div>
        </AppleCard>
      </div>

      {/* Filters */}
      <AppleCard>
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <AppleInput
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
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
            
            <div className="flex items-center">
              <AppleButton
                variant="secondary"
                icon={Filter}
              >
                Advanced Filter
              </AppleButton>
            </div>
          </div>
        </div>
        
        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredNotes.map((note) => (
            <div key={note.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-gray-900 mb-1 truncate flex-1">{note.title}</h3>
                  <div className="flex space-x-1">
                    {note.isPinned && <Pin className="h-4 w-4 text-yellow-600" />}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{note.content}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {note.category}
                  </span>
                  {getPriorityBadge(note.priority)}
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {note.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{note.tags.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-1">
                    <AppleButton
                      variant="ghost"
                      size="small"
                      icon={Eye}
                      onClick={() => openViewModal(note)}
                    />
                    <AppleButton
                      variant="ghost"
                      size="small"
                      icon={Trash2}
                      onClick={() => handleDeleteNote(note.id)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <StickyNote className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notes found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || categoryFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first note.'
              }
            </p>
            <div className="mt-6">
              <AppleButton
                variant="primary"
                icon={Plus}
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Note
              </AppleButton>
            </div>
          </div>
        )}
      </AppleCard>

      {/* Add Note Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Note</h3>
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
                  label="Note Title"
                  type="text"
                  value={noteFormData.title}
                  onChange={(e) => setNoteFormData({...noteFormData, title: e.target.value})}
                  placeholder="Enter note title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={noteFormData.content}
                  onChange={(e) => setNoteFormData({...noteFormData, content: e.target.value})}
                  placeholder="Enter note content"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={noteFormData.category}
                  onChange={(e) => setNoteFormData({...noteFormData, category: e.target.value})}
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
                  value={noteFormData.priority}
                  onChange={(e) => setNoteFormData({...noteFormData, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <AppleInput
                  label="Tags (comma separated)"
                  type="text"
                  value={noteFormData.tags}
                  onChange={(e) => setNoteFormData({...noteFormData, tags: e.target.value})}
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
                onClick={handleAddNote}
              >
                Add Note
              </AppleButton>
            </div>
          </div>
        </div>
      )}

      {/* View Note Modal */}
      {isViewModalOpen && selectedNote && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Note Details</h3>
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
                    <StickyNote className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900">{selectedNote.title}</h2>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {selectedNote.category}
                    </span>
                    {getPriorityBadge(selectedNote.priority)}
                    {selectedNote.isPinned && <Pin className="h-4 w-4 text-yellow-600" />}
                  </div>
                </div>
              </div>

              {/* Note Content */}
              <div>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedNote.content}</p>
                </div>
              </div>

              {/* Note Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Note Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Created:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(selectedNote.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Last Updated:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(selectedNote.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNote.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {tag}
                      </span>
                    ))}
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

export default Notes;