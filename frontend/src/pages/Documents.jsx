import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Download, Upload, X, Save, FileText, Calendar, Tag, User, Building, CheckCircle, Clock, XCircle, Folder, File, Image, Archive } from 'lucide-react';
import { AppleButton, AppleInput, AppleCard } from '../components/ui';

const Documents = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Q4 Financial Report.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedBy: 'Ahmad Ali',
      uploadedAt: '2024-01-15T10:30:00Z',
      category: 'Financial',
      tags: ['report', 'q4', 'finance']
    },
    {
      id: 2,
      name: 'Client Contract - TechCorp.docx',
      type: 'docx',
      size: '1.1 MB',
      uploadedBy: 'Hassan Khan',
      uploadedAt: '2024-01-14T15:45:00Z',
      category: 'Contracts',
      tags: ['client', 'contract', 'techcorp']
    },
    {
      id: 3,
      name: 'Office Maintenance Schedule.pdf',
      type: 'pdf',
      size: '0.8 MB',
      uploadedBy: 'Omar Malik',
      uploadedAt: '2024-01-13T09:20:00Z',
      category: 'Operations',
      tags: ['maintenance', 'schedule', 'office']
    },
    {
      id: 4,
      name: 'Team Photos.zip',
      type: 'zip',
      size: '15.2 MB',
      uploadedBy: 'Fatima Shah',
      uploadedAt: '2024-01-12T14:15:00Z',
      category: 'Media',
      tags: ['photos', 'team', 'event']
    },
    {
      id: 5,
      name: 'Project Requirements.pdf',
      type: 'pdf',
      size: '3.7 MB',
      uploadedBy: 'Ahmad Ali',
      uploadedAt: '2024-01-11T11:30:00Z',
      category: 'Projects',
      tags: ['requirements', 'project', 'specification']
    }
  ]);
  
  const [filteredDocuments, setFilteredDocuments] = useState(documents);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentFormData, setDocumentFormData] = useState({
    name: '',
    category: '',
    tags: ''
  });

  const categories = ['Financial', 'Contracts', 'Operations', 'Media', 'Projects', 'Other'];
  const fileTypes = {
    pdf: { icon: FileText, color: 'text-red-600', bg: 'bg-red-100' },
    docx: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    xlsx: { icon: FileText, color: 'text-green-600', bg: 'bg-green-100' },
    jpg: { icon: Image, color: 'text-purple-600', bg: 'bg-purple-100' },
    png: { icon: Image, color: 'text-purple-600', bg: 'bg-purple-100' },
    zip: { icon: Archive, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    default: { icon: File, color: 'text-gray-600', bg: 'bg-gray-100' }
  };

  // Filter documents
  React.useEffect(() => {
    let filtered = documents;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(document =>
        document.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        document.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        document.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(document => document.category === categoryFilter);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchQuery, categoryFilter]);

  const getFileTypeDetails = (type) => {
    return fileTypes[type] || fileTypes.default;
  };

  const formatFileSize = (size) => {
    return size;
  };

  const handleUploadDocument = () => {
    const newDocument = {
      id: Math.max(...documents.map(d => d.id)) + 1,
      ...documentFormData,
      type: documentFormData.name.split('.').pop() || 'default',
      size: '0 MB',
      uploadedBy: 'You',
      uploadedAt: new Date().toISOString(),
      tags: documentFormData.tags ? documentFormData.tags.split(',').map(tag => tag.trim()) : []
    };

    setDocuments([...documents, newDocument]);
    setIsUploadModalOpen(false);
    resetDocumentForm();
  };

  const handleDeleteDocument = (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(document => document.id !== documentId));
    }
  };

  const resetDocumentForm = () => {
    setDocumentFormData({
      name: '',
      category: '',
      tags: ''
    });
    setSelectedDocument(null);
  };

  const openViewModal = (document) => {
    setSelectedDocument(document);
    setIsViewModalOpen(true);
  };

  const exportDocuments = () => {
    const csvContent = [
      ['Name', 'Type', 'Size', 'Uploaded By', 'Uploaded At', 'Category'],
      ...filteredDocuments.map(d => [
        d.name,
        d.type,
        d.size,
        d.uploadedBy,
        d.uploadedAt,
        d.category
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `documents-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalDocuments = documents.length;
  const totalSize = documents.reduce((sum, doc) => {
    const size = parseFloat(doc.size);
    return isNaN(size) ? sum : sum + size;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and organize your business documents
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <AppleButton
            variant="secondary"
            icon={Download}
            onClick={exportDocuments}
          >
            Export List
          </AppleButton>
          <AppleButton
            variant="primary"
            icon={Upload}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload Document
          </AppleButton>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <File className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{totalDocuments}</p>
            </div>
          </div>
        </AppleCard>

        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Folder className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{[...new Set(documents.map(d => d.category))].length}</p>
            </div>
          </div>
        </AppleCard>

        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Archive className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Size</p>
              <p className="text-2xl font-bold text-gray-900">{totalSize.toFixed(1)} MB</p>
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
                placeholder="Search documents..."
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
        
        {/* Documents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
          {filteredDocuments.map((document) => {
            const fileTypeDetails = getFileTypeDetails(document.type);
            const IconComponent = fileTypeDetails.icon;
            
            return (
              <div key={document.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`${fileTypeDetails.bg} p-2 rounded-lg`}>
                      <IconComponent className={`h-6 w-6 ${fileTypeDetails.color}`} />
                    </div>
                    <div className="flex space-x-1">
                      <AppleButton
                        variant="ghost"
                        size="small"
                        icon={Eye}
                        onClick={() => openViewModal(document)}
                      />
                      <AppleButton
                        variant="ghost"
                        size="small"
                        icon={Download}
                        onClick={() => {}}
                      />
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-1 truncate">{document.name}</h3>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span>{document.type.toUpperCase()}</span>
                    <span className="mx-1">•</span>
                    <span>{document.size}</span>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <User className="h-3 w-3 mr-1" />
                    <span>{document.uploadedBy}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {document.category}
                    </span>
                    {document.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {tag}
                      </span>
                    ))}
                    {document.tags.length > 2 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{document.tags.length - 2}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {new Date(document.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <DocumentIcon className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || categoryFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by uploading your first document.'
              }
            </p>
            <div className="mt-6">
              <AppleButton
                variant="primary"
                icon={Upload}
                onClick={() => setIsUploadModalOpen(true)}
              >
                Upload Document
              </AppleButton>
            </div>
          </div>
        )}
      </AppleCard>

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Upload New Document</h3>
              <AppleButton
                variant="ghost"
                size="small"
                icon={X}
                onClick={() => setIsUploadModalOpen(false)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select File
                </label>
                <div className="flex items-center justify-center px-6 py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, XLSX, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <AppleInput
                  label="Document Name"
                  type="text"
                  value={documentFormData.name}
                  onChange={(e) => setDocumentFormData({...documentFormData, name: e.target.value})}
                  placeholder="Enter document name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={documentFormData.category}
                  onChange={(e) => setDocumentFormData({...documentFormData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <AppleInput
                  label="Tags (comma separated)"
                  type="text"
                  value={documentFormData.tags}
                  onChange={(e) => setDocumentFormData({...documentFormData, tags: e.target.value})}
                  placeholder="Enter tags"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <AppleButton
                variant="secondary"
                onClick={() => setIsUploadModalOpen(false)}
              >
                Cancel
              </AppleButton>
              <AppleButton
                variant="primary"
                onClick={handleUploadDocument}
              >
                Upload Document
              </AppleButton>
            </div>
          </div>
        </div>
      )}

      {/* View Document Modal */}
      {isViewModalOpen && selectedDocument && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Document Details</h3>
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
                    <File className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900">{selectedDocument.name}</h2>
                  <p className="text-gray-600">{selectedDocument.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">File Size</p>
                  <p className="font-medium text-gray-900">{selectedDocument.size}</p>
                </div>
              </div>

              {/* Document Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Document Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Type:</span>
                      <span className="text-sm font-medium text-gray-900 uppercase">
                        {selectedDocument.type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Uploaded:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(selectedDocument.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Uploaded By:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedDocument.uploadedBy}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDocument.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Document Preview */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Preview</h4>
                <div className="border border-gray-200 rounded-lg p-8 text-center">
                  <File className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Document preview not available</p>
                  <AppleButton
                    variant="primary"
                    icon={Download}
                    className="mt-4"
                    onClick={() => {}}
                  >
                    Download Document
                  </AppleButton>
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

export default Documents;