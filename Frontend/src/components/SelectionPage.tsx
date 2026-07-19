import React from 'react';
import { Eye, ArrowRight, Activity, Video, Users } from 'lucide-react';


// type AppPage = 'live-preview';
type AppPage = 'live-preview';

interface SelectionPageProps {
  onPageSelect: (page: AppPage) => void;
}

export const SelectionPage: React.FC<SelectionPageProps> = ({ onPageSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-sky-500/6 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/4 rounded-full blur-2xl animate-pulse delay-500"></div>
        
    
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/3 via-transparent to-sky-600/3"></div>
        

        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400/20 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-sky-400/20 rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-indigo-400/20 rounded-full animate-pulse delay-1000"></div>
      </div>


      <div className="relative z-10 flex items-center justify-center pt-12 pb-8 animate-fade-in-down">
        <div className="flex items-center space-x-4">
          
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-sky-200 bg-clip-text text-transparent">
              AttendEye
            </h1>
            <p className="text-blue-200/80 font-medium">Choose your workspace</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6">
        <div className="grid grid-cols-1 gap-8 max-w-6xl w-full animate-fade-in-up">
          {/* Live Preview Card */}
          <div 
            onClick={() => onPageSelect('live-preview')}
            className="group relative bg-blue-900/15 backdrop-blur-xl rounded-3xl p-8 border border-blue-700/20 hover:border-blue-500/40 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10"
          >

            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/8 via-sky-500/5 to-indigo-500/8 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-sky-600 p-6 rounded-2xl shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                    <Eye className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-white mb-4 text-center group-hover:text-blue-100 transition-colors duration-300">
                Live Preview
              </h2>

              {/* Description */}
              <p className="text-blue-200/80 text-lg text-center mb-6 leading-relaxed group-hover:text-blue-100/90 transition-colors duration-300">
                Connect to classroom camera
              </p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3 text-blue-200/80 group-hover:text-blue-100/90 transition-colors duration-300">
                  <Video className="h-5 w-5 text-blue-400" />
                  <span>Real-time camera feed</span>
                </div>
                <div className="flex items-center space-x-3 text-blue-200/80 group-hover:text-blue-100/90 transition-colors duration-300">
                  <Activity className="h-5 w-5 text-blue-400" />
                  <span>Live attention tracking</span>
                </div>
              
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-2 text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                  <span className="font-semibold">Start Live Session</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>

            {/* Subtle border */}
            <div className="absolute inset-0 rounded-3xl border border-blue-400/0 group-hover:border-blue-400/20 transition-all duration-300"></div>
          </div>
        </div>

        {/* Bottom hint */}
        <div className="mt-12 text-center animate-fade-in-up delay-300">
          <p className="text-blue-200/60 text-sm">
            Select a workspace to begin monitoring classroom activities
          </p>
        </div>
      </div>


      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
      

      <div className="absolute inset-0 bg-gradient-radial from-transparent via-blue-950/20 to-slate-950/40"></div>
    </div>
  );
};