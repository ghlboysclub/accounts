import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  CreditCard,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { AppleButton, AppleCard } from '../components/ui';

const AppleAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);

  // Sample data - replace with your API calls
  const kpiData = [
    {
      title: 'Total Revenue',
      value: '$245,690',
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'emerald',
      period: 'vs last month'
    },
    {
      title: 'Net Profit',
      value: '$89,230',
      change: '+8.7%',
      trend: 'up',
      icon: TrendingUp,
      color: 'blue',
      period: 'vs last month'
    },
    {
      title: 'Active Clients',
      value: '1,847',
      change: '+12.1%',
      trend: 'up',
      icon: Users,
      color: 'purple',
      period: 'vs last month'
    },
    {
      title: 'Avg Transaction',
      value: '$1,325',
      change: '-3.2%',
      trend: 'down',
      icon: CreditCard,
      color: 'orange',
      period: 'vs last month'
    }
  ];

  const revenueByMonth = [
    { month: 'Jan', revenue: 185000, profit: 65000 },
    { month: 'Feb', revenue: 192000, profit: 68000 },
    { month: 'Mar', revenue: 178000, profit: 62000 },
    { month: 'Apr', revenue: 210000, profit: 75000 },
    { month: 'May', revenue: 225000, profit: 82000 },
    { month: 'Jun', revenue: 245690, profit: 89230 }
  ];

  const topClients = [
    { name: 'Apple Inc.', revenue: '$45,230', transactions: 23, growth: '+18%' },
    { name: 'Microsoft Corp.', revenue: '$38,920', transactions: 19, growth: '+12%' },
    { name: 'Google LLC', revenue: '$32,180', transactions: 15, growth: '+25%' },
    { name: 'Amazon Inc.', revenue: '$28,450', transactions: 12, growth: '+8%' },
    { name: 'Tesla Inc.', revenue: '$24,670', transactions: 11, growth: '+31%' }
  ];

  const expenseCategories = [
    { category: 'Operations', amount: '$45,230', percentage: 35, color: 'bg-blue-500' },
    { category: 'Marketing', amount: '$32,180', percentage: 25, color: 'bg-purple-500' },
    { category: 'Salaries', amount: '$38,920', percentage: 30, color: 'bg-emerald-500' },
    { category: 'Technology', amount: '$12,870', percentage: 10, color: 'bg-orange-500' }
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">Financial insights and performance metrics</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Time Range Selector */}
            <div className="flex bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 p-1">
              {['7d', '30d', '90d', '1y'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeRange(period)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    timeRange === period
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {period.toUpperCase()}
                </button>
              ))}
            </div>
            
            {/* Action Buttons */}
            <AppleButton
              onClick={handleRefresh}
              disabled={isLoading}
              variant="secondary"
              icon={RefreshCw}
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </AppleButton>
            
            <AppleButton
              variant="primary"
              icon={Download}
            >
              Export
            </AppleButton>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <AppleCard key={index} hoverable={true}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-${kpi.color}-100`}>
                  <kpi.icon className={`w-6 h-6 text-${kpi.color}-600`} />
                </div>
                <div className={`flex items-center space-x-1 ${kpi.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {kpi.trend === 'up' ?
                    <ArrowUpRight className="w-4 h-4" /> :
                    <ArrowDownLeft className="w-4 h-4" />
                  }
                  <span className="text-sm font-semibold">{kpi.change}</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{kpi.value}</h3>
              <p className="text-gray-600 text-sm">{kpi.title}</p>
              <p className="text-xs text-gray-400 mt-1">{kpi.period}</p>
            </AppleCard>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <AppleCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Revenue & Profit Trends</h3>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Revenue</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-600">Profit</span>
                </div>
              </div>
            </div>
            
            {/* Simulated Chart */}
            <div className="h-64 relative">
              <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
                {revenueByMonth.map((data, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                    <div className="relative w-full max-w-12 flex flex-col items-center space-y-1">
                      {/* Revenue Bar */}
                      <div
                        className="w-6 bg-blue-500 rounded-t-lg transition-all duration-500 hover:bg-blue-600"
                        style={{ height: `${(data.revenue / 250000) * 180}px` }}
                        title={`Revenue: $${data.revenue.toLocaleString()}`}
                      ></div>
                      {/* Profit Bar */}
                      <div
                        className="w-6 bg-emerald-500 rounded-t-lg transition-all duration-500 hover:bg-emerald-600"
                        style={{ height: `${(data.profit / 250000) * 180}px` }}
                        title={`Profit: $${data.profit.toLocaleString()}`}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </AppleCard>

          {/* Top Clients */}
          <AppleCard>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Top Clients</h3>
            <div className="space-y-4">
              {topClients.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{client.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{client.name}</p>
                      <p className="text-sm text-gray-500">{client.transactions} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{client.revenue}</p>
                    <p className="text-sm text-emerald-500">{client.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </AppleCard>
        </div>

        {/* Expense Categories */}
        <AppleCard>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Expense Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {expenseCategories.map((expense, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{expense.category}</span>
                  <span className="text-sm text-gray-600">{expense.percentage}%</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${expense.color} transition-all duration-500 rounded-full`}
                    style={{ width: `${expense.percentage}%` }}
                  ></div>
                </div>
                
                <div className="text-lg font-bold text-gray-900">{expense.amount}</div>
              </div>
            ))}
          </div>
        </AppleCard>
      </div>
    </div>
  );
};

export default AppleAnalyticsDashboard;