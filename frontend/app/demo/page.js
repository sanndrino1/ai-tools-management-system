'use client';

import { EnhancedCard, StatsCard } from '../../components/EnhancedUI';
import { useToast, ToastContainer } from '../../components/EnhancedToast';

export default function StatsDemo() {
  const { toasts, success, info, removeToast } = useToast();

  const handleStatClick = (statName) => {
    info(`You clicked on ${statName} statistics`, {
      title: 'Stats Info'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Enhanced UI Components Demo</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div onClick={() => handleStatClick('Total Tools')}>
            <StatsCard
              title="Total AI Tools"
              value="24"
              icon={<span className="text-xl">🤖</span>}
              color="blue"
              trend="↗️ +12% this month"
            />
          </div>
          
          <div onClick={() => handleStatClick('Categories')}>
            <StatsCard
              title="Categories"
              value="8"
              icon={<span className="text-xl">📂</span>}
              color="green"
              trend="2 new categories added"
            />
          </div>
          
          <div onClick={() => handleStatClick('Active Users')}>
            <StatsCard
              title="Active Users"
              value="156"
              icon={<span className="text-xl">👥</span>}
              color="purple"
              trend="↗️ +8% this week"
            />
          </div>
          
          <div onClick={() => handleStatClick('Tool Ratings')}>
            <StatsCard
              title="Avg Rating"
              value="4.8"
              icon={<span className="text-xl">⭐</span>}
              color="orange"
              trend="Based on 342 reviews"
            />
          </div>
        </div>

        {/* Demo Buttons */}
        <EnhancedCard className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Toast Notifications Demo</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => success('Operation completed successfully!')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Success Toast
            </button>
            <button
              onClick={() => info('Here\'s some useful information', { title: 'Info' })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Info Toast
            </button>
          </div>
        </EnhancedCard>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EnhancedCard>
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-lg font-semibold mb-2">Enhanced Cards</h3>
              <p className="text-gray-600">Beautiful, responsive card components with hover effects and customizable styling.</p>
            </div>
          </EnhancedCard>
          
          <EnhancedCard>
            <div className="text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-semibold mb-2">Smart Dropdowns</h3>
              <p className="text-gray-600">Accessible dropdown menus with keyboard navigation and clean design.</p>
            </div>
          </EnhancedCard>
          
          <EnhancedCard>
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold mb-2">Interactive Modals</h3>
              <p className="text-gray-600">Professional modal dialogs with animations and focus management.</p>
            </div>
          </EnhancedCard>
        </div>

        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </div>
  );
}