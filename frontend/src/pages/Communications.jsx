import React, { useState } from 'react';
import { Send, Search, Filter, Edit, Trash2, Eye, Download, Upload, X, Save, MessageCircle, User, Users, Paperclip, Calendar, Bell, Check, CheckCircle, Clock, XCircle } from 'lucide-react';
import { AppleButton, AppleInput, AppleCard } from '../components/ui';

const Communications = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Ahmad Ali',
      recipient: 'All Partners',
      subject: 'Q4 Financial Report Available',
      content: 'Dear partners, the Q4 financial report is now available in the Documents section. Please review and let me know if you have any questions.',
      date: '2024-01-15T10:30:00Z',
      status: 'sent',
      priority: 'normal',
      attachments: ['Financial Report Q4 2023.pdf'],
      read: true
    },
    {
      id: 2,
      sender: 'Hassan Khan',
      recipient: 'Fatima Shah',
      subject: 'Project Update - Mobile App',
      content: 'Hi Fatima, we\'ve completed the UI design for the mobile app. I\'ve attached the design files for your review.',
      date: '2024-01-14T15:45:00Z',
      status: 'sent',
      priority: 'high',
      attachments: ['Mobile App UI Design.zip'],
      read: false
    },
    {
      id: 3,
      sender: 'Omar Malik',
      recipient: 'Admin Team',
      subject: 'Office Maintenance Schedule',
      content: 'Please note that office maintenance is scheduled for this Saturday from 9 AM to 12 PM. Plan your work accordingly.',
      date: '2024-01-13T09:20:00Z',
      status: 'sent',
      priority: 'normal',
      attachments: [],
      read: true
    }
  ]);
  
  const [filteredMessages, setFilteredMessages] = useState(messages);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [isViewMessageModalOpen, setIsViewMessageModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messageFormData, setMessageFormData] = useState({
    recipient: '',
    subject: '',
    content: '',
    priority: 'normal'
  });

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
  ];

  const statuses = [
    { value: 'sent', label: 'Sent', color: 'text-green-600' },
    { value: 'draft', label: 'Draft', color: 'text-yellow-600' },
    { value: 'scheduled', label: 'Scheduled', color: 'text-blue-600' }
  ];

  // Filter messages
  React.useEffect(() => {
    let filtered = messages;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(message =>
        message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.recipient.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(message => message.status === statusFilter);
    }

    setFilteredMessages(filtered);
  }, [messages, searchQuery, statusFilter]);

  const getStatusBadge = (status) => {
    const statusObj = statuses.find(s => s.value === status);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusObj.color}`}>
        {statusObj.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityObj.color}`}>
        {priorityObj.label}
      </span>
    );
  };

  const handleSendMessage = () => {
    const newMessage = {
      id: Math.max(...messages.map(m => m.id)) + 1,
      ...messageFormData,
      sender: 'You',
      date: new Date().toISOString(),
      status: 'sent',
      attachments: [],
      read: false
    };

    setMessages([newMessage, ...messages]);
    setIsComposeModalOpen(false);
    resetMessageForm();
  };

  const handleDeleteMessage = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(messages.filter(message => message.id !== messageId));
    }
  };

  const resetMessageForm = () => {
    setMessageFormData({
      recipient: '',
      subject: '',
      content: '',
      priority: 'normal'
    });
    setSelectedMessage(null);
  };

  const openViewMessageModal = (message) => {
    setSelectedMessage(message);
    setIsViewMessageModalOpen(true);
    
    // Mark as read
    if (!message.read) {
      setMessages(messages.map(m => 
        m.id === message.id ? { ...m, read: true } : m
      ));
    }
  };

  const exportMessages = () => {
    const csvContent = [
      ['Sender', 'Recipient', 'Subject', 'Date', 'Status', 'Priority'],
      ...filteredMessages.map(m => [
        m.sender,
        m.recipient,
        m.subject,
        m.date,
        m.status,
        m.priority
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `communications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const unreadMessages = messages.filter(m => !m.read).length;
  const totalMessages = messages.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage internal messages and notifications
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <AppleButton
            variant="secondary"
            icon={Download}
            onClick={exportMessages}
          >
            Export Messages
          </AppleButton>
          <AppleButton
            variant="primary"
            icon={Send}
            onClick={() => setIsComposeModalOpen(true)}
          >
            Compose
          </AppleButton>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{totalMessages}</p>
            </div>
          </div>
        </AppleCard>

        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Bell className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Unread Messages</p>
              <p className="text-2xl font-bold text-gray-900">{unreadMessages}</p>
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
              <p className="text-sm font-medium text-gray-500">Read Messages</p>
              <p className="text-2xl font-bold text-gray-900">{totalMessages - unreadMessages}</p>
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
                placeholder="Search messages..."
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
        
        {/* Messages List */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <tr key={message.id} className={`hover:bg-gray-50 ${!message.read ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-800 font-medium text-sm">
                            {message.sender.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{message.subject}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{message.content}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{message.recipient}</div>
                    <div className="text-sm text-gray-500">From: {message.sender}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(message.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(message.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPriorityBadge(message.priority)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <AppleButton
                        variant="ghost"
                        size="small"
                        icon={Eye}
                        onClick={() => openViewMessageModal(message)}
                      />
                      <AppleButton
                        variant="ghost"
                        size="small"
                        icon={Trash2}
                        onClick={() => handleDeleteMessage(message.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredMessages.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <MessageCircle className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No messages found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by composing your first message.'
                }
              </p>
            </div>
          )}
        </div>
      </AppleCard>

      {/* Compose Message Modal */}
      {isComposeModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Compose Message</h3>
              <AppleButton
                variant="ghost"
                size="small"
                icon={X}
                onClick={() => setIsComposeModalOpen(false)}
              />
            </div>

            <div className="mb-6">
              <AppleInput
                label="To"
                type="text"
                value={messageFormData.recipient}
                onChange={(e) => setMessageFormData({...messageFormData, recipient: e.target.value})}
                placeholder="Enter recipient(s)"
              />
            </div>

            <div className="mb-6">
              <AppleInput
                label="Subject"
                type="text"
                value={messageFormData.subject}
                onChange={(e) => setMessageFormData({...messageFormData, subject: e.target.value})}
                placeholder="Enter subject"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={messageFormData.content}
                onChange={(e) => setMessageFormData({...messageFormData, content: e.target.value})}
                placeholder="Enter your message"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={messageFormData.priority}
                  onChange={(e) => setMessageFormData({...messageFormData, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <AppleButton
                variant="secondary"
                onClick={() => setIsComposeModalOpen(false)}
              >
                Cancel
              </AppleButton>
              <AppleButton
                variant="primary"
                onClick={handleSendMessage}
              >
                Send Message
              </AppleButton>
            </div>
          </div>
        </div>
      )}

      {/* View Message Modal */}
      {isViewMessageModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Message Details</h3>
              <AppleButton
                variant="ghost"
                size="small"
                icon={X}
                onClick={() => setIsViewMessageModalOpen(false)}
              />
            </div>

            <div className="space-y-6">
              {/* Header */}
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedMessage.subject}</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-800 font-medium text-sm">
                          {selectedMessage.sender.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{selectedMessage.sender}</p>
                      <p className="text-sm text-gray-500">To: {selectedMessage.recipient}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(selectedMessage.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.content}</p>
              </div>

              {/* Message Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Status</h4>
                  <div>{getStatusBadge(selectedMessage.status)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Priority</h4>
                  <div>{getPriorityBadge(selectedMessage.priority)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Date</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedMessage.date).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Attachments */}
              {selectedMessage.attachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMessage.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center px-3 py-1.5 bg-gray-100 rounded-lg">
                        <Paperclip className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">{attachment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <AppleButton
                variant="secondary"
                onClick={() => setIsViewMessageModalOpen(false)}
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

export default Communications;