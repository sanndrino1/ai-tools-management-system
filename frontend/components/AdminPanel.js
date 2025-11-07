'use client';

import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { 
  CogIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { LoadingButton } from './Loading';

const AdminPanel = () => {
  const { showSuccess, showError, showInfo } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('tools');
  const [tools, setTools] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    role: 'all',
    search: ''
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, [activeTab, filters, currentPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'tools') {
        await fetchTools();
      } else if (activeTab === 'users') {
        await fetchUsers();
      } else if (activeTab === 'stats') {
        await fetchStats();
      }
    } catch (error) {
      showError('Error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTools = async () => {
    const params = new URLSearchParams({
      page: currentPage,
      per_page: itemsPerPage,
      ...filters
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/tools?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const data = await response.json();
    if (data.success) {
      setTools(data.data.data);
      setTotalPages(data.data.last_page);
    }
  };

  const fetchUsers = async () => {
    const params = new URLSearchParams({
      page: currentPage,
      per_page: itemsPerPage,
      role: filters.role,
      search: filters.search
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const data = await response.json();
    if (data.success) {
      setUsers(data.data.data);
      setTotalPages(data.data.last_page);
    }
  };

  const fetchStats = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const data = await response.json();
    if (data.success) {
      setStats(data.data);
    }
  };

  const approveTool = async (toolId) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/tools/${toolId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        showSuccess('Tool Approved', 'Tool has been approved successfully');
        fetchTools();
      } else {
        showError('Approval Failed', data.message);
      }
    } catch (error) {
      showError('Error', 'Failed to approve tool');
    } finally {
      setLoading(false);
    }
  };

  const rejectTool = async (toolId, reason = '') => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/tools/${toolId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });
      
      const data = await response.json();
      if (data.success) {
        showSuccess('Tool Rejected', 'Tool has been rejected');
        fetchTools();
      } else {
        showError('Rejection Failed', data.message);
      }
    } catch (error) {
      showError('Error', 'Failed to reject tool');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });
      
      const data = await response.json();
      if (data.success) {
        showSuccess('Role Updated', 'User role has been updated successfully');
        fetchUsers();
      } else {
        showError('Update Failed', data.message);
      }
    } catch (error) {
      showError('Error', 'Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      owner: { color: 'bg-purple-100 text-purple-800', label: 'Owner' },
      project_manager: { color: 'bg-blue-100 text-blue-800', label: 'PM' },
      backend_developer: { color: 'bg-green-100 text-green-800', label: 'Backend' },
      frontend_developer: { color: 'bg-yellow-100 text-yellow-800', label: 'Frontend' },
      qa_tester: { color: 'bg-red-100 text-red-800', label: 'QA' },
      designer: { color: 'bg-pink-100 text-pink-800', label: 'Designer' },
      user: { color: 'bg-gray-100 text-gray-800', label: 'User' }
    };
    
    const config = roleConfig[role] || roleConfig.user;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const tabs = [
    { id: 'tools', label: 'Tools Management', icon: WrenchScrewdriverIcon },
    { id: 'users', label: 'User Management', icon: UsersIcon },
    { id: 'stats', label: 'Statistics', icon: ChartBarIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <CogIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="text-sm text-gray-600">
              AI Tools Management System
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tools Management */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-4 mb-4">
                <FunnelIcon className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="ai-label">Search</label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => setFilters({...filters, search: e.target.value})}
                      placeholder="Search tools..."
                      className="ai-input pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="ai-label">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="ai-input"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <div>
                  <label className="ai-label">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    className="ai-input"
                  >
                    <option value="all">All Categories</option>
                    <option value="ai-assistant">AI Assistant</option>
                    <option value="code-analysis">Code Analysis</option>
                    <option value="data-processing">Data Processing</option>
                    <option value="automation">Automation</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilters({ status: 'all', category: 'all', role: 'all', search: '' });
                      setCurrentPage(1);
                    }}
                    className="ai-btn ai-btn-outline w-full"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Tools List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tool
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {tool.name}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {tool.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{tool.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(tool.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tool.user?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(tool.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => showInfo('Tool Details', JSON.stringify(tool, null, 2))}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            
                            {tool.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => approveTool(tool.id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Approve"
                                >
                                  <CheckCircleIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt('Rejection reason (optional):');
                                    rejectTool(tool.id, reason || '');
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                  title="Reject"
                                >
                                  <XCircleIcon className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="ai-btn ai-btn-outline"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ai-btn ai-btn-outline"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing page <span className="font-medium">{currentPage}</span> of{' '}
                        <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <WrenchScrewdriverIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Tools</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_tools || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_users || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending Approval</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending_tools || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_categories || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;