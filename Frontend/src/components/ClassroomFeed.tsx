import React from 'react';
import { Users } from 'lucide-react';
import { getMLServerUrl } from '../config/api';

export const ClassroomFeed: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex items-center space-x-3 mb-6">
        <Users className="h-6 w-6 text-blue-400" />

        <h2 className="text-xl font-semibold text-white">
          Classroom Live Feed
        </h2>

        <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-1 rounded-full border border-red-400/30">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-red-300">
            LIVE
          </span>
        </div>
      </div>

      <div className="relative w-full aspect-video">
        <img
          src={getMLServerUrl('/video_feed')}
          alt="Live Classroom Feed"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute top-4 left-4 bg-black/70 rounded-xl p-3 backdrop-blur-sm z-10">
          <div className="flex items-center space-x-2 text-white">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />

            <span className="text-sm font-medium">
              AI Analysis Active
            </span>
          </div>

          <div className="text-xs text-gray-300 mt-1">
            Next update in: 1 minute
          </div>
        </div>

        <div className="absolute bottom-4 right-4 bg-black/70 rounded-xl p-2 backdrop-blur-sm z-10">
          <div className="text-xs text-white font-mono">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomFeed;