import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Download,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  CreditCard,
  Building2,
  Users,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle,
  Upload,
  Zap,
  Moon,
  Sun,
  Monitor,
  Wifi,
  HardDrive,
  Cloud,
  RefreshCw
} from 'lucide-react';
import { AppleButton, AppleInput, AppleCard } from '../components/ui';

const Settings = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    profile: {
      firstName: user?.name?.split(' ')[0] || 'Admin',
      lastName: user?.name?.split(' ')[1] || 'User',
      email: user?.email || 'admin@ghlboysclub.com',
      phone: '+92 300 1234567',
      position: 'Chief Executive Officer',
      department: 'Executive',
      profileImage: null
    },
    notifications: {
      email: {
        transactions: true,
        reports: true,
        partnerUpdates: false,
        marketing: false,
        security: true
      },
      push: {
        realTime: true,
        dailySummary: true,
        weeklyReports: false
      },
      sms: {
        criticalAlerts: true,
        monthlyStatements: false
      }
    },
    appearance: {
      theme: 'light',
      language: 'en',
      currency: 'PKR',
      dateFormat: 'MM/DD/YYYY',
      numberFormat: 'standard',
      fontSize: 'medium'
    },
    security: {
      twoFactor: false,
      sessionTimeout: '24h',
      loginAlerts: true,
      dataEncryption: true,
      apiAccess: false
    },
    company: {
      name: 'GHL Boys Club',
      address: 'Multan, Punjab, Pakistan',
      phone: '+92 61 1234567',
      email: 'info@ghlboysclub.com',
      website: 'www.ghlboysclub.com',
      taxId: 'TAX123456789'
    },
    integrations: {
      cloudflare: { enabled: true, status: 'connected' },
      stripe: { enabled: false, status: 'disconnected' },
      slack: { enabled: false, status: 'disconnected' },
      gmail: { enabled: true, status: 'connected' }
    }
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User, color: 'text-blue-600' },
    { id: 'notifications', name: 'Notifications', icon: Bell, color: 'text-yellow-600' },
    { id: 'appearance', name: 'Appearance', icon: Palette, color: 'text-purple-600' },
    { id: 'security', name: 'Security', icon: Shield, color: 'text-red-600' },
    { id: 'company', name: 'Company', icon: Building2, color: 'text-green-600' },
    { id: 'integrations', name: 'Integrations', icon: Zap, color: 'text-orange-600' },
    { id: 'data', name: 'Data & Privacy', icon: Database, color: 'text-indigo-600' }
  ];

  const handleSettingsChange = (category, section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [section]: {
          ...prev[category][section],
          [key]: value
        }
      }
    }));
  };

  const handleSimpleChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Settings saved successfully!');
    }, 1500);
  };

  const handleExportData = () => {
    const data = {
      profile: settings.profile,
      preferences: settings.appearance,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'account-data.json';
    a.click();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
          <SettingsIcon className="mr-3 h-8 w-8 text-blue-600" />
          Settings
        </h1>
        <p className="text-gray-600">
          Manage your account preferences and application settings
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-80">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${activeTab === tab.id ? tab.color : 'text-gray-400'}`} />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">Account Active</span>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-3xl">
                          {(settings.profile.firstName || 'U')[0].toUpperCase()}
                        </span>
                      </div>
                      <AppleButton
                        variant="primary"
                        size="small"
                        icon={Upload}
                        className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Profile Photo</h3>
                      <p className="text-gray-600">JPG, GIF or PNG. Max size of 2MB.</p>
                      <AppleButton variant="primary" className="mt-2">
                        Change Photo
                      </AppleButton>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <AppleInput
                          label="First Name"
                          type="text"
                          value={settings.profile.firstName}
                          onChange={(e) => handleSimpleChange('profile', 'firstName', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <AppleInput
                          label="Last Name"
                          type="text"
                          value={settings.profile.lastName}
                          onChange={(e) => handleSimpleChange('profile', 'lastName', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <AppleInput
                          label="Email Address"
                          type="email"
                          value={settings.profile.email}
                          onChange={(e) => handleSimpleChange('profile', 'email', e.target.value)}
                          icon={Mail}
                        />
                      </div>
                      
                      <div>
                        <AppleInput
                          label="Phone Number"
                          type="tel"
                          value={settings.profile.phone}
                          onChange={(e) => handleSimpleChange('profile', 'phone', e.target.value)}
                          icon={Smartphone}
                        />
                      </div>
                      
                      <div>
                        <AppleInput
                          label="Position"
                          type="text"
                          value={settings.profile.position}
                          onChange={(e) => handleSimpleChange('profile', 'position', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                        <select
                          value={settings.profile.department}
                          onChange={(e) => handleSimpleChange('profile', 'department', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Executive">Executive</option>
                          <option value="Finance">Finance</option>
                          <option value="Operations">Operations</option>
                          <option value="Technology">Technology</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Notification Preferences</h2>
                
                <div className="space-y-8">
                  {/* Email Notifications */}
                  <div>
                    <div className="flex items-center mb-6">
                      <Mail className="h-6 w-6 text-blue-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
                    </div>
                    <div className="space-y-4 ml-9">
                      <ToggleSwitch
                        label="Transaction Alerts"
                        description="Get notified when new transactions are recorded"
                        checked={settings.notifications.email.transactions}
                        onChange={(checked) => handleSettingsChange('notifications', 'email', 'transactions', checked)}
                      />
                      <ToggleSwitch
                        label="Financial Reports"
                        description="Receive monthly and quarterly financial reports"
                        checked={settings.notifications.email.reports}
                        onChange={(checked) => handleSettingsChange('notifications', 'email', 'reports', checked)}
                      />
                      <ToggleSwitch
                        label="Partner Updates"
                        description="Notifications about partner activities and changes"
                        checked={settings.notifications.email.partnerUpdates}
                        onChange={(checked) => handleSettingsChange('notifications', 'email', 'partnerUpdates', checked)}
                      />
                      <ToggleSwitch
                        label="Security Alerts"
                        description="Important security notifications and login alerts"
                        checked={settings.notifications.email.security}
                        onChange={(checked) => handleSettingsChange('notifications', 'email', 'security', checked)}
                      />
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div>
                    <div className="flex items-center mb-6">
                      <Bell className="h-6 w-6 text-yellow-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-900">Push Notifications</h3>
                    </div>
                    <div className="space-y-4 ml-9">
                      <ToggleSwitch
                        label="Real-time Updates"
                        description="Instant notifications for important events"
                        checked={settings.notifications.push.realTime}
                        onChange={(checked) => handleSettingsChange('notifications', 'push', 'realTime', checked)}
                      />
                      <ToggleSwitch
                        label="Daily Summary"
                        description="Daily overview of business activities"
                        checked={settings.notifications.push.dailySummary}
                        onChange={(checked) => handleSettingsChange('notifications', 'push', 'dailySummary', checked)}
                      />
                    </div>
                  </div>

                  {/* SMS Notifications */}
                  <div>
                    <div className="flex items-center mb-6">
                      <Smartphone className="h-6 w-6 text-green-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-900">SMS Notifications</h3>
                    </div>
                    <div className="space-y-4 ml-9">
                      <ToggleSwitch
                        label="Critical Alerts"
                        description="Emergency notifications via SMS"
                        checked={settings.notifications.sms.criticalAlerts}
                        onChange={(checked) => handleSettingsChange('notifications', 'sms', 'criticalAlerts', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Appearance Settings</h2>
                
                <div className="space-y-8">
                  {/* Theme Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <ThemeOption
                        name="Light"
                        icon={<Sun className="h-6 w-6" />}
                        selected={settings.appearance.theme === 'light'}
                        onClick={() => handleSimpleChange('appearance', 'theme', 'light')}
                        description="Clean and bright interface"
                      />
                      <ThemeOption
                        name="Dark"
                        icon={<Moon className="h-6 w-6" />}
                        selected={settings.appearance.theme === 'dark'}
                        onClick={() => handleSimpleChange('appearance', 'theme', 'dark')}
                        description="Easy on the eyes"
                      />
                      <ThemeOption
                        name="System"
                        icon={<Monitor className="h-6 w-6" />}
                        selected={settings.appearance.theme === 'system'}
                        onClick={() => handleSimpleChange('appearance', 'theme', 'system')}
                        description="Follow system preference"
                      />
                    </div>
                  </div>

                  {/* Localization */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        value={settings.appearance.language}
                        onChange={(e) => handleSimpleChange('appearance', 'language', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="en">English</option>
                        <option value="ur">Urdu</option>
                        <option value="ar">Arabic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                      <select
                        value={settings.appearance.currency}
                        onChange={(e) => handleSimpleChange('appearance', 'currency', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="PKR">PKR - Pakistani Rupee</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                      <select
                        value={settings.appearance.dateFormat}
                        onChange={(e) => handleSimpleChange('appearance', 'dateFormat', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Security Settings</h2>
                
                <div className="space-y-8">
                  {/* Password Section */}
                  <div className="border-b border-gray-200 pb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Password & Authentication</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <AppleInput
                            label="Current Password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter current password"
                            icon={showPassword ? EyeOff : Eye}
                            onIconClick={() => setShowPassword(!showPassword)}
                          />
                        </div>
                        <div>
                          <AppleInput
                            label="New Password"
                            type="password"
                            placeholder="Enter new password"
                          />
                        </div>
                      </div>
                      <AppleButton variant="primary">
                        Update Password
                      </AppleButton>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="border-b border-gray-200 pb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <ToggleSwitch
                        checked={settings.security.twoFactor}
                        onChange={(checked) => handleSimpleChange('security', 'twoFactor', checked)}
                      />
                    </div>
                    {settings.security.twoFactor && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-green-800 font-medium">Two-factor authentication is enabled</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Security Preferences */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Preferences</h3>
                    <div className="space-y-4">
                      <ToggleSwitch
                        label="Login Alerts"
                        description="Get notified of new login attempts"
                        checked={settings.security.loginAlerts}
                        onChange={(checked) => handleSimpleChange('security', 'loginAlerts', checked)}
                      />
                      <ToggleSwitch
                        label="Data Encryption"
                        description="Encrypt sensitive data at rest"
                        checked={settings.security.dataEncryption}
                        onChange={(checked) => handleSimpleChange('security', 'dataEncryption', checked)}
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout</label>
                        <select
                          value={settings.security.sessionTimeout}
                          onChange={(e) => handleSimpleChange('security', 'sessionTimeout', e.target.value)}
                          className="w-full md:w-1/3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="1h">1 Hour</option>
                          <option value="4h">4 Hours</option>
                          <option value="8h">8 Hours</option>
                          <option value="24h">24 Hours</option>
                          <option value="never">Never</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Company Tab */}
            {activeTab === 'company' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Company Information</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <AppleInput
                        label="Company Name"
                        type="text"
                        value={settings.company.name}
                        onChange={(e) => handleSimpleChange('company', 'name', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <AppleInput
                        label="Tax ID"
                        type="text"
                        value={settings.company.taxId}
                        onChange={(e) => handleSimpleChange('company', 'taxId', e.target.value)}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <AppleInput
                        label="Address"
                        type="textarea"
                        value={settings.company.address}
                        onChange={(e) => handleSimpleChange('company', 'address', e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <AppleInput
                        label="Phone"
                        type="tel"
                        value={settings.company.phone}
                        onChange={(e) => handleSimpleChange('company', 'phone', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <AppleInput
                        label="Email"
                        type="email"
                        value={settings.company.email}
                        onChange={(e) => handleSimpleChange('company', 'email', e.target.value)}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <AppleInput
                        label="Website"
                        type="url"
                        value={settings.company.website}
                        onChange={(e) => handleSimpleChange('company', 'website', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Integrations</h2>
                
                <div className="space-y-6">
                  <IntegrationCard
                    name="Cloudflare"
                    description="Cloud infrastructure and CDN services"
                    icon={<Cloud className="h-8 w-8" />}
                    status={settings.integrations.cloudflare.status}
                    enabled={settings.integrations.cloudflare.enabled}
                    onToggle={(enabled) => handleSettingsChange('integrations', 'cloudflare', 'enabled', enabled)}
                  />
                  
                  <IntegrationCard
                    name="Stripe"
                    description="Payment processing and billing"
                    icon={<CreditCard className="h-8 w-8" />}
                    status={settings.integrations.stripe.status}
                    enabled={settings.integrations.stripe.enabled}
                    onToggle={(enabled) => handleSettingsChange('integrations', 'stripe', 'enabled', enabled)}
                  />
                  
                  <IntegrationCard
                    name="Gmail"
                    description="Email service integration"
                    icon={<Mail className="h-8 w-8" />}
                    status={settings.integrations.gmail.status}
                    enabled={settings.integrations.gmail.enabled}
                    onToggle={(enabled) => handleSettingsChange('integrations', 'gmail', 'enabled', enabled)}
                  />

                  <IntegrationCard
                    name="Slack"
                    description="Team communication and notifications"
                    icon={<Users className="h-8 w-8" />}
                    status={settings.integrations.slack.status}
                    enabled={settings.integrations.slack.enabled}
                    onToggle={(enabled) => handleSettingsChange('integrations', 'slack', 'enabled', enabled)}
                  />
                </div>
              </div>
            )}

            {/* Data & Privacy Tab */}
            {activeTab === 'data' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Data & Privacy</h2>
                
                <div className="space-y-8">
                  {/* Data Export */}
                  <div className="border-b border-gray-200 pb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
                    <p className="text-gray-600 mb-4">
                      Download a copy of all your data including transactions, reports, and settings.
                    </p>
                    <AppleButton
                      variant="primary"
                      icon={Download}
                      onClick={handleExportData}
                    >
                      Export All Data
                    </AppleButton>
                  </div>

                  {/* Data Storage */}
                  <div className="border-b border-gray-200 pb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Storage</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700 font-medium">Documents</span>
                          <span className="text-blue-900 font-bold">245 MB</span>
                        </div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-green-700 font-medium">Reports</span>
                          <span className="text-green-900 font-bold">89 MB</span>
                        </div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-purple-700 font-medium">Backups</span>
                          <span className="text-purple-900 font-bold">512 MB</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div className="border-b border-gray-200 pb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
                    <div className="space-y-4">
                      <ToggleSwitch
                        label="Analytics Tracking"
                        description="Allow us to collect anonymous usage data to improve the service"
                        checked={true}
                        onChange={() => {}}
                      />
                      <ToggleSwitch
                        label="Marketing Communications"
                        description="Receive updates about new features and improvements"
                        checked={false}
                        onChange={() => {}}
                      />
                      <ToggleSwitch
                        label="Data Sharing"
                        description="Share anonymized data with trusted partners for service improvement"
                        checked={false}
                        onChange={() => {}}
                      />
                    </div>
                  </div>

                  {/* Account Deletion */}
                  <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                    <div className="flex items-center mb-4">
                      <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                      <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
                        <p className="text-red-700 text-sm mb-4">
                          Permanently delete your account and all associated data. This action cannot be undone.
                          All transactions, reports, and settings will be permanently removed.
                        </p>
                        <AppleButton
                          variant="danger"
                          icon={Trash2}
                        >
                          Delete Account
                        </AppleButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button Footer */}
            <div className="px-8 py-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  All changes are saved automatically
                </div>
                <div className="flex items-center space-x-3">
                  <AppleButton
                    variant="secondary"
                    onClick={() => setSettings({...settings})}
                  >
                    Reset to Defaults
                  </AppleButton>
                  <AppleButton
                    variant="primary"
                    icon={isLoading ? RefreshCw : Save}
                    onClick={handleSaveSettings}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </AppleButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex-1">
      {label && <h4 className="text-sm font-medium text-gray-900">{label}</h4>}
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

// Theme Option Component
const ThemeOption = ({ name, icon, selected, onClick, description }) => (
  <button
    onClick={onClick}
    className={`p-6 border-2 rounded-xl text-center transition-all hover:shadow-md ${
      selected
        ? 'border-blue-600 bg-blue-50 text-blue-700'
        : 'border-gray-200 hover:border-gray-300 text-gray-700'
    }`}
  >
    <div className="flex flex-col items-center space-y-3">
      <div className={`p-3 rounded-lg ${selected ? 'bg-blue-100' : 'bg-gray-100'}`}>
        {icon}
      </div>
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-xs text-gray-500 mt-1">{description}</div>
      </div>
    </div>
  </button>
);

// Integration Card Component
const IntegrationCard = ({ name, description, icon, status, enabled, onToggle }) => (
  <div className="flex items-center justify-between p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-gray-100 rounded-lg">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">{name}</h4>
        <p className="text-sm text-gray-500">{description}</p>
        <div className="flex items-center mt-2">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            status === 'connected' ? 'bg-green-400' : 'bg-red-400'
          }`}></div>
          <span className={`text-xs font-medium ${
            status === 'connected' ? 'text-green-600' : 'text-red-600'
          }`}>
            {status === 'connected' ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-3">
      {status === 'connected' && (
        <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
          Configure
        </button>
      )}
      <ToggleSwitch
        checked={enabled}
        onChange={onToggle}
      />
    </div>
  </div>
);

export default Settings;