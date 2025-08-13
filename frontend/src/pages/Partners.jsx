import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign,
  Search,
  Filter,
  MoreVertical,
  Shield
} from 'lucide-react';
import { apiService, apiUtils } from '../services/api';
import { useRole } from '../contexts/AuthContext';
import LoadingSpinner, { TableSkeleton } from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { AppleButton, AppleInput, AppleCard } from '../components/ui';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAdmin } = useRole();

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API, but don't fail if it doesn't work
      try {
        const response = await apiService.partners.getAll();
        setPartners(response.data.partners || []);
      } catch (apiError) {
        console.warn('API fetch failed, using fallback data:', apiError);
        
        // Use fallback demo data instead of failing
        setPartners([
          {
            id: 1,
            name: 'Ahmad Ali',
            email: 'ahmad.ali@ghlboysclub.com',
            percentage: 18,
            totalEarnings: 175770,
            status: 'active',
            joinedAt: '2024-01-15T00:00:00Z'
          },
          {
            id: 2,
            name: 'Hassan Khan',
            email: 'hassan.khan@ghlboysclub.com',
            percentage: 18,
            totalEarnings: 175770,
            status: 'active',
            joinedAt: '2024-01-15T00:00:00Z'
          },
          {
            id: 3,
            name: 'Fatima Shah',
            email: 'fatima.shah@ghlboysclub.com',
            percentage: 15,
            totalEarnings: 146475,
            status: 'active',
            joinedAt: '2024-02-01T00:00:00Z'
          },
          {
            id: 4,
            name: 'Omar Malik',
            email: 'omar.malik@ghlboysclub.com',
            percentage: 12.5,
            totalEarnings: 122062.5,
            status: 'active',
            joinedAt: '2024-02-15T00:00:00Z'
          }
        ]);
        
        // Show a non-critical toast message
        toast('Using demo partner data', { 
          icon: 'ℹ️',
          duration: 3000 
        });
      }
      
    } catch (error) {
      console.error('Failed to load partners:', error);
      // Don't show error toast that might trigger more issues
    } finally {
      setLoading(false);
    }
  };

  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Admin Access Required</h2>
        <p className="text-gray-600">You need Admin role to manage partners.</p>
      </div>
    );
  }

  if (loading) {
    return <TableSkeleton rows={4} columns={5} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partners</h1>
          <p className="text-gray-600 mt-1">Manage profit sharing partners</p>
        </div>
        <AppleButton variant="primary" icon={Plus}>
          Add Partner
        </AppleButton>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AppleCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Partners</p>
              <p className="text-2xl font-bold text-gray-900">{partners.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </AppleCard>

        <AppleCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Share</p>
              <p className="text-2xl font-bold text-gray-900">
                {partners.reduce((sum, partner) => sum + partner.percentage, 0)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </AppleCard>

        <AppleCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                {apiUtils.formatCurrency(
                  partners.reduce((sum, partner) => sum + partner.totalEarnings, 0),
                  'PKR'
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </AppleCard>
      </div>

      {/* Search and Filter */}
      <AppleCard>
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="relative flex-1 max-w-lg">
              <AppleInput
                type="text"
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
            <AppleButton variant="secondary" icon={Filter}>
              Filter
            </AppleButton>
          </div>
        </div>
      </AppleCard>

      {/* Partners Table */}
      <AppleCard>
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">All Partners</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Partner</th>
                <th>Share %</th>
                <th>Total Earnings</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartners.map((partner) => (
                <tr key={partner.id}>
                  <td>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-semibold text-primary-700">
                          {partner.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {partner.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {partner.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm font-semibold text-gray-900">
                      {partner.percentage}%
                    </span>
                  </td>
                  <td>
                    <span className="text-sm font-semibold text-green-600">
                      {apiUtils.formatCurrency(partner.totalEarnings, 'PKR')}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-success">
                      {partner.status}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm text-gray-600">
                      {apiUtils.formatDate(partner.joinedAt)}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <AppleButton variant="ghost" size="small" icon={Edit} />
                      <AppleButton variant="ghost" size="small" icon={Trash2} />
                      <AppleButton variant="ghost" size="small" icon={MoreVertical} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AppleCard>
    </div>
  );
};

export default Partners;