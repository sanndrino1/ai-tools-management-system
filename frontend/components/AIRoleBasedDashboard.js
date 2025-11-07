'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

// AI-Generated Role-Based Dashboard Configuration
export const getRoleConfig = (roleName) => {
  const configs = {
    owner: {
      welcomeMessage: "Welcome, System Owner! 👑",
      description: "You have full control of the AI Tools Management System",
      primaryColor: "red",
      accentColor: "rose",
      dashboardCards: [
        { title: "System Overview", description: "Monitor all system metrics and health", href: "/admin/system", icon: "📊", color: "red" },
        { title: "User Management", description: "Manage all users and their permissions", href: "/admin/users", icon: "👥", color: "blue" },
        { title: "Global Settings", description: "Configure system-wide settings", href: "/admin/settings", icon: "⚙️", color: "gray" },
        { title: "Security Audit", description: "View security logs and audit trails", href: "/admin/security", icon: "🔐", color: "red" },
        { title: "Analytics & Reports", description: "Generate comprehensive system reports", href: "/admin/analytics", icon: "📈", color: "green" },
        { title: "Backup & Restore", description: "Manage system backups and recovery", href: "/admin/backup", icon: "💾", color: "purple" }
      ],
      widgets: [
        { title: "Total Users", value: "totalUsers", icon: "👥", color: "blue" },
        { title: "Active Tools", value: "activeTools", icon: "🛠️", color: "green" },
        { title: "System Health", value: "100%", icon: "❤️", color: "red" },
        { title: "Storage Used", value: "storageUsed", icon: "💾", color: "purple" }
      ]
    },
    pm: {
      welcomeMessage: "Welcome, Project Manager! 📋",
      description: "Oversee projects and coordinate team activities",
      primaryColor: "blue",
      accentColor: "blue",
      dashboardCards: [
        { title: "Project Overview", description: "Monitor all active projects", href: "/pm/projects", icon: "📋", color: "blue" },
        { title: "Team Management", description: "Manage team members and assignments", href: "/pm/team", icon: "👥", color: "green" },
        { title: "Task Tracking", description: "Track tasks and deadlines", href: "/pm/tasks", icon: "✅", color: "yellow" },
        { title: "Reports & Metrics", description: "View project performance metrics", href: "/pm/reports", icon: "📊", color: "purple" },
        { title: "Resource Allocation", description: "Manage project resources and tools", href: "/pm/resources", icon: "🎯", color: "indigo" },
        { title: "Communication Hub", description: "Team messages and announcements", href: "/pm/communication", icon: "💬", color: "pink" }
      ],
      widgets: [
        { title: "Active Projects", value: "activeProjects", icon: "📋", color: "blue" },
        { title: "Team Members", value: "teamMembers", icon: "👥", color: "green" },
        { title: "Pending Tasks", value: "pendingTasks", icon: "⏰", color: "yellow" },
        { title: "Completed This Week", value: "completedTasks", icon: "✅", color: "green" }
      ]
    },
    backend: {
      welcomeMessage: "Welcome, Backend Developer! ⚙️",
      description: "Build and maintain the server-side architecture",
      primaryColor: "green",
      accentColor: "emerald",
      dashboardCards: [
        { title: "API Endpoints", description: "Manage and test API routes", href: "/dev/api", icon: "🔗", color: "green" },
        { title: "Database Management", description: "Monitor and manage databases", href: "/dev/database", icon: "🗄️", color: "blue" },
        { title: "Server Monitoring", description: "Check server health and performance", href: "/dev/monitoring", icon: "📊", color: "red" },
        { title: "Code Repository", description: "Access backend codebase", href: "/dev/code", icon: "💻", color: "gray" },
        { title: "Error Logs", description: "View and debug system errors", href: "/dev/logs", icon: "🐛", color: "red" },
        { title: "Performance Metrics", description: "Analyze backend performance", href: "/dev/performance", icon: "⚡", color: "yellow" }
      ],
      widgets: [
        { title: "API Calls/Hour", value: "apiCalls", icon: "🔗", color: "green" },
        { title: "Database Size", value: "dbSize", icon: "🗄️", color: "blue" },
        { title: "Server Uptime", value: "99.9%", icon: "⚡", color: "green" },
        { title: "Response Time", value: "responseTime", icon: "⏱️", color: "yellow" }
      ]
    },
    frontend: {
      welcomeMessage: "Welcome, Frontend Developer! 🎨",
      description: "Create beautiful and intuitive user interfaces",
      primaryColor: "purple",
      accentColor: "violet",
      dashboardCards: [
        { title: "Component Library", description: "Browse and manage UI components", href: "/frontend/components", icon: "🧩", color: "purple" },
        { title: "Design System", description: "Access design tokens and guidelines", href: "/frontend/design", icon: "🎨", color: "pink" },
        { title: "User Testing", description: "Review user feedback and analytics", href: "/frontend/testing", icon: "🧪", color: "blue" },
        { title: "Performance", description: "Monitor frontend performance metrics", href: "/frontend/performance", icon: "⚡", color: "yellow" },
        { title: "Accessibility", description: "Check accessibility compliance", href: "/frontend/a11y", icon: "♿", color: "green" },
        { title: "Browser Support", description: "Check cross-browser compatibility", href: "/frontend/browsers", icon: "🌐", color: "indigo" }
      ],
      widgets: [
        { title: "Page Load Time", value: "loadTime", icon: "⚡", color: "yellow" },
        { title: "User Sessions", value: "sessions", icon: "👥", color: "blue" },
        { title: "A11y Score", value: "98%", icon: "♿", color: "green" },
        { title: "Components", value: "componentCount", icon: "🧩", color: "purple" }
      ]
    },
    qa: {
      welcomeMessage: "Welcome, QA Engineer! 🧪",
      description: "Ensure quality and reliability of the system",
      primaryColor: "orange",
      accentColor: "amber",
      dashboardCards: [
        { title: "Test Suites", description: "Manage automated test suites", href: "/qa/tests", icon: "🧪", color: "orange" },
        { title: "Bug Reports", description: "Track and manage bug reports", href: "/qa/bugs", icon: "🐛", color: "red" },
        { title: "Test Coverage", description: "View code coverage reports", href: "/qa/coverage", icon: "📊", color: "green" },
        { title: "Performance Testing", description: "Run performance and load tests", href: "/qa/performance", icon: "⚡", color: "yellow" },
        { title: "Security Testing", description: "Conduct security assessments", href: "/qa/security", icon: "🔐", color: "red" },
        { title: "User Acceptance", description: "Manage UAT processes", href: "/qa/uat", icon: "👥", color: "blue" }
      ],
      widgets: [
        { title: "Test Coverage", value: "coverage", icon: "📊", color: "green" },
        { title: "Open Bugs", value: "openBugs", icon: "🐛", color: "red" },
        { title: "Tests Passed", value: "passedTests", icon: "✅", color: "green" },
        { title: "Tests Failed", value: "failedTests", icon: "❌", color: "red" }
      ]
    },
    designer: {
      welcomeMessage: "Welcome, Designer! 🎨",
      description: "Shape the visual identity and user experience",
      primaryColor: "pink",
      accentColor: "rose",
      dashboardCards: [
        { title: "Design Assets", description: "Manage design files and assets", href: "/design/assets", icon: "🎨", color: "pink" },
        { title: "Style Guide", description: "Maintain design system guidelines", href: "/design/styleguide", icon: "📐", color: "purple" },
        { title: "User Research", description: "Analyze user behavior and feedback", href: "/design/research", icon: "🔍", color: "blue" },
        { title: "Prototypes", description: "Create and test interactive prototypes", href: "/design/prototypes", icon: "🖼️", color: "indigo" },
        { title: "Brand Guidelines", description: "Manage brand identity and assets", href: "/design/brand", icon: "🏷️", color: "red" },
        { title: "Collaboration", description: "Share designs with team members", href: "/design/collaborate", icon: "🤝", color: "green" }
      ],
      widgets: [
        { title: "Design Assets", value: "assetCount", icon: "🎨", color: "pink" },
        { title: "Active Projects", value: "designProjects", icon: "📁", color: "blue" },
        { title: "User Feedback", value: "userFeedback", icon: "💬", color: "green" },
        { title: "Design Reviews", value: "reviewsPending", icon: "👁️", color: "purple" }
      ]
    }
  };

  return configs[roleName] || configs.owner;
};

// AI-Generated Quick Action Component
export const RoleBasedQuickAction = ({ title, description, href, icon, color }) => (
  <a
    href={href}
    className={`block bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-all duration-200 hover:border-${color}-200 group`}
  >
    <div className="flex items-start space-x-4">
      <div className={`p-3 bg-${color}-100 rounded-lg group-hover:bg-${color}-200 transition-colors`}>
        <span className="text-xl">{icon}</span>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </a>
);

// AI-Generated Widget Component
export const RoleDashboardWidget = ({ title, value, icon, color, stats }) => {
  const getStatValue = (valueKey) => {
    if (typeof valueKey === 'string' && stats) {
      switch (valueKey) {
        case 'totalUsers': return stats.users || 0;
        case 'activeTools': return stats.activeTools || 0;
        case 'apiCalls': return '1.2K';
        case 'loadTime': return '1.2s';
        case 'coverage': return '89%';
        case 'openBugs': return '3';
        case 'assetCount': return '156';
        default: return valueKey;
      }
    }
    return value;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600 mt-1`}>
            {getStatValue(value)}
          </p>
        </div>
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

// Main AI-Enhanced Dashboard Component
export const AIRoleBasedDashboard = ({ user, stats, loading }) => {
  const userRole = user?.role?.name || 'owner';
  const config = getRoleConfig(userRole);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI-Enhanced Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {config.welcomeMessage}
          </h1>
          <p className="text-gray-600 mt-2">{config.description}</p>
          <div className={`mt-4 bg-${config.primaryColor}-50 border border-${config.primaryColor}-200 rounded-lg p-4`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className={`text-${config.primaryColor}-600 text-lg`}>👤</span>
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium text-${config.primaryColor}-800`}>
                  Logged in as: {user?.email}
                </p>
                <p className={`text-sm text-${config.primaryColor}-600`}>
                  Role: {user?.role?.display_name || 'No Role'} | User ID: {user?.id}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI-Generated Stats Widgets */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.widgets.map((widget, index) => (
              <RoleDashboardWidget
                key={index}
                title={widget.title}
                value={widget.value}
                icon={widget.icon}
                color={widget.color}
                stats={stats}
              />
            ))}
          </div>
        </div>

        {/* AI-Generated Role-Specific Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.dashboardCards.map((card, index) => (
              <RoleBasedQuickAction
                key={index}
                title={card.title}
                description={card.description}
                href={card.href}
                icon={card.icon}
                color={card.color}
              />
            ))}
          </div>
        </div>

        {/* AI-Generated Role-Specific Tips */}
        <div className="bg-white rounded-lg shadow-md border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              AI Tips for {user?.role?.display_name || 'Your Role'}
            </h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-3">
              {userRole === 'owner' && (
                <>
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-600">💡</span>
                    <p className="text-sm text-gray-700">Monitor system health daily through the analytics dashboard</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600">🚀</span>
                    <p className="text-sm text-gray-700">Regular security audits help maintain system integrity</p>
                  </div>
                </>
              )}
              {userRole === 'pm' && (
                <>
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-600">📋</span>
                    <p className="text-sm text-gray-700">Use project templates to standardize team workflows</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600">📊</span>
                    <p className="text-sm text-gray-700">Weekly team retrospectives improve project delivery</p>
                  </div>
                </>
              )}
              {userRole === 'backend' && (
                <>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600">⚡</span>
                    <p className="text-sm text-gray-700">Optimize database queries for better API performance</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-600">🔒</span>
                    <p className="text-sm text-gray-700">Implement rate limiting to protect API endpoints</p>
                  </div>
                </>
              )}
              {userRole === 'frontend' && (
                <>
                  <div className="flex items-start space-x-3">
                    <span className="text-purple-600">🎨</span>
                    <p className="text-sm text-gray-700">Use design tokens for consistent UI across components</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-600">⚡</span>
                    <p className="text-sm text-gray-700">Implement lazy loading for better performance</p>
                  </div>
                </>
              )}
              {userRole === 'qa' && (
                <>
                  <div className="flex items-start space-x-3">
                    <span className="text-orange-600">🧪</span>
                    <p className="text-sm text-gray-700">Automate regression tests for faster release cycles</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-red-600">🎯</span>
                    <p className="text-sm text-gray-707">Focus on edge cases for robust testing coverage</p>
                  </div>
                </>
              )}
              {userRole === 'designer' && (
                <>
                  <div className="flex items-start space-x-3">
                    <span className="text-pink-600">🎨</span>
                    <p className="text-sm text-gray-700">Maintain a consistent design system across platforms</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-600">👥</span>
                    <p className="text-sm text-gray-700">Conduct user research to validate design decisions</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};