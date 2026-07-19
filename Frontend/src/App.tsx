import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ClassroomFeed } from './components/ClassroomFeed';
import { LandingPage } from './components/LandingPage';
import { SelectionPage } from './components/SelectionPage';
import { SignInPage } from './components/SignInPage';
import { SignUpPage } from './components/SignUpPage';
import { LiveStatisticsCard } from './components/LiveStatisticsCard';
import { LiveAttentionChart } from './components/LiveAttentionChart';
import { useLiveAttentiveness } from './hooks/useLiveAttentiveness';
import {
  getMe,
  saveClassSession,
} from './api/auth';

type AppPage =
  | 'landing'
  | 'signin'
  | 'signup'
  | 'selection'
  | 'live-preview';

function App() {
  const [userRole, setUserRole] = useState<'admin'>('admin');
  const [userName, setUserName] = useState('');
  const [currentPage, setCurrentPage] =
    useState<AppPage>('landing');
  const [jwt, setJwt] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt');

    if (!token) {
      return;
    }

    setJwt(token);
    setCurrentPage('selection');

    getMe()
      .then((user) => {
        setUserName(user.name || 'Admin');
        setUserRole(user.role || 'admin');
      })
      .catch(() => {
        localStorage.removeItem('jwt');
        setJwt(null);
        setUserName('');
        setCurrentPage('landing');
      });
  }, []);

  const {
    attentivePercentage,
    attentiveCount,
    totalStudents,
    attentionHistory,

    status,
    blinkCount,
    yawnCount,
    headDirection,
    mobileDetected,
    noMovementFrames,
    cameraStatus,
    livenessStatus,
  } = useLiveAttentiveness();

  const handleLogin = () => {
    setCurrentPage('signin');
  };

  const handleAuth = (token: string) => {
    localStorage.setItem('jwt', token);
    setJwt(token);
    setCurrentPage('selection');

    getMe()
      .then((user) => {
        setUserName(user.name || 'Admin');
        setUserRole(user.role || 'admin');
      })
      .catch(() => {
        setUserName('Admin');
        setUserRole('admin');
      });
  };

  const handleNavigateToSignUp = () => {
    setCurrentPage('signup');
  };

  const handleNavigateToSignIn = () => {
    setCurrentPage('signin');
  };

  const handlePageChange = (page: AppPage) => {
    setCurrentPage(page);
  };

  const handleLogout = async () => {
    try {
      if (currentPage === 'live-preview') {
        await saveClassSession(attentivePercentage);
      }
    } catch (error) {
      console.error(
        'Failed to save class session:',
        error
      );
    } finally {
      localStorage.removeItem('jwt');
      setJwt(null);
      setUserName('');
      setUserRole('admin');
      setCurrentPage('landing');
    }
  };

  if (!jwt && currentPage === 'landing') {
    return <LandingPage onLogin={handleLogin} />;
  }

  if (!jwt && currentPage === 'signin') {
    return (
      <SignInPage
        onAuth={handleAuth}
        onNavigateToSignUp={handleNavigateToSignUp}
      />
    );
  }

  if (!jwt && currentPage === 'signup') {
    return (
      <SignUpPage
        onAuth={handleAuth}
        onNavigateToSignIn={handleNavigateToSignIn}
      />
    );
  }

  if (jwt && currentPage === 'selection') {
    return (
      <SelectionPage
        onPageSelect={handlePageChange}
      />
    );
  }

  if (!jwt) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <Header
        userRole={userRole}
        userName={userName}
        currentPage="live-preview"
        onPageChange={(page) =>
          handlePageChange(page)
        }
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'live-preview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              <div className="xl:col-span-3 space-y-8">
                <ClassroomFeed />

                <LiveAttentionChart
                  data={attentionHistory}
                  currentPercentage={attentivePercentage}
                />
              </div>

              <div className="xl:col-span-1">
                <div className="sticky top-8">
                  <LiveStatisticsCard
                    attentionPercentage={attentivePercentage}
                    attentiveStudents={attentiveCount}
                    totalStudents={totalStudents}
                    status={status}
                    blinkCount={blinkCount}
                    yawnCount={yawnCount}
                    headDirection={headDirection}
                    mobileDetected={mobileDetected}
                    noMovementFrames={noMovementFrames}
                    cameraStatus={cameraStatus}
                    livenessStatus={livenessStatus}
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />

                  <span className="text-sm font-medium text-slate-200">
                    Live
                  </span>
                </div>

                <div className="text-sm text-slate-400">
                  Current Status:{' '}
                  <span className="font-semibold text-blue-400">
                    {status}
                  </span>
                </div>

                <div className="text-sm text-slate-400">
                  Class Average:{' '}
                  <span className="font-semibold text-blue-400">
                    {attentivePercentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;