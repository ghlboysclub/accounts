import React from 'react';
import { FileText, Calendar, CreditCard, TrendingUp, PieChart, Banknote, Shield, Users, FileSearch } from 'lucide-react';
import { AppleCard } from '../components/ui';

const Placeholder = ({ pageName, icon: Icon, description }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{pageName}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        </div>
      </div>

      <AppleCard>
        <div className="text-center py-12">
          <div className="mx-auto h-16 w-16 text-gray-400 flex items-center justify-center">
            {Icon && <Icon className="h-16 w-16" />}
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">{pageName}</h3>
          <p className="mt-2 text-sm text-gray-500">
            This page is under development. Please check back later.
          </p>
          <div className="mt-6">
            <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Coming Soon
            </div>
          </div>
        </div>
      </AppleCard>
    </div>
  );
};

export default Placeholder;