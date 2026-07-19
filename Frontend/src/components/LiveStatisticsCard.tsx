import React from 'react';
import {
  Activity,
  Camera,
  Eye,
  Move,
  ShieldCheck,
  Smartphone,
  Target,
  Users,
} from 'lucide-react';

interface LiveStatisticsCardProps {
  attentionPercentage: number;
  attentiveStudents: number;
  totalStudents: number;

  status: string;
  blinkCount: number;
  yawnCount: number;
  headDirection: string;
  mobileDetected: boolean;
  noMovementFrames: number;
  cameraStatus: string;
  livenessStatus: string;
}

export const LiveStatisticsCard: React.FC<
  LiveStatisticsCardProps
> = ({
  attentionPercentage,
  attentiveStudents,
  totalStudents,
  status,
  blinkCount,
  yawnCount,
  headDirection,
  mobileDetected,
  noMovementFrames,
  cameraStatus,
  livenessStatus,
}) => {
  const attentionColor =
    attentionPercentage >= 75
      ? 'text-emerald-400'
      : attentionPercentage >= 50
        ? 'text-yellow-400'
        : 'text-red-400';

  return (
    <div className="space-y-6">
      {/* Attentiveness */}
      <div className="bg-blue-950/70 rounded-2xl border border-blue-500/40 p-6">
        <div className="flex items-center gap-3 mb-5">
          <Target className="h-6 w-6 text-blue-400" />

          <h2 className="text-xl font-semibold text-white">
            Attentiveness
          </h2>

          <span className="ml-auto rounded-full bg-red-500/20 border border-red-400/30 px-3 py-1 text-sm text-red-300">
            LIVE
          </span>
        </div>

        <div
          className={`text-center text-5xl font-bold ${attentionColor}`}
        >
          {attentionPercentage}%
        </div>

        <p className="mt-4 text-center text-slate-300">
          Class attention level
        </p>
      </div>

      {/* Students */}
      <div className="bg-slate-800/60 rounded-2xl border border-slate-700/60 p-6">
        <div className="flex items-center gap-3 mb-5">
          <Users className="h-6 w-6 text-blue-400" />

          <h2 className="text-xl font-semibold text-white">
            Students
          </h2>
        </div>

        <div className="text-center text-4xl font-bold">
          <span className="text-emerald-400">
            {attentiveStudents}
          </span>

          <span className="text-slate-400">
            {' '}
            / {totalStudents}
          </span>
        </div>

        <p className="mt-3 text-center text-slate-300">
          Attentive Students
        </p>
      </div>

      {/* Behaviour details */}
      <div className="bg-slate-800/60 rounded-2xl border border-slate-700/60 p-6">
        <div className="flex items-center gap-3 mb-5">
          <Activity className="h-6 w-6 text-blue-400" />

          <h2 className="text-xl font-semibold text-white">
            Behaviour Analysis
          </h2>
        </div>

        <div className="space-y-4">
          <StatRow
            icon={<Activity className="h-5 w-5" />}
            label="Status"
            value={status}
          />

          <StatRow
            icon={<Eye className="h-5 w-5" />}
            label="Blinks"
            value={String(blinkCount)}
          />

          <StatRow
            icon={<Eye className="h-5 w-5" />}
            label="Yawns"
            value={String(yawnCount)}
          />

          <StatRow
            icon={<Move className="h-5 w-5" />}
            label="Head"
            value={headDirection}
          />

          <StatRow
            icon={<Smartphone className="h-5 w-5" />}
            label="Phone"
            value={mobileDetected ? 'Detected' : 'No'}
            danger={mobileDetected}
          />

          <StatRow
            icon={<Move className="h-5 w-5" />}
            label="No Movement"
            value={String(noMovementFrames)}
          />

          <StatRow
            icon={<Camera className="h-5 w-5" />}
            label="Camera"
            value={cameraStatus}
            danger={cameraStatus !== 'Online'}
          />

          <StatRow
            icon={<ShieldCheck className="h-5 w-5" />}
            label="Liveness"
            value={livenessStatus}
            danger={livenessStatus !== 'Passed'}
          />
        </div>
      </div>
    </div>
  );
};

interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  danger?: boolean;
}

const StatRow: React.FC<StatRowProps> = ({
  icon,
  label,
  value,
  danger = false,
}) => {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-900/60 px-4 py-3">
      <div className="flex items-center gap-3 text-slate-300">
        <span className="text-blue-400">{icon}</span>
        <span>{label}</span>
      </div>

      <span
        className={`font-semibold ${
          danger ? 'text-red-400' : 'text-emerald-400'
        }`}
      >
        {value}
      </span>
    </div>
  );
};

export default LiveStatisticsCard;