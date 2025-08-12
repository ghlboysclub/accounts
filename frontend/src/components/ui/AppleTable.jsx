// frontend/src/components/ui/AppleTable.jsx
import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Filter, 
  Download,
  Edit3,
  Trash2,
  Eye,
  MoreHorizontal
} from 'lucide-react';

const AppleTable = ({ 
  headers = [], 
  data = [], 
  onEdit, 
  onDelete, 
  onView,
  searchable = true,
  sortable = true,
  filterable = false,
  exportable = false,
  pagination = true,
  itemsPerPage = 10,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Filter data based on search
  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data
  const sortedData = sortable && sortField 
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        const multiplier = sortDirection === 'asc' ? 1 : -1;
        
        if (aValue < bValue) return -1 * multiplier;
        if (aValue > bValue) return 1 * multiplier;
        return 0;
      })
    : filteredData;

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = pagination 
    ? sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : sortedData;

  const handleSort = (field) => {
    if (!sortable) return;
    
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-500" />
      : <ChevronDown className="w-4 h-4 text-blue-500" />;
  };

  const ActionDropdown = ({ rowIndex, row }) => {
    const isOpen = activeDropdown === rowIndex;
    
    return (
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveDropdown(isOpen ? null : rowIndex);
          }}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-2xl border border-gray-200 rounded-2xl shadow-xl z-20 overflow-hidden">
            {onView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView(rowIndex, row);
                  setActiveDropdown(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50/50 transition-colors text-gray-700"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
            )}
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(rowIndex, row);
                  setActiveDropdown(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50/50 transition-colors text-blue-600"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(rowIndex, row);
                  setActiveDropdown(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50/50 transition-colors text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white/70 backdrop-blur-2xl rounded-3xl border border-gray-200/50 shadow-sm overflow-hidden ${className}`}>
      {/* Table Header Controls */}
      <div className="p-6 border-b border-gray-200/50 bg-gray-50/30 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Data Table</h3>
          <div className="flex items-center space-x-3">
            {filterable && (
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200">
                <Filter className="w-5 h-5" />
              </button>
            )}
            {exportable && (
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200">
                <Download className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        {searchable && (
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search table data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/60 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
            />
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200/50">
              {headers.map((header, index) => (
                <th 
                  key={index}
                  onClick={() => handleSort(Object.keys(data[0] || {})[index])}
                  className={`text-left py-4 px-6 font-semibold text-gray-700 ${
                    sortable ? 'cursor-pointer hover:bg-gray-50/30 transition-colors select-none' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{header}</span>
                    {sortable && getSortIcon(Object.keys(data[0] || {})[index])}
                  </div>
                </th>
              ))}
              <th className="text-right py-4 px-6 font-semibold text-gray-700 w-20">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/50">
            {paginatedData.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="hover:bg-gray-50/30 transition-colors duration-200 group"
                onClick={() => setActiveDropdown(null)}
              >
                {Object.values(row).map((cell, cellIndex) => (
                  <td key={cellIndex} className="py-4 px-6 text-gray-900 font-medium">
                    {typeof cell === 'string' && cell.startsWith('$') ? (
                      <span className="text-emerald-600 font-bold">{cell}</span>
                    ) : typeof cell === 'string' && cell.includes('@') ? (
                      <span className="text-blue-600">{cell}</span>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
                <td className="py-4 px-6 text-right">
                  <ActionDropdown rowIndex={rowIndex} row={row} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="p-4 border-t border-gray-200/50 bg-gray-50/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
            </p>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    currentPage === index + 1
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-white/50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppleTable;