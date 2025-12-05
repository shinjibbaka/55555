
import React from 'react';
import { FakeHero } from '../types';
import { PixelHeroIcon } from './PixelHeroIcon';

interface Props {
  radiantTeam: FakeHero[];
  direTeam: FakeHero[];
  gameTime: number;
}

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const HeroIcon: React.FC<{ hero: FakeHero, isDire?: boolean }> = ({ hero, isDire }) => (
    <div className={`relative group w-10 h-10 mx-1 border-2 ${isDire ? 'border-[#ff3c28]' : 'border-[#37d63e]'} bg-black`}>
        <div className={`w-full h-full flex items-center justify-center bg-[#15171a] ${hero.isDead ? 'grayscale brightness-50' : ''}`}>
             <div className="w-[80%] h-[80%]">
                 <PixelHeroIcon name={hero.name} />
             </div>
        </div>

        {hero.isDead && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 font-bold text-white text-sm font-pixel-text z-20">
                {Math.ceil(hero.respawnTimer)}
            </div>
        )}
        
        {/* Tooltip */}
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#1b1d21] text-[#ccc] text-xs px-2 py-1 border-2 border-white/20 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none font-pixel-text">
            {hero.nickname}
        </div>
    </div>
);

export const Scoreboard: React.FC<Props> = ({ radiantTeam, direTeam, gameTime }) => {
  const radiantKills = direTeam.filter(h => h.isDead).length + 12; 
  const direKills = radiantTeam.filter(h => h.isDead).length + 8;

  return (
    <div className="h-16 bg-[#15171a] flex items-center justify-center border-b-4 border-[#333] shadow-[0_4px_0_#000] z-40 relative">
        {/* Radiant Side */}
        <div className="flex items-center gap-2">
            <span className="text-[#37d63e] font-pixel-title text-xl drop-shadow-[2px_2px_0_#000]">{radiantKills}</span>
            <div className="flex">
                {radiantTeam.map(h => <HeroIcon key={h.id} hero={h} />)}
            </div>
        </div>

        {/* Clock */}
        <div className="flex items-center justify-center bg-[#0b0c0f] border-2 border-[#444] px-4 py-1 mx-6 min-w-[100px]">
             <span className="text-white font-pixel-text text-2xl tracking-widest">{formatTime(gameTime)}</span>
        </div>

        {/* Dire Side */}
        <div className="flex items-center gap-2">
            <div className="flex flex-row-reverse">
                {direTeam.map(h => <HeroIcon key={h.id} hero={h} isDire />)}
            </div>
            <span className="text-[#ff3c28] font-pixel-title text-xl drop-shadow-[2px_2px_0_#000]">{direKills}</span>
        </div>
    </div>
  );
};
