import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Download, Upload, X, Save, Building2, CreditCard, Wallet, TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';
import { AppleButton, AppleInput, AppleCard } from '../components/ui';

const Banking = () => {
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      bank: 'Habib Bank Limited',
      accountNumber: '**** **** **** 1234',
      accountType: 'Current',
      balance: 2500000,
      currency: 'PKR',
      status: 'active',
      lastTransaction: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      bank: 'MCB Bank',
      accountNumber: '**** **** **** 5678',
      accountType: 'Savings',
      balance: 1850000,
      currency: 'PKR',
      status: 'active',
      lastTransaction: '2024-01-14T15:45:00Z'
    },
    {
      id: 3,
      bank: 'UBL',
      accountNumber: '**** **** **** 9012',
      accountType: 'Business',
      balance: 3200000,
      currency: 'PKR',
      status: 'active',
      lastTransaction: '2024-01-15T09:20:00Z'
    }
  ]);
  
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      account: 'Habib Bank Limited',
      date: '2024-01-15',
      description: 'Client Payment - TechCorp USA',
      amount: 125000,
      type: 'credit',
      category: 'Income',
      reference: 'TC-2024-001'
    },
    {
      id: 2,
      account: 'MCB Bank',
      date: '2024-01-14',
      description: 'Office Rent Payment',
      amount: 85000,
      type: 'debit',
      category: 'Expenses',
      reference: 'RENT-2024-01'
    },
    {
      id: 3,
      account: 'UBL',
      date: '2024-01-13',
      description: 'Software License Renewal',
      amount: 45000,
      type: 'debit',
      category: 'Software',
      reference: 'SW-2024-001'
    },
    {
      id: 4,
      account: 'Habib Bank Limited',
      date: '2024-01-12',
      description: 'Partner Distribution - Q4 2023',
      amount: 350000,
      type: 'debit',
      category: 'Distribution',
      reference: 'DIST-2023-Q4'
    }
  ]);
  
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountFilter, setAccountFilter] = useState('all');
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isViewAccountModalOpen, setIsViewAccountModalOpen] = useState(false);
  const [isViewTransactionModalOpen, setIsViewTransactionModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [accountFormData, setAccountFormData] = useState({
    bank: '',
    accountNumber: '',
    accountType: 'Current',
    balance: '',
    currency: 'PKR',
    status: 'active'
  });

  const accountTypes = ['Current', 'Savings', 'Business', 'Fixed Deposit'];
  const statuses = [
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
    { value: 'closed', label: 'Closed', color: 'bg-red-100 text-red-800' }
  ];

  // Filter transactions
  React.useEffect(() => {
    let filtered = transactions;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(transaction =>
        transaction.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by account
    if (accountFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.account === accountFilter);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchQuery, accountFilter]);

  const formatCurrency = (amount, currency = 'PKR') => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusObj = statuses.find(s => s.value === status);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusObj.color}`}>
        {statusObj.label}
      </span>
    );
  };

  const handleAddAccount = () => {
    const newAccount = {
      id: Math.max(...accounts.map(a => a.id)) + 1,
      ...accountFormData,
      balance: parseFloat(accountFormData.balance)
    };

    setAccounts([...accounts, newAccount]);
    setIsAddAccountModalOpen(false);
    resetAccountForm();
  };

  const handleDeleteAccount = (accountId) => {
    if (window.confirm('Are you sure you want to delete this bank account?')) {
      setAccounts(accounts.filter(account => account.id !== accountId));
    }
  };

  const resetAccountForm = () => {
    setAccountFormData({
      bank: '',
      accountNumber: '',
      accountType: 'Current',
      balance: '',
      currency: 'PKR',
      status: 'active'
    });
    setSelectedAccount(null);
  };

  const openViewAccountModal = (account) => {
    setSelectedAccount(account);
    setIsViewAccountModalOpen(true);
  };

  const openViewTransactionModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsViewTransactionModalOpen(true);
  };

  const exportAccounts = () => {
    const csvContent = [
      ['Bank', 'Account Number', 'Account Type', 'Balance', 'Currency', 'Status'],
      ...accounts.map(a => [
        a.bank,
        a.accountNumber,
        a.accountType,
        a.balance,
        a.currency,
        a.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bank-accounts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportTransactions = () => {
    const csvContent = [
      ['Account', 'Date', 'Description', 'Amount', 'Type', 'Category', 'Reference'],
      ...filteredTransactions.map(t => [
        t.account,
        t.date,
        t.description,
        t.amount,
        t.type,
        t.category,
        t.reference
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bank-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const activeAccounts = accounts.filter(a => a.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banking</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage bank accounts and transactions
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <AppleButton
            variant="secondary"
            icon={Download}
            onClick={exportAccounts}
          >
            Export Accounts
          </AppleButton>
          <AppleButton
            variant="primary"
            icon={Plus}
            onClick={() => setIsAddAccountModalOpen(true)}
          >
            Add Account
          </AppleButton>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
            </div>
          </div>
        </AppleCard>

        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Wallet className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Accounts</p>
              <p className="text-2xl font-bold text-gray-900">{activeAccounts}</p>
            </div>
          </div>
        </AppleCard>

        <AppleCard>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Recent Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
            </div>
          </div>
        </AppleCard>
      </div>

      {/* Bank Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <AppleCard key={account.id}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex space-x-2">
                {getStatusBadge(account.status)}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{account.bank}</h3>
            <p className="text-gray-600 text-sm mb-3">{account.accountNumber}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{account.accountType}</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(account.balance, account.currency)}</p>
              </div>
              <div className="flex space-x-2">
                <AppleButton
                  variant="ghost"
                  size="small"
                  icon={Eye}
                  onClick={() => openViewAccountModal(account)}
                />
                <AppleButton
                  variant="ghost"
                  size="small"
                  icon={Trash2}
                  onClick={() => handleDeleteAccount(account.id)}
                />
              </div>
            </div>
          </AppleCard>
        ))}
      </div>

      {/* Transactions Section */}
      <AppleCard>
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <div className="flex space-x-3">
              <AppleButton
                variant="secondary"
                icon={Download}
                onClick={exportTransactions}
              >
                Export Transactions
              </AppleButton>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex-1 max-w-lg">
              <AppleInput
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="flex space-x-3">
              <select
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
              >
                <option value="all">All Accounts</option>
                {[...new Set(transactions.map(t => t.account))].map(account => (
                  <option key={account} value={account}>{account}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">{transaction.account}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{transaction.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.reference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <AppleButton
                      variant="ghost"
                      size="small"
                      icon={Eye}
                      onClick={() => openViewTransactionModal(transaction)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <CreditCard className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || accountFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No transactions have been recorded yet.'
                }
              </p>
            </div>
          )}
        </div>
      </AppleCard>

      {/* Add Account Modal */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Bank Account</h3>
              <AppleButton
                variant="ghost"
                size="small"
                icon={X}
                onClick={() => setIsAddAccountModalOpen(false)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <AppleInput
                  label="Bank Name"
                  type="text"
                  value={accountFormData.bank}
                  onChange={(e) => setAccountFormData({...accountFormData, bank: e.target.value})}
                  placeholder="Enter bank name"
                />
              </div>

              <div>
                <AppleInput
                  label="Account Number"
                  type="text"
                  value={accountFormData.accountNumber}
                  onChange={(e) => setAccountFormData({...accountFormData, accountNumber: e.target.value})}
                  placeholder="Enter account number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <select
                  value={accountFormData.accountType}
                  onChange={(e) => setAccountFormData({...accountFormData, accountType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {accountTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <AppleInput
                  label="Initial Balance (PKR)"
                  type="number"
                  value={accountFormData.balance}
                  onChange={(e) => setAccountFormData({...accountFormData, balance: e.target.value})}
                  placeholder="Enter initial balance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={accountFormData.currency}
                  onChange={(e) => setAccountFormData({...accountFormData, currency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PKR">PKR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={accountFormData.status}
                  onChange={(e) => setAccountFormData({...accountFormData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <AppleButton
                variant="secondary"
                onClick={() => setIsAddAccountModalOpen(false)}
              >
                Cancel
              </AppleButton>
              <AppleButton
                variant="primary"
                onClick={handleAddAccount}
              >
                Add Account
              </AppleButton>
            </div>
          </div>
        </div>
      )}

      {/* View Account Modal */}
      {isViewAccountModalOpen && selectedAccount && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Account Details</h3>
              <AppleButton
                variant="ghost"
                size="small"
                icon={X}
                onClick={() => setIsViewAccountModalOpen(false)}
              />
            </div>

            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedAccount.bank}</h2>
                  <p className="text-gray-600">{selectedAccount.accountNumber}</p>
                  <div className="mt-2">
                    {getStatusBadge(selectedAccount.status)}
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Account Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Account Type:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedAccount.accountType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Currency:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedAccount.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Balance:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(selectedAccount.balance, selectedAccount.currency)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Last Transaction:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(selectedAccount.lastTransaction).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <div>{getStatusBadge(selectedAccount.status)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <AppleButton
                variant="secondary"
                onClick={() => setIsViewAccountModalOpen(false)}
              >
                Close
              </AppleButton>
            </div>
          </div>
        </div>
      )}

      {/* View Transaction Modal */}
      {isViewTransactionModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Transaction Details</h3>
              <AppleButton
                variant="ghost"
                size="small"
                icon={X}
                onClick={() => setIsViewTransactionModalOpen(false)}
              />
            </div>

            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  selectedTransaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {selectedTransaction.type === 'credit' ? (
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedTransaction.description}</h2>
                  <p className={`text-lg font-bold ${
                    selectedTransaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedTransaction.type === 'credit' ? '+' : '-'}{formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Transaction Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Account:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedTransaction.account}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Date:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(selectedTransaction.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Category:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedTransaction.category}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Reference</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Reference ID:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedTransaction.reference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Type:</span>
                      <span className="text-sm font-medium text-gray-900 capitalize">{selectedTransaction.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <AppleButton
                variant="secondary"
                onClick={() => setIsViewTransactionModalOpen(false)}
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

export default Banking;