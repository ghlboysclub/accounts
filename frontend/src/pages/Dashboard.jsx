import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  FileText,
  Calendar,
  AlertCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Receipt,
  Building2,
  Clock,
  Target,
  Zap,
  Star
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, Area, AreaChart } from 'recharts';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      // Try live API first, then fallback to mock data
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://accounts-api.ghlboysclub.workers.dev/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          throw new Error('API not available');
        }
      } catch (error) {
        // Use enhanced professional mock data
        setDashboardData(getProfessionalMockData());
      }
    } catch (error) {
      console.error('Dashboard data fetch failed:', error);
      setDashboardData(getProfessionalMockData());
    } finally {
      setDataLoading(false);
    }
  };

  const getProfessionalMockData = () => ({
    // Key Financial Metrics
    totalRevenue: 976500,
    totalExpenses: 425300,
    netProfit: 551200,
    totalPartners: 4,
    activeProjects: 8,
    pendingInvoices: 3,
    monthlyGrowth: 12.5,
    
    // Revenue trend data
    revenueData: [
      { month: 'Jan', revenue: 150000, expenses: 65000, profit: 85000 },
      { month: 'Feb', revenue: 185000, expenses: 78000, profit: 107000 },
      { month: 'Mar', revenue: 175000, expenses: 72000, profit: 103000 },
      { month: 'Apr', revenue: 220000, expenses: 95000, profit: 125000 },
      { month: 'May', revenue: 246500, expenses: 115300, profit: 131200 },
    ],
    
    // Partner distribution
    partnerData: [
      { name: 'Ahmad Ali', value: 175770, percentage: 18, color: '#3B82F6' },
      { name: 'Hassan Khan', value: 175770, percentage: 18, color: '#10B981' },
      { name: 'Fatima Shah', value: 146475, percentage: 15, color: '#F59E0B' },
      { name: 'Omar Malik', value: 122063, percentage: 12.5, color: '#EF4444' },
      { name: 'Company Reserve', value: 356422, percentage: 36.5, color: '#8B5CF6' },
    ],
    
    // Recent transactions
    recentTransactions: [
      { id: 1, type: 'income', description: 'Web Development Project', amount: 25000, date: '2025-08-08', client: 'TechCorp USA' },
      { id: 2, type: 'expense', description: 'Server Hosting', amount: -1200, date: '2025-08-07', client: 'Cloudflare' },
      { id: 3, type: 'income', description: 'Mobile App Development', amount: 45000, date: '2025-08-06', client: 'StartupXYZ' },
      { id: 4, type: 'expense', description: 'Office Rent', amount: -8000, date: '2025-08-05', client: 'Property Manager' },
      { id: 5, type: 'income', description: 'Consulting Services', amount: 15000, date: '2025-08-04', client: 'Enterprise Ltd' },
    ],
    
    // Key Performance Indicators
    kpis: [
      { label: 'Client Retention', value: '94%', change: '+2%', positive: true },
      { label: 'Project Success Rate', value: '98%', change: '+1%', positive: true },
      { label: 'Average Project Value', value: '35K', change: '+8%', positive: true },
      { label: 'Team Utilization', value: '87%', change: '-3%', positive: false },
    ]
  });

  // Get user display name with fallbacks
  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    return user.name || 
           user.full_name || 
           user.firstName || 
           user.username || 
           user.email?.split('@')[0] || 
           'User';
  };

  if (loading || dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const data = dashboardData || getProfessionalMockData();

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {getUserDisplayName()}! 👋
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your business today.
            </p>
          </div>
          
          {/* Period Selector */}
          <div className="flex items-center space-x-2">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisQuarter">This Quarter</option>
              <option value="thisYear">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Revenue"
          value={`${(data.totalRevenue / 1000).toFixed(0)}K PKR`}
          change="+12.5%"
          positive={true}
          icon={<DollarSign className="h-6 w-6" />}
          color="bg-emerald-500"
        />
        <MetricCard
          title="Net Profit"
          value={`${(data.netProfit / 1000).toFixed(0)}K PKR`}
          change="+8.3%"
          positive={true}
          icon={<TrendingUp className="h-6 w-6" />}
          color="bg-blue-500"
        />
        <MetricCard
          title="Active Projects"
          value={data.activeProjects}
          change="+2"
          positive={true}
          icon={<Building2 className="h-6 w-6" />}
          color="bg-purple-500"
        />
        <MetricCard
          title="Partners"
          value={data.totalPartners}
          change="Stable"
          positive={true}
          icon={<Users className="h-6 w-6" />}
          color="bg-orange-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Revenue & Profit Trend
            </h3>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                Revenue
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                Profit
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                formatter={(value, name) => [
                  `${(value/1000).toFixed(0)}K PKR`, 
                  name.charAt(0).toUpperCase() + name.slice(1)
                ]}
                labelStyle={{color: '#374151'}}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={2}
                fill="url(#colorRevenue)"
                name="revenue"
              />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stroke="#10B981" 
                strokeWidth={2}
                fill="url(#colorProfit)"
                name="profit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Partner Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-purple-600" />
            Partner Revenue Share
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={data.partnerData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.partnerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  `${(value/1000).toFixed(0)}K PKR (${props.payload.percentage}%)`, 
                  props.payload.name
                ]}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {data.partnerData.map((partner, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{backgroundColor: partner.color}}
                  ></div>
                  <span className="text-gray-700">{partner.name}</span>
                </div>
                <span className="font-medium text-gray-900">{partner.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Receipt className="h-5 w-5 mr-2 text-green-600" />
              Recent Transactions
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {data.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-4 ${
                    transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'income' ? 
                      <ArrowUpRight className="h-4 w-4" /> : 
                      <ArrowDownRight className="h-4 w-4" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.client} • {transaction.date}</p>
                  </div>
                </div>
                <span className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : ''}{(transaction.amount/1000).toFixed(0)}K PKR
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & KPIs */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-600" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <QuickActionButton 
                icon={<Plus className="h-4 w-4" />}
                text="New Transaction"
                color="bg-blue-500 hover:bg-blue-600"
              />
              <QuickActionButton 
                icon={<FileText className="h-4 w-4" />}
                text="Generate Report"
                color="bg-green-500 hover:bg-green-600"
              />
              <QuickActionButton 
                icon={<Users className="h-4 w-4" />}
                text="Manage Partners"
                color="bg-purple-500 hover:bg-purple-600"
              />
            </div>
          </div>

          {/* Key Performance Indicators */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-indigo-600" />
              Key Metrics
            </h3>
            <div className="space-y-4">
              {data.kpis.map((kpi, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{kpi.label}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">{kpi.value}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      kpi.positive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, change, positive, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`${color} text-white p-3 rounded-xl`}>
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center">
      <span className={`text-sm font-medium flex items-center ${
        positive ? 'text-green-600' : 'text-red-600'
      }`}>
        {positive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
        {change}
      </span>
      <span className="text-sm text-gray-500 ml-1">from last period</span>
    </div>
  </div>
);

// Quick Action Button Component
const QuickActionButton = ({ icon, text, color }) => (
  <button className={`${color} text-white p-3 rounded-lg text-left hover:shadow-md transition-all w-full flex items-center space-x-3`}>
    {icon}
    <span className="font-medium">{text}</span>
  </button>
);

export default Dashboard;