import { useEffect, useState } from 'react';
import { getMLServerUrl } from '../config/api';

interface AttentionDataPoint {
  time: string;
  percentage: number;
  timestamp: number;
}

interface AttentivenessResponse {
  attentive_percentage: number;
  attentive_count: number;
  total_students: number;
  status: string;
  blink_count: number;
  yawn_count: number;
  head_direction: string;
  mobile_detected: boolean;
  no_movement_frames: number;
  camera_status: string;
  liveness_status: string;
}

export const useLiveAttentiveness = () => {
  const [attentivePercentage, setAttentivePercentage] =
    useState(0);
  const [attentiveCount, setAttentiveCount] =
    useState(0);
  const [totalStudents, setTotalStudents] =
    useState(0);

  const [status, setStatus] = useState('No Face');
  const [blinkCount, setBlinkCount] = useState(0);
  const [yawnCount, setYawnCount] = useState(0);
  const [headDirection, setHeadDirection] =
    useState('Forward');
  const [mobileDetected, setMobileDetected] =
    useState(false);
  const [noMovementFrames, setNoMovementFrames] =
    useState(0);
  const [cameraStatus, setCameraStatus] =
    useState('Offline');
  const [livenessStatus, setLivenessStatus] =
    useState('Unknown');

  const [attentionHistory, setAttentionHistory] =
    useState<AttentionDataPoint[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchAttentiveness = async () => {
      try {
        const url = `${getMLServerUrl(
          '/attentiveness'
        )}?t=${Date.now()}`;

        const response = await fetch(url, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(
            `HTTP error: ${response.status}`
          );
        }

        const data: AttentivenessResponse =
          await response.json();

        if (!isMounted) {
          return;
        }

        const percentage =
          Number(data.attentive_percentage) || 0;

        setAttentivePercentage(percentage);
        setAttentiveCount(
          Number(data.attentive_count) || 0
        );
        setTotalStudents(
          Number(data.total_students) || 0
        );

        setStatus(data.status || 'No Face');
        setBlinkCount(
          Number(data.blink_count) || 0
        );
        setYawnCount(
          Number(data.yawn_count) || 0
        );
        setHeadDirection(
          data.head_direction || 'Forward'
        );
        setMobileDetected(
          Boolean(data.mobile_detected)
        );
        setNoMovementFrames(
          Number(data.no_movement_frames) || 0
        );
        setCameraStatus(
          data.camera_status || 'Offline'
        );
        setLivenessStatus(
          data.liveness_status || 'Unknown'
        );

        const now = new Date();

        setAttentionHistory((previous) => [
          ...previous.slice(-59),
          {
            time: now.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
            percentage,
            timestamp: now.getTime(),
          },
        ]);
      } catch (error) {
        console.error(
          'Failed to fetch live data:',
          error
        );
      }
    };

    fetchAttentiveness();

    const intervalId = window.setInterval(
      fetchAttentiveness,
      1000
    );

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return {
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
  };
};