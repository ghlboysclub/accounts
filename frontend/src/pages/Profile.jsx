import React from 'react';
import { User, Mail, Phone, Calendar, Shield, Edit } from 'lucide-react';
import { useAuth, useRole } from '../contexts/AuthContext';
import { AppleButton, AppleCard } from '../components/ui';

const Profile = () => {
  const { user } = useAuth();
  const { isAdmin, isPartner } = useRole();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>
        <AppleButton variant="primary" icon={Edit}>
          Edit Profile
        </AppleButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AppleCard>
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Full Name</label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{user?.name || 'N/A'}</span>
                  </div>
                </div>
                <div>
                  <label className="form-label">Email Address</label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{user?.email || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="form-label">Role</label>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-5 w-5 text-gray-400 mr-3" />
                  <span className={`
                    inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    ${isAdmin ? 'bg-red-100 text-red-800' :
                      isPartner ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'}
                  `}>
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </AppleCard>
        </div>

        <div>
          <AppleCard>
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Account Stats</h3>
            </div>
            <div className="card-body space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary-700">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <p className="font-semibold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.role}</p>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member since</span>
                  <span className="font-medium">Jan 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="badge badge-success">Active</span>
                </div>
              </div>
            </div>
          </AppleCard>
        </div>
      </div>
    </div>
  );
};

export default Profile;