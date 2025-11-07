'use client';

import { useState } from 'react';
import RatingSystem from './RatingSystem';
import CommentSystem from './CommentSystem';
import { 
  StarIcon, 
  ChatBubbleBottomCenterTextIcon 
} from '@heroicons/react/24/outline';

const ToolInteractionPanel = ({ tool, user }) => {
  const [activeTab, setActiveTab] = useState('ratings');

  const tabs = [
    {
      id: 'ratings',
      name: 'Ratings & Reviews',
      icon: StarIcon,
      component: <RatingSystem tool={tool} user={user} />
    },
    {
      id: 'comments',
      name: 'Comments',
      icon: ChatBubbleBottomCenterTextIcon,
      component: <CommentSystem tool={tool} user={user} />
    }
  ];

  return (
    <div className="mt-8">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default ToolInteractionPanel;