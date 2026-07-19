import React from 'react';
import { TrendingUp, Activity } from 'lucide-react';

interface AttentionDataPoint {
  time: string;
  percentage: number;
  timestamp: number;
}

interface LiveAttentionChartProps {
  data: AttentionDataPoint[];
  currentPercentage: number;
}

export const LiveAttentionChart: React.FC<LiveAttentionChartProps> = ({ data, currentPercentage }) => {
  const maxHeight = 120;
  
  const getLineColor = (percentage: number) => {
    if (percentage >= 80) return 'stroke-emerald-400';
    if (percentage >= 60) return 'stroke-yellow-400';
    return 'stroke-red-400';
  };

  // Generate sample data if no data exists to ensure chart always shows
  const chartData = data.length >= 1 ? data : [
    { time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }), percentage: currentPercentage, timestamp: Date.now() }
  ];



  // Generate path here 
  const generatePath = () => {
    if (chartData.length < 1) return '';
    if (chartData.length === 1) {
      // Single point - draw a horizontal line
      return `M 0 ${maxHeight - (chartData[0].percentage / 100) * maxHeight} L 100 ${maxHeight - (chartData[0].percentage / 100) * maxHeight}`;
    }
    
    const stepX = 100 / Math.max(chartData.length - 1, 1);
    
    let path = '';
    chartData.forEach((point, index) => {
      const x = index * stepX;
      const y = maxHeight - (point.percentage / 100) * maxHeight;
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        // Use smooth curves for better visualization
        const prevPoint = chartData[index - 1];
        const prevX = (index - 1) * stepX;
        const prevY = maxHeight - (prevPoint.percentage / 100) * maxHeight;
        
        const cpX1 = prevX + stepX * 0.5;
        const cpY1 = prevY;
        const cpX2 = x - stepX * 0.5;
        const cpY2 = y;
        
        path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x} ${y}`;
      }
    });
    
    return path;
  };





  // Format time for display
  const formatTimeRange = () => {
    if (chartData.length < 1) return { start: '', end: '' };
    
    const start = chartData[0];
    const end = chartData[chartData.length - 1];
    
    return {
      start: start.time,
      end: end.time
    };
  };

  const timeRange = formatTimeRange();


  // Calculate trend
  const getTrend = () => {
    if (chartData.length < 2) return 'stable';
    
    const recent = chartData.slice(-3);
    const avg = recent.reduce((sum, point) => sum + point.percentage, 0) / recent.length;
    
    if (avg > currentPercentage + 5) return 'improving';
    if (avg < currentPercentage - 5) return 'declining';
    return 'stable';
  };

  const trend = getTrend();

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Attention Over Time</h3>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className={`h-5 w-5 ${
            trend === 'improving' ? 'text-emerald-400' :
            trend === 'declining' ? 'text-red-400' : 'text-yellow-400'
          }`} />
          <span className={`text-xs font-medium ${
            trend === 'improving' ? 'text-emerald-400' :
            trend === 'declining' ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {trend.charAt(0).toUpperCase() + trend.slice(1)}
          </span>
        </div>
      </div>
      
      {/* Chart Container */}
      <div className="relative">
        <div className="flex items-start space-x-4">
          {/* Y-axis labels */}
          <div className="flex flex-col justify-between h-32 text-xs text-slate-400 w-10 flex-shrink-0 pt-1">
            <span className="leading-none">100%</span>
            <span className="leading-none">75%</span>
            <span className="leading-none">50%</span>
            <span className="leading-none">25%</span>
            <span className="leading-none">0%</span>
          </div>

          {/* Chart area */}
          <div className="flex-1 h-32 min-w-0">
            <svg width="100%" height="100%" viewBox="0 0 100 120" preserveAspectRatio="none" className="overflow-visible">
            
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="10" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 24" fill="none" stroke="rgb(71 85 105)" strokeWidth="0.5" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Line */}
              <path
                d={generatePath()}
                fill="none"
                strokeWidth="1"
                // className={`stroke-yellow-400 transition-all duration-500`}
                className={`${getLineColor(currentPercentage)} transition-all duration-500`}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              {/* Data points */}
              {/* {chartData.map((point, index) => {
                const stepX = chartData.length === 1 ? 50 : (index * 100) / Math.max(chartData.length - 1, 1);
                const y = maxHeight - (point.percentage / 100) * maxHeight;
                return (
                  <circle
                    key={index}
                    cx={stepX}
                    cy={y}
                    r="1"
                    className={`fill-yellow-400 transition-all duration-500`}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })} */}
            </svg>
          </div>
        </div>
      </div>
      {/* Only minimal time labels */}
      <div className="flex justify-between text-xs text-slate-400 mt-3 ml-14">
        {chartData.length >= 1 && (
          <>
            <span>{timeRange.start}</span>
            <span className="text-blue-400 font-medium">{chartData.length > 1 ? `Now: ${timeRange.end}` : 'Live'}</span>
          </>
        )}
      </div>
      
      {/* Extended time info */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Session Duration: {chartData.length > 0 ? `${chartData.length} min` : '0 min'}</span>
          <span>Data Points: {chartData.length}</span>
        </div>
        
        {/* Current status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-300">Current Status</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              currentPercentage >= 80 ? 'bg-emerald-400' :
              currentPercentage >= 60 ? 'bg-yellow-400' : 'bg-red-400'
            } animate-pulse`}></div>
            <span className={`text-sm font-semibold ${
              currentPercentage >= 80 ? 'text-emerald-400' :
              currentPercentage >= 60 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {currentPercentage >= 80 ? 'High' : currentPercentage >= 60 ? 'Medium' : 'Low'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};