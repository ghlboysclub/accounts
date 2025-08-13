import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AppleButton, AppleCard } from '../components/ui';
import {
  FileText,
  Download,
  Filter,
  Calendar,
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  Calculator,
  Eye,
  Share2,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const Reports = () => {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState('profit-loss');
  const [dateRange, setDateRange] = useState('thisMonth');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    generateReport();
  }, [selectedReport, dateRange]);

  const generateReport = async () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setReportData(getMockReportData());
      setIsGenerating(false);
    }, 1500);
  };

  const getMockReportData = () => ({
    profitLoss: {
      totalRevenue: 976500,
      totalExpenses: 425300,
      grossProfit: 551200,
      netProfit: 485900,
      profitMargin: 49.8,
      expenses: {
        operational: 285300,
        marketing: 89000,
        technology: 51000
      },
      monthlyData: [
        { month: 'Jan', revenue: 150000, expenses: 65000, profit: 85000 },
        { month: 'Feb', revenue: 185000, expenses: 78000, profit: 107000 },
        { month: 'Mar', revenue: 175000, expenses: 72000, profit: 103000 },
        { month: 'Apr', revenue: 220000, expenses: 95000, profit: 125000 },
        { month: 'May', revenue: 246500, expenses: 115300, profit: 131200 },
      ]
    },
    balanceSheet: {
      assets: {
        cash: 245000,
        accountsReceivable: 125000,
        equipment: 85000,
        total: 455000
      },
      liabilities: {
        accountsPayable: 45000,
        shortTermDebt: 25000,
        total: 70000
      },
      equity: 385000
    },
    cashFlow: {
      operatingActivities: 125000,
      investingActivities: -45000,
      financingActivities: -15000,
      netCashFlow: 65000,
      monthlyFlow: [
        { month: 'Jan', inflow: 150000, outflow: 85000, net: 65000 },
        { month: 'Feb', inflow: 185000, outflow: 95000, net: 90000 },
        { month: 'Mar', inflow: 175000, outflow: 88000, net: 87000 },
        { month: 'Apr', inflow: 220000, outflow: 105000, net: 115000 },
        { month: 'May', inflow: 246500, outflow: 125000, net: 121500 },
      ]
    },
    partnerDistribution: [
      { name: 'Ahmad Ali', amount: 87600, percentage: 18, color: '#3B82F6' },
      { name: 'Hassan Khan', amount: 87600, percentage: 18, color: '#10B981' },
      { name: 'Fatima Shah', amount: 72900, percentage: 15, color: '#F59E0B' },
      { name: 'Omar Malik', amount: 60737, percentage: 12.5, color: '#EF4444' },
      { name: 'Company Reserve', amount: 177057, percentage: 36.5, color: '#8B5CF6' },
    ]
  });

  const reportTypes = [
    {
      id: 'profit-loss',
      name: 'Profit & Loss',
      description: 'Revenue and expense summary',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      id: 'balance-sheet',
      name: 'Balance Sheet',
      description: 'Assets, liabilities, and equity',
      icon: Calculator,
      color: 'bg-blue-500'
    },
    {
      id: 'cash-flow',
      name: 'Cash Flow',
      description: 'Cash inflows and outflows',
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      id: 'partner-distribution',
      name: 'Partner Distribution',
      description: 'Profit sharing breakdown',
      icon: PieChart,
      color: 'bg-orange-500'
    }
  ];

  const dateRanges = [
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'thisQuarter', label: 'This Quarter' },
    { value: 'lastQuarter', label: 'Last Quarter' },
    { value: 'thisYear', label: 'This Year' },
    { value: 'lastYear', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Reports</h1>
            <p className="text-gray-600">Comprehensive business analytics and insights</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <AppleButton
              onClick={generateReport}
              disabled={isGenerating}
              variant="primary"
              icon={RefreshCw}
            >
              {isGenerating ? 'Generating...' : 'Refresh'}
            </AppleButton>
            
            <AppleButton variant="success" icon={Download}>
              Export PDF
            </AppleButton>
            
            <AppleButton variant="secondary" icon={Share2}>
              Share
            </AppleButton>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Report Types Sidebar */}
        <div className="lg:col-span-1">
          <AppleCard>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Types</h3>
            
            <div className="space-y-2 mb-6">
              {reportTypes.map((report) => {
                const Icon = report.icon;
                const isSelected = selectedReport === report.id;
                
                return (
                  <AppleButton
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    variant={isSelected ? "primary" : "ghost"}
                    className={`w-full flex items-center p-3 rounded-lg text-left transition-all ${
                      isSelected
                        ? 'bg-blue-50 border border-blue-200 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className={`${report.color} text-white p-2 rounded-lg mr-3`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-xs text-gray-500">{report.description}</p>
                    </div>
                  </AppleButton>
                );
              })}
            </div>
            
            {/* Date Range Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </AppleCard>
        </div>

        {/* Main Report Content */}
        <div className="lg:col-span-3">
          {isGenerating ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating report...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Report Header */}
              <AppleCard>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {reportTypes.find(r => r.id === selectedReport)?.name}
                    </h2>
                    <p className="text-gray-600">
                      Period: {dateRanges.find(r => r.value === dateRange)?.label}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Generated on</p>
                    <p className="font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </AppleCard>

              {/* Report Content */}
              {selectedReport === 'profit-loss' && <ProfitLossReport data={reportData?.profitLoss} />}
              {selectedReport === 'balance-sheet' && <BalanceSheetReport data={reportData?.balanceSheet} />}
              {selectedReport === 'cash-flow' && <CashFlowReport data={reportData?.cashFlow} />}
              {selectedReport === 'partner-distribution' && <PartnerDistributionReport data={reportData?.partnerDistribution} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Profit & Loss Report Component
const ProfitLossReport = ({ data }) => (
  <div className="space-y-6">
    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <ReportCard
        title="Total Revenue"
        value={`${(data?.totalRevenue / 1000).toFixed(0)}K PKR`}
        change="+12.5%"
        positive={true}
        icon={<DollarSign className="h-5 w-5" />}
        color="bg-green-500"
      />
      <ReportCard
        title="Total Expenses"
        value={`${(data?.totalExpenses / 1000).toFixed(0)}K PKR`}
        change="+8.3%"
        positive={false}
        icon={<Calculator className="h-5 w-5" />}
        color="bg-red-500"
      />
      <ReportCard
        title="Gross Profit"
        value={`${(data?.grossProfit / 1000).toFixed(0)}K PKR`}
        change="+15.2%"
        positive={true}
        icon={<TrendingUp className="h-5 w-5" />}
        color="bg-blue-500"
      />
      <ReportCard
        title="Profit Margin"
        value={`${data?.profitMargin}%`}
        change="+2.1%"
        positive={true}
        icon={<Target className="h-5 w-5" />}
        color="bg-purple-500"
      />
    </div>

    {/* Revenue vs Expenses Chart */}
    <AppleCard>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data?.monthlyData}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip formatter={(value) => [`${(value/1000).toFixed(0)}K PKR`]} />
          <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="url(#colorRevenue)" strokeWidth={2} />
          <Area type="monotone" dataKey="expenses" stroke="#EF4444" fill="url(#colorExpenses)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </AppleCard>

    {/* Expense Breakdown */}
    <AppleCard>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-red-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-red-700 font-medium">Operational</span>
            <span className="text-red-900 font-bold">{(data?.expenses?.operational / 1000).toFixed(0)}K PKR</span>
          </div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-orange-700 font-medium">Marketing</span>
            <span className="text-orange-900 font-bold">{(data?.expenses?.marketing / 1000).toFixed(0)}K PKR</span>
          </div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-purple-700 font-medium">Technology</span>
            <span className="text-purple-900 font-bold">{(data?.expenses?.technology / 1000).toFixed(0)}K PKR</span>
          </div>
        </div>
      </div>
    </AppleCard>
  </div>
);

// Balance Sheet Report Component
const BalanceSheetReport = ({ data }) => (
  <AppleCard>
    <h3 className="text-lg font-semibold text-gray-900 mb-6">Balance Sheet Summary</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Assets */}
      <div className="p-6 bg-green-50 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-4">Assets</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-green-700">Cash</span>
            <span className="font-medium text-green-900">{(data?.assets?.cash / 1000).toFixed(0)}K</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-700">Accounts Receivable</span>
            <span className="font-medium text-green-900">{(data?.assets?.accountsReceivable / 1000).toFixed(0)}K</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-700">Equipment</span>
            <span className="font-medium text-green-900">{(data?.assets?.equipment / 1000).toFixed(0)}K</span>
          </div>
          <div className="border-t border-green-200 pt-3">
            <div className="flex justify-between font-bold">
              <span className="text-green-800">Total Assets</span>
              <span className="text-green-900">{(data?.assets?.total / 1000).toFixed(0)}K PKR</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Liabilities */}
      <div className="p-6 bg-red-50 rounded-lg">
        <h4 className="font-semibold text-red-800 mb-4">Liabilities</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-red-700">Accounts Payable</span>
            <span className="font-medium text-red-900">{(data?.liabilities?.accountsPayable / 1000).toFixed(0)}K</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-700">Short-term Debt</span>
            <span className="font-medium text-red-900">{(data?.liabilities?.shortTermDebt / 1000).toFixed(0)}K</span>
          </div>
          <div className="border-t border-red-200 pt-3">
            <div className="flex justify-between font-bold">
              <span className="text-red-800">Total Liabilities</span>
              <span className="text-red-900">{(data?.liabilities?.total / 1000).toFixed(0)}K PKR</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Equity */}
      <div className="p-6 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-4">Equity</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-blue-700">Owner's Equity</span>
            <span className="font-medium text-blue-900">{(data?.equity / 1000).toFixed(0)}K</span>
          </div>
          <div className="border-t border-blue-200 pt-3">
            <div className="flex justify-between font-bold">
              <span className="text-blue-800">Total Equity</span>
              <span className="text-blue-900">{(data?.equity / 1000).toFixed(0)}K PKR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppleCard>
);

// Cash Flow Report Component
const CashFlowReport = ({ data }) => (
  <div className="space-y-6">
    {/* Cash Flow Summary */}
    <AppleCard>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ReportCard
          title="Operating Activities"
          value={`${(data?.operatingActivities / 1000).toFixed(0)}K PKR`}
          change="+5.2%"
          positive={true}
          icon={<DollarSign className="h-5 w-5" />}
          color="bg-green-500"
        />
        <ReportCard
          title="Investing Activities"
          value={`${(data?.investingActivities / 1000).toFixed(0)}K PKR`}
          change="-2.1%"
          positive={false}
          icon={<TrendingUp className="h-5 w-5" />}
          color="bg-blue-500"
        />
        <ReportCard
          title="Financing Activities"
          value={`${(data?.financingActivities / 1000).toFixed(0)}K PKR`}
          change="-1.5%"
          positive={false}
          icon={<Calculator className="h-5 w-5" />}
          color="bg-orange-500"
        />
        <ReportCard
          title="Net Cash Flow"
          value={`${(data?.netCashFlow / 1000).toFixed(0)}K PKR`}
          change="+8.7%"
          positive={true}
          icon={<Target className="h-5 w-5" />}
          color="bg-purple-500"
        />
      </div>
    </AppleCard>

    {/* Cash Flow Chart */}
    <AppleCard>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Cash Flow</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data?.monthlyFlow}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip formatter={(value) => [`${(value/1000).toFixed(0)}K PKR`]} />
          <Bar dataKey="inflow" fill="#10B981" name="Cash Inflow" />
          <Bar dataKey="outflow" fill="#EF4444" name="Cash Outflow" />
          <Bar dataKey="net" fill="#3B82F6" name="Net Cash Flow" />
        </BarChart>
      </ResponsiveContainer>
    </AppleCard>
  </div>
);

// Partner Distribution Report Component
const PartnerDistributionReport = ({ data }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <AppleCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="amount"
              startAngle={90}
              endAngle={-270}
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${(value/1000).toFixed(0)}K PKR`]} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </AppleCard>

      {/* Partner Details */}
      <AppleCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Partner Details</h3>
        <div className="space-y-4">
          {data?.map((partner, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-3"
                  style={{backgroundColor: partner.color}}
                ></div>
                <div>
                  <p className="font-medium text-gray-900">{partner.name}</p>
                  <p className="text-sm text-gray-500">{partner.percentage}% share</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{(partner.amount/1000).toFixed(0)}K PKR</p>
              </div>
            </div>
          ))}
        </div>
      </AppleCard>
    </div>
  </div>
);

// Report Card Component
const ReportCard = ({ title, value, change, positive, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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
      <span className={`text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </span>
      <span className="text-sm text-gray-500 ml-1">vs last period</span>
    </div>
  </div>
);

export default Reports;