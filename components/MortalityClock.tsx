import React, { useState, useEffect } from 'react';

export const MortalityClock: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [decadeProgress, setDecadeProgress] = useState<number>(0);

  useEffect(() => {
    const targetDate = new Date('2027-05-25T00:00:00'); // Approx UPSC Prelims
    const startOfDecade = new Date('2020-01-01');
    const endOfDecade = new Date('2030-01-01');

    const updateClock = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(`${days}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M ${seconds.toString().padStart(2, '0')}S`);

      // Decade logic (assuming 20s or 30s)
      const totalDecadeTime = endOfDecade.getTime() - startOfDecade.getTime();
      const timePassed = now.getTime() - startOfDecade.getTime();
      setDecadeProgress((timePassed / totalDecadeTime) * 100);
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-center h-full p-6 bg-charcoal border border-neutral-800 rounded-lg">
      <h3 className="text-xs text-neutral-500 font-mono uppercase tracking-widest mb-4">Mortality Clock // UPSC 2027</h3>
      <div className="text-3xl font-mono font-bold text-white mb-2 tracking-tighter">
        {timeLeft}
      </div>
      
      <div className="mt-6">
        <div className="flex justify-between text-[10px] text-neutral-600 font-mono uppercase mb-1">
          <span>Decade Consumed</span>
          <span>{decadeProgress.toFixed(4)}%</span>
        </div>
        <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-600/70" 
            style={{ width: `${decadeProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
