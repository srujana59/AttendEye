import React from 'react';
import {
  Activity,
  LogOut,
  User,
} from 'lucide-react';

interface HeaderProps {
  userRole: 'admin';
  userName: string;
  currentPage: 'live-preview';
  onPageChange: (
    page: 'live-preview'
  ) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userRole,
  userName,
  currentPage,
  onPageChange,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-700/50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              onPageChange('live-preview')
            }
            className="flex items-center space-x-3"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity className="h-6 w-6 text-white" />
            </div>

            <div className="text-left">
              <h1 className="text-xl font-bold text-white">
                AttendEye
              </h1>

              <p className="text-xs text-slate-400">
                Live Attention Monitoring
              </p>
            </div>
          </button>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-3 bg-slate-800/70 border border-slate-700/60 rounded-xl px-4 py-2">
              <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-300" />
              </div>

              <div>
                <p className="text-sm font-medium text-white">
                  {userName || 'Admin'}
                </p>

                <p className="text-xs text-slate-400 capitalize">
                  {userRole}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-400/30 text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="h-5 w-5" />

              <span className="hidden sm:inline text-sm font-medium">
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;