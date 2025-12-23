import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface RadarData {
  subject: string;
  A: number;
  fullMark: number;
}

interface RadarProps {
  data: RadarData[];
  isCritical: boolean;
}

export const TacticalRadar: React.FC<RadarProps> = ({ data, isCritical }) => {
  const strokeColor = isCritical ? '#ef4444' : '#f59e0b';
  const fillColor = isCritical ? '#ef4444' : '#f59e0b';

  return (
    <div className="w-full h-[200px] text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#262626" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#737373', fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Integrity"
            dataKey="A"
            stroke={strokeColor}
            fill={fillColor}
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
