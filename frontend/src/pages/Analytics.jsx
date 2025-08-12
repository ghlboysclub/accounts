import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar, 
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, AreaChart, Area } from 'recharts';

// Sample analytics data - replace with your API data
const sampleRevenueData = [
  { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
  { month: 'Feb', revenue: 52000, expenses: 35000, profit: 17000 },
  { month: 'Mar', revenue: 48000, expenses: 33000, profit: 15000 },
  { month: 'Apr', revenue: 61000, expenses: 38000, profit: 23000 },
  { month: 'May', revenue: 55000, expenses: 36000, profit: 19000 },
  { month: 'Jun', revenue: 67000, expenses: 41000, profit: 26000 },
  { month: 'Jul', revenue: 59000, expenses: 39000, profit: 20000 },
  { month: 'Aug', revenue: 72000, expenses: 44000, profit: 28000 },
  { month: 'Sep', revenue: 68000, expenses: 42000, profit: 26000 },
  { month: 'Oct', revenue: 75000, expenses: 46000, profit: 29000 },
  { month: 'Nov', revenue: 82000, expenses: 49000, profit: 33000 },
  { month: 'Dec', revenue: 89000, expenses: 52000, profit: 37000 }
];

const clientDistributionData = [
  { name: 'TechCorp USA', value: 976500, color: '#3B82F6' },
  { name: 'Digital Solutions Ltd', value: 245000, color: '#10B981' },
  { name: 'StartupXYZ', value: 89000, color: '#F59E0B' },
  { name: 'Others', value: 156000, color: '#EF4444' }
];

const projectTypeData = [
  { type: 'Web Development', count: 15, revenue: 450000 },
  { type: 'Mobile Apps', count: 8, revenue: 320000 },
  { type: 'UI/UX Design', count: 12, revenue: 180000 },
  { type: 'Consulting', count: 6, revenue: 240000 },
  { type: 'Maintenance', count: 20, revenue: 156000 }
];

const teamPerformanceData = [
  { partner: 'Ahmad', projects: 18, revenue: 425000, efficiency: 94 },
  { partner: 'Hassan', projects: 15, revenue: 380000, efficiency: 91 },
  { partner: 'Ali', projects: 12, revenue: 295000, efficiency: 88 },
  { partner: 'Usman', projects: 16, revenue: 366500, efficiency: 92 }
];

const Analytics = () => {
  const [timeFilter, setTimeFilter] = useState('12months');
  const [loading, setLoading] = useState(false);

  // Calculate key metrics
  const metrics = useMemo(() => {
    const totalRevenue = sampleRevenueData.reduce((sum, item) => sum + item.revenue, 0);
    const totalExpenses = sampleRevenueData.reduce((sum, item) => sum + item.expenses, 0);
    const totalProfit = totalRevenue - totalExpenses;
    const avgMonthlyRevenue = totalRevenue / 12;
    const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);
    
    // Calculate growth (comparing last 6 months vs previous 6 months)
    const recentRevenue = sampleRevenueData.slice(-6).reduce((sum, item) => sum + item.revenue, 0);
    const previousRevenue = sampleRevenueData.slice(0, 6).reduce((sum, item) => sum + item.revenue, 0);
    const growthRate = (((recentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1);

    return {
      totalRevenue,
      totalExpenses,
      totalProfit,
      avgMonthlyRevenue,
      profitMargin,
      growthRate: parseFloat(growthRate),
      activeClients: clientDistributionData.length,
      totalProjects: projectTypeData.reduce((sum, item) => sum + item.count, 0)
    };
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const refreshData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Comprehensive insights into your business performance
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
            <option value="2years">Last 2 Years</option>
          </select>
          <button
            onClick={refreshData}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <Download size={16} className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalRevenue)}</p>
              <div className="flex items-center mt-2">
                {metrics.growthRate >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ml-1 ${
                  metrics.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.abs(metrics.growthRate)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalProfit)}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm font-medium text-green-600">{metrics.profitMargin}%</span>
                <span className="text-sm text-gray-500 ml-1">profit margin</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.activeClients}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">
                  {formatCurrency(metrics.avgMonthlyRevenue)} avg/month
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalProjects}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">
                  {(metrics.totalProjects / 12).toFixed(1)} avg/month
                </span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Revenue Trend</h2>
          <p className="text-sm text-gray-500">Monthly revenue, expenses, and profit over time</p>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={sampleRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={(value) => `₨${value/1000}K`} />
              <Tooltip 
                formatter={(value, name) => [formatCurrency(value), name]}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stackId="1"
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.1}
                name="Revenue"
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                stackId="2"
                stroke="#EF4444" 
                fill="#EF4444" 
                fillOpacity={0.1}
                name="Expenses"
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#10B981" 
                strokeWidth={3}
                name="Profit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Revenue Distribution */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Client Revenue Distribution</h2>
            <p className="text-sm text-gray-500">Revenue breakdown by top clients</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={clientDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {clientDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {clientDistributionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Types */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Project Types Performance</h2>
            <p className="text-sm text-gray-500">Revenue and count by project category</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="type" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#6b7280" tickFormatter={(value) => `₨${value/1000}K`} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(value) : value,
                    name === 'revenue' ? 'Revenue' : 'Projects'
                  ]}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Team Performance</h2>
          <p className="text-sm text-gray-500">Individual partner contributions and efficiency metrics</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg per Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficiency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamPerformanceData.map((partner, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {partner.partner.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{partner.partner}</div>
                        <div className="text-sm text-gray-500">Partner</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {partner.projects}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(partner.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(partner.revenue / partner.projects)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${partner.efficiency}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900">{partner.efficiency}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      partner.efficiency >= 90 
                        ? 'bg-green-100 text-green-800' 
                        : partner.efficiency >= 85 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {partner.efficiency >= 90 ? 'Excellent' : partner.efficiency >= 85 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Top Performing Month</p>
              <p className="text-2xl font-bold">December</p>
              <p className="text-blue-100">{formatCurrency(89000)} revenue</p>
            </div>
            <Calendar className="h-12 w-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Best Client</p>
              <p className="text-2xl font-bold">TechCorp USA</p>
              <p className="text-green-100">{formatCurrency(976500)} total value</p>
            </div>
            <Users className="h-12 w-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Growth Rate</p>
              <p className="text-2xl font-bold">+{metrics.growthRate}%</p>
              <p className="text-purple-100">Last 6 months vs previous</p>
            </div>
            <TrendingUp className="h-12 w-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">AI-Powered Insights & Recommendations</h2>
          <p className="text-sm text-gray-500">Based on your performance data and industry trends</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Revenue Optimization</h4>
                  <p className="text-sm text-gray-600">
                    Focus on web development projects - they generate 40% higher revenue per project compared to other services.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Client Retention</h4>
                  <p className="text-sm text-gray-600">
                    TechCorp USA represents 65% of total revenue. Consider diversifying client base to reduce dependency.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Team Optimization</h4>
                  <p className="text-sm text-gray-600">
                    Ahmad shows highest efficiency (94%). Consider having him mentor other team members.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Seasonal Trends</h4>
                  <p className="text-sm text-gray-600">
                    Q4 shows 23% higher revenue. Plan marketing campaigns accordingly for optimal results.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Cost Management</h4>
                  <p className="text-sm text-gray-600">
                    Expenses increased 15% in Q3. Review operational costs and identify optimization opportunities.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Market Expansion</h4>
                  <p className="text-sm text-gray-600">
                    Mobile app development shows untapped potential. Consider expanding service offerings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;