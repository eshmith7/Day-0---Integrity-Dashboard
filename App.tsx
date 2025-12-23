import React, { useState, useEffect, useMemo } from 'react';
import { Activity, Brain, Flame, Target, Settings, AlertTriangle } from 'lucide-react';
import { UserMetrics, WarModeStatus, IntegrityBreakdown } from './types';
import { IntegrityGauge } from './components/IntegrityGauge';
import { TacticalRadar } from './components/RadarChart';
import { ChatInterface } from './components/ChatInterface';
import { IntelScanner } from './components/IntelScanner';
import { MortalityClock } from './components/MortalityClock';

const App: React.FC = () => {
  // --- STATE ---
  const [metrics, setMetrics] = useState<UserMetrics>({
    deepWorkMinutes: 180, // 3 hours
    sleepScore: 78,
    hrv: 45,
    retentionDays: 12,
    steps: 8500,
    workoutCompleted: true,
  });

  // --- LOGIC ---
  const integrity = useMemo<IntegrityBreakdown>(() => {
    // 40% Deep Work (Goal: 240 mins / 4 hours)
    const deepWorkScore = Math.min(metrics.deepWorkMinutes / 240, 1) * 40;
    
    // 30% Physical (Avg of Sleep & HRV-normalized & Workout)
    // Simple normalization: Sleep is %, HRV target 60+, Workout is binary bonus
    const hrvScore = Math.min(metrics.hrv / 60, 1) * 100;
    const physicalRaw = (metrics.sleepScore + hrvScore + (metrics.workoutCompleted ? 100 : 0)) / 3;
    const physicalContribution = (physicalRaw / 100) * 30;

    // 30% Mental/Retention (Target 30 day streak for max daily score contribution)
    const mentalContribution = Math.min(metrics.retentionDays / 30, 1) * 30;

    const total = deepWorkScore + physicalContribution + mentalContribution;
    
    return {
      score: Math.round(total),
      deepWorkContribution: deepWorkScore,
      physicalContribution: physicalContribution,
      mentalContribution: mentalContribution
    };
  }, [metrics]);

  const warModeStatus = useMemo(() => {
    if (integrity.score < 80) return WarModeStatus.CRITICAL;
    if (integrity.score < 90) return WarModeStatus.COMPROMISED;
    return WarModeStatus.OPTIMAL;
  }, [integrity.score]);

  const isCritical = warModeStatus === WarModeStatus.CRITICAL;

  // Radar Data
  const radarData = [
    { subject: 'Intellect', A: (integrity.deepWorkContribution / 40) * 100, fullMark: 100 },
    { subject: 'Vitality', A: (integrity.physicalContribution / 30) * 100, fullMark: 100 },
    { subject: 'Discipline', A: (integrity.mentalContribution / 30) * 100, fullMark: 100 },
  ];

  // --- HANDLERS (Simulated Inputs) ---
  const adjustMetric = (key: keyof UserMetrics, value: number | boolean) => {
    setMetrics(prev => ({ ...prev, [key]: value }));
  };

  // --- RENDER ---
  return (
    <div className={`min-h-screen font-sans selection:bg-ember selection:text-black transition-colors duration-1000 ${isCritical ? 'bg-black border-[4px] border-alert' : 'bg-onyx'}`}>
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-neutral-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isCritical ? 'bg-alert animate-ping' : 'bg-ember'}`}></div>
          <h1 className="text-xl font-bold font-mono tracking-tighter text-white">INTEGRITY <span className="text-neutral-600">//</span> WAR ROOM</h1>
        </div>
        <div className="flex items-center gap-6 text-xs font-mono text-neutral-500">
          <span>UPSC-2027 PROTOCOL</span>
          <span className={isCritical ? 'text-alert' : 'text-ember'}>{warModeStatus}</span>
        </div>
      </header>

      {/* MAIN DASHBOARD */}
      <main className="pt-24 px-6 pb-12 max-w-[1600px] mx-auto">
        
        {/* CRITICAL ALERT OVERLAY */}
        {isCritical && (
          <div className="mb-8 p-4 bg-red-950/20 border border-red-900/50 rounded flex items-center gap-4 animate-pulse">
            <AlertTriangle className="text-alert w-6 h-6" />
            <div className="text-alert font-mono">
              <span className="font-bold">SYSTEM FAILURE IMMINENT.</span> INTEGRITY BELOW 80%. ENGAGE RECOVERY PROTOCOLS IMMEDIATELY.
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[85vh]">
          
          {/* COL 1: METRICS & CONTROLS (3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-6">
            
            {/* CORE GAUGE */}
            <div className="bg-charcoal border border-neutral-800 rounded-lg p-6 flex flex-col items-center justify-center h-[300px]">
              <h3 className="text-neutral-500 font-mono text-xs mb-4 tracking-widest">DAILY INTEGRITY SCORE</h3>
              <IntegrityGauge score={integrity.score} status={warModeStatus} />
            </div>

            {/* QUICK INPUTS */}
            <div className="flex-1 bg-charcoal border border-neutral-800 rounded-lg p-6 font-mono text-sm overflow-y-auto">
              <h3 className="text-neutral-500 text-xs mb-6 tracking-widest uppercase">Telemetry Log</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="flex justify-between text-neutral-400 mb-2">
                    <span>Deep Work (Min)</span>
                    <span className="text-ember">{metrics.deepWorkMinutes}</span>
                  </label>
                  <input 
                    type="range" min="0" max="480" 
                    value={metrics.deepWorkMinutes} 
                    onChange={(e) => adjustMetric('deepWorkMinutes', parseInt(e.target.value))}
                    className="w-full accent-ember bg-neutral-800 h-1 appearance-none rounded"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-neutral-400 mb-2">
                    <span>Sleep Quality</span>
                    <span className="text-blue-400">{metrics.sleepScore}</span>
                  </label>
                  <input 
                    type="range" min="0" max="100" 
                    value={metrics.sleepScore} 
                    onChange={(e) => adjustMetric('sleepScore', parseInt(e.target.value))}
                    className="w-full accent-blue-500 bg-neutral-800 h-1 appearance-none rounded"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-neutral-400 mb-2">
                    <span>Retention Streak (Days)</span>
                    <span className="text-green-500">{metrics.retentionDays}</span>
                  </label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => adjustMetric('retentionDays', metrics.retentionDays + 1)}
                      className="flex-1 bg-neutral-900 border border-neutral-700 hover:border-green-500 text-white py-2"
                    >
                      +1 DAY
                    </button>
                    <button 
                      onClick={() => adjustMetric('retentionDays', 0)}
                      className="px-3 bg-red-900/20 border border-red-900/50 text-red-500 hover:bg-red-900/40"
                    >
                      RESET
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COL 2: VISUALIZATIONS & GOALS (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* RADAR & CLOCK SPLIT */}
            <div className="grid grid-cols-2 gap-6 h-[300px]">
              <div className="bg-charcoal border border-neutral-800 rounded-lg p-4 flex items-center justify-center">
                <TacticalRadar data={radarData} isCritical={isCritical} />
              </div>
              <MortalityClock />
            </div>

            {/* STRATEGIC OBJECTIVES */}
            <div className={`flex-1 bg-charcoal border border-neutral-800 rounded-lg p-6 transition-opacity ${isCritical ? 'opacity-40 pointer-events-none grayscale' : 'opacity-100'}`}>
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-neutral-500 font-mono text-xs tracking-widest uppercase">Strategic Objectives // Micro-Sprints</h3>
                 <Target className="w-4 h-4 text-ember" />
               </div>
               
               <div className="space-y-3">
                 {[
                   { title: 'Ancient History Syllabus', progress: 85, active: true },
                   { title: 'Ethics (GS-IV) Case Studies', progress: 40, active: true },
                   { title: 'Essay Writing Framework', progress: 12, active: false },
                   { title: 'CSAT Math Foundation', progress: 60, active: true },
                 ].map((goal, idx) => (
                   <div key={idx} className="bg-neutral-900/50 border border-neutral-800 p-3 rounded flex flex-col gap-2">
                     <div className="flex justify-between items-center">
                       <span className={`text-sm font-mono ${goal.active ? 'text-white' : 'text-neutral-600'}`}>{goal.title}</span>
                       <span className="text-xs text-neutral-500">{goal.progress}%</span>
                     </div>
                     <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                       <div className="h-full bg-ember" style={{ width: `${goal.progress}%` }}></div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* COL 3: AI WAR ROOM (4 cols) */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="h-[45%]">
               <ChatInterface metrics={metrics} integrityScore={integrity.score} />
            </div>
            <div className="h-[55%]">
               <IntelScanner />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
