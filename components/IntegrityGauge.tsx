import React from 'react';
import { WarModeStatus } from '../types';

interface IntegrityGaugeProps {
  score: number;
  status: WarModeStatus;
}

export const IntegrityGauge: React.FC<IntegrityGaugeProps> = ({ score, status }) => {
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (status === WarModeStatus.CRITICAL) return '#ef4444'; // Red
    if (status === WarModeStatus.COMPROMISED) return '#f59e0b'; // Amber
    return '#10b981'; // Green (Emerald) - though we stick to amber/white mostly, slight green for 100% is acceptable or keep amber.
  };

  // Override standard green to fit theme: High integrity = Ember, Low = Red
  const themeColor = status === WarModeStatus.CRITICAL ? '#ef4444' : '#f59e0b';

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="rotate-[-90deg] transition-all duration-500"
      >
        <circle
          stroke="#262626"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={themeColor}
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-bold font-mono text-white tracking-tighter">
          {score}%
        </span>
        <span className={`text-xs uppercase tracking-widest mt-1 ${status === WarModeStatus.CRITICAL ? 'text-alert animate-pulse' : 'text-gray-500'}`}>
          {status}
        </span>
      </div>
    </div>
  );
};
