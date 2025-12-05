
import React, { useEffect, useState, useMemo, memo } from 'react';
import { Enemy, FloatingText, HeroState, LogEntry, Illusion, Rune } from '../types';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface Props {
  hero: HeroState;
  enemies: Enemy[];
  illusions?: Illusion[];
  runes?: Rune[]; 
  wave: number;
  texts: FloatingText[];
  combatLog: LogEntry[];
  isShopOpen: boolean;
  toggleAutoProgress: () => void;
  setWaveManually: (dir: 'prev' | 'next') => void;
  pickupRune: (rune: Rune) => void;
  handleManualClick?: (enemyId: string) => void;
}

// --- MEMOIZED PIXEL ASSETS ---
// Wrapping these in memo allows React to skip re-rendering if props don't change, which is crucial for 50+ creep waves.

const PixelHero = memo(({ isAttacking }: { isAttacking: boolean }) => (
    <svg viewBox="0 0 32 32" className="w-full h-full pixel-art overflow-visible drop-shadow-[0_8px_6px_rgba(0,0,0,0.8)]" shapeRendering="crispEdges">
        <defs>
            <linearGradient id="bladeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#faf5ff" />
                <stop offset="40%" stopColor="#d8b4fe" />
                <stop offset="100%" stopColor="#7e22ce" />
            </linearGradient>
            <filter id="purpleGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1" result="blur"/>
                <feFlood floodColor="#a855f7" floodOpacity="0.8" result="color"/>
                <feComposite in="color" in2="blur" operator="in" result="glow"/>
                <feMerge>
                    <feMergeNode in="glow"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <ellipse cx="16" cy="29" rx="8" ry="2" fill="rgba(0,0,0,0.6)" />
        <g>
            <path d="M11,18 h10 v10 h-3 v-6 h-4 v6 h-3 Z" fill="#2e1065" />
            <rect x="13" y="18" width="6" height="4" fill="#4c1d95" />
            <rect x="11" y="24" width="3" height="4" fill="#0f172a" />
            <rect x="18" y="24" width="3" height="4" fill="#0f172a" />
            <path d="M10,9 h12 v9 h-12 Z" fill="#ffedd5" />
            <rect x="11" y="11" width="4" height="3" fill="#fdba74" opacity="0.4" />
            <rect x="17" y="11" width="4" height="3" fill="#fdba74" opacity="0.4" />
            <rect x="14" y="14" width="4" height="4" fill="#fdba74" opacity="0.2" />
            <path d="M11,10 h2 v2 h-2 Z M19,10 h2 v2 h-2 Z" fill="#7e22ce" opacity="0.9" />
            <rect x="15" y="10" width="2" height="8" fill="#7e22ce" opacity="0.7" />
            <rect x="12" y="3" width="8" height="7" fill="#ffedd5" />
            <rect x="12" y="5" width="8" height="2" fill="#0f172a" />
            <rect x="11" y="5" width="1" height="2" fill="#0f172a" />
            <rect x="20" y="5" width="1" height="2" fill="#0f172a" />
            <path d="M14,0 h4 v3 h-4 Z" fill="#f3f4f6" />
            <rect x="7" y="10" width="3" height="7" fill="#ffedd5" />
            <rect x="22" y="10" width="3" height="7" fill="#ffedd5" />
            <rect x="7" y="15" width="3" height="2" fill="#312e81" />
            <rect x="22" y="15" width="3" height="2" fill="#312e81" />
        </g>
        <g className={`origin-[8px_16px] transition-transform duration-75 ${isAttacking ? 'animate-slash-left' : ''}`}>
             <g filter="url(#purpleGlow)">
                <rect x="7" y="14" width="2" height="4" fill="#111" />
                <rect x="8" y="6" width="2" height="2" fill="url(#bladeGradient)" />
                <rect x="6" y="8" width="2" height="2" fill="url(#bladeGradient)" />
                <rect x="5" y="10" width="2" height="3" fill="url(#bladeGradient)" />
                <rect x="4" y="13" width="2" height="6" fill="url(#bladeGradient)" />
                <rect x="5" y="19" width="2" height="3" fill="url(#bladeGradient)" />
                <rect x="6" y="22" width="2" height="2" fill="url(#bladeGradient)" />
                <rect x="8" y="24" width="2" height="2" fill="url(#bladeGradient)" />
                <rect x="9" y="7" width="1" height="1" fill="#fff" />
                <rect x="5" y="14" width="1" height="4" fill="#fff" opacity="0.6" />
                <rect x="9" y="24" width="1" height="1" fill="#fff" />
             </g>
        </g>
        <g className={`origin-[24px_16px] transition-transform duration-75 ${isAttacking ? 'animate-slash-right' : ''}`}>
             <g filter="url(#purpleGlow)">
                <rect x="23" y="14" width="2" height="4" fill="#111" />
                <rect x="22" y="6" width="2" height="2" fill="url(#bladeGradient)" />
                <rect x="24" y="8" width="2" height="2" fill="url(#bladeGradient)" />
                <rect x="25" y="10" width="2" height="3" fill="url(#bladeGradient)" />
                <rect x="26" y="13" width="2" height="6" fill="url(#bladeGradient)" />
                <rect x="25" y="19" width="2" height="3" fill="url(#bladeGradient)" />
                <rect x="24" y="22" width="2" height="2" fill="url(#bladeGradient)" />
                <rect x="22" y="24" width="2" height="2" fill="url(#bladeGradient)" />
                <rect x="22" y="7" width="1" height="1" fill="#fff" />
                <rect x="26" y="14" width="1" height="4" fill="#fff" opacity="0.6" />
                <rect x="22" y="24" width="1" height="1" fill="#fff" />
             </g>
        </g>
    </svg>
));

const PixelCreepMelee = memo(({ isAttacking, color }: { isAttacking: boolean, color: string }) => {
    const isDire = color.includes('red') || color.includes('orange') || color.includes('pink');
    const mainColor = isDire ? '#991b1b' : '#3f6212'; 
    const secColor = isDire ? '#7f1d1d' : '#365314';
    return (
    <svg viewBox="0 0 24 24" className="w-full h-full pixel-art overflow-visible" shapeRendering="crispEdges">
         <ellipse cx="12" cy="22" rx="6" ry="2" fill="rgba(0,0,0,0.6)" />
         <rect x="9" y="11" width="6" height="8" fill={secColor} />
         <rect x="10" y="12" width="4" height="6" fill={mainColor} />
         <rect x="9" y="19" width="2" height="3" fill="#1f2937" />
         <rect x="13" y="19" width="2" height="3" fill="#1f2937" />
         <rect x="9" y="6" width="6" height="5" fill={mainColor} />
         <rect x="9" y="5" width="6" height="1" fill="#1f2937" />
         <rect x="10" y="4" width="4" height="1" fill="#1f2937" />
         <rect x="13" y="7" width="1" height="2" fill="#fca5a5" />
         <path d="M6,10 h3 v6 h-1 v1 h-1 v-1 h-1 v-6 Z" fill="#374151" />
         <rect x="7" y="11" width="1" height="4" fill="#6b7280" />
         <g className={`origin-[16px_14px] ${isAttacking ? 'animate-slash-right' : ''}`}>
             <rect x="15" y="12" width="1" height="3" fill="#9ca3af" />
             <path d="M15,11 h3 v1 h-3 Z" fill="#9ca3af" />
             <path d="M16,5 h2 v6 h-2 Z" fill="#d1d5db" />
         </g>
    </svg>
    );
});

const PixelCreepRanged = memo(({ isAttacking }: { isAttacking: boolean }) => (
    <svg viewBox="0 0 24 24" className="w-full h-full pixel-art overflow-visible" shapeRendering="crispEdges">
         <ellipse cx="12" cy="22" rx="6" ry="2" fill="rgba(0,0,0,0.6)" />
         <path d="M8,10 h8 v10 h-8 Z" fill="#1e3a8a" />
         <rect x="10" y="10" width="4" height="10" fill="#2563eb" />
         <path d="M9,5 h6 v5 h-6 Z" fill="#1d4ed8" />
         <rect x="10" y="6" width="4" height="3" fill="#000" opacity="0.3" />
         <rect x="11" y="7" width="1" height="1" fill="#fbbf24" />
         <rect x="13" y="7" width="1" height="1" fill="#fbbf24" />
         <g className={`origin-[18px_14px] ${isAttacking ? 'animate-pulse' : ''}`}>
            <rect x="17" y="6" width="2" height="14" fill="#78350f" />
            <rect x="16" y="5" width="4" height="3" fill="#22d3ee" opacity="0.8" />
            <rect x="17" y="6" width="2" height="1" fill="#fff" />
         </g>
    </svg>
));

const PixelBoss = memo(({ isAttacking }: { isAttacking: boolean }) => (
    <svg viewBox="0 0 64 64" className="w-full h-full pixel-art overflow-visible drop-shadow-2xl" shapeRendering="crispEdges">
         <ellipse cx="32" cy="58" rx="20" ry="6" fill="rgba(0,0,0,0.6)" />
         <path d="M16,24 h32 v24 h-6 v10 h-8 v-6 h-4 v6 h-8 v-10 h-6 Z" fill="#374151" />
         <path d="M20,28 h24 v16 h-24 Z" fill="#4b5563" />
         <path d="M10,20 h10 v8 h-10 Z" fill="#1f2937" />
         <path d="M44,20 h10 v8 h-10 Z" fill="#1f2937" />
         <path d="M12,16 h4 v4 h-4 Z" fill="#6b7280" />
         <path d="M48,16 h4 v4 h-4 Z" fill="#6b7280" />
         <rect x="24" y="12" width="16" height="12" fill="#111827" />
         <rect x="26" y="16" width="4" height="2" fill="#ef4444" className="animate-pulse" />
         <rect x="34" y="16" width="4" height="2" fill="#ef4444" className="animate-pulse" />
         <rect x="28" y="20" width="8" height="2" fill="#ef4444" opacity="0.5" />
         <g className={`origin-[12px_32px] ${isAttacking ? 'animate-slash-left' : ''}`}>
             <rect x="4" y="28" width="8" height="20" fill="#1f2937" />
             <path d="M4,48 h8 v4 h-2 v4 h-4 v-4 h-2 Z" fill="#000" />
         </g>
         <g className={`origin-[52px_32px] ${isAttacking ? 'animate-slash-right' : ''}`}>
             <rect x="52" y="28" width="8" height="20" fill="#1f2937" />
             <path d="M52,48 h8 v4 h-2 v4 h-4 v-4 h-2 Z" fill="#000" />
         </g>
    </svg>
));

const PixelCourier = memo(() => (
    <svg viewBox="0 0 32 32" className="w-full h-full pixel-art overflow-visible drop-shadow-2xl" shapeRendering="crispEdges">
        <ellipse cx="16" cy="28" rx="8" ry="3" fill="rgba(0,0,0,0.5)" />
        <rect x="10" y="12" width="12" height="10" fill="#a16207" />
        <rect x="12" y="14" width="8" height="6" fill="#ca8a04" opacity="0.5" />
        <rect x="10" y="22" width="2" height="6" fill="#713f12" />
        <rect x="12" y="22" width="2" height="6" fill="#713f12" />
        <rect x="18" y="22" width="2" height="6" fill="#713f12" />
        <rect x="20" y="22" width="2" height="6" fill="#713f12" />
        <rect x="6" y="8" width="6" height="8" fill="#a16207" />
        <rect x="6" y="6" width="2" height="2" fill="#713f12" />
        <rect x="10" y="6" width="2" height="2" fill="#713f12" />
        <rect x="7" y="10" width="1" height="1" fill="#000" />
        <rect x="6" y="12" width="2" height="2" fill="#451a03" />
        <rect x="14" y="10" width="6" height="6" fill="#facc15" />
        <rect x="14" y="11" width="1" height="4" fill="#fef08a" />
        <rect x="20" y="14" width="4" height="4" fill="#facc15" />
        <path d="M16,12 L24,6 L22,12 Z" fill="#fff" opacity="0.8" className="animate-pulse" />
    </svg>
));

const PixelTree = memo(() => (
    <svg viewBox="0 0 32 32" className="w-full h-full pixel-art drop-shadow-xl" shapeRendering="crispEdges">
        <ellipse cx="16" cy="28" rx="8" ry="3" fill="#111" opacity="0.5" />
        <rect x="14" y="20" width="4" height="8" fill="#3e2723" />
        <rect x="13" y="26" width="6" height="2" fill="#3e2723" />
        <rect x="6" y="18" width="20" height="4" fill="#14532d" />
        <rect x="4" y="20" width="24" height="2" fill="#14532d" />
        <rect x="8" y="14" width="16" height="4" fill="#166534" />
        <rect x="6" y="16" width="20" height="2" fill="#166534" />
        <rect x="10" y="10" width="12" height="4" fill="#15803d" />
        <rect x="8" y="12" width="16" height="2" fill="#15803d" />
        <rect x="12" y="6" width="8" height="4" fill="#22c55e" opacity="0.8" />
        <rect x="14" y="4" width="4" height="2" fill="#22c55e" opacity="0.6" />
    </svg>
));

const PixelRock = memo(() => (
    <svg viewBox="0 0 16 16" className="w-full h-full pixel-art opacity-60" shapeRendering="crispEdges">
        <rect x="4" y="10" width="8" height="4" fill="#525252" />
        <rect x="6" y="8" width="4" height="2" fill="#737373" />
        <rect x="3" y="12" width="10" height="2" fill="#262626" />
    </svg>
));

interface PixelProjectileProps { type: string; start: { x: number; y: number }; end: { x: number; y: number }; progress: number; }
const PixelProjectile: React.FC<PixelProjectileProps> = memo(({ type, start, end, progress }) => {
    const curX = start.x + (end.x - start.x) * progress;
    const curY = start.y + (end.y - start.y) * progress;
    const angle = Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI);
    return (
        <div style={{ left: `${curX}%`, top: `${curY}%`, transform: `translate(-50%, -50%) rotate(${angle}deg)` }} className="absolute w-6 h-6 z-40 pointer-events-none pixel-art">
            <svg viewBox="0 0 8 8" className="w-full h-full" shapeRendering="crispEdges">
                {type === 'ranged' ? <rect x="2" y="3" width="4" height="2" fill="#22d3ee" className="animate-pulse" /> : <rect x="2" y="2" width="4" height="4" fill="#a855f7" /> }
            </svg>
        </div>
    );
});

export const Arena: React.FC<Props> = ({ hero, enemies, illusions = [], runes = [], wave, texts, combatLog, isShopOpen, toggleAutoProgress, setWaveManually, pickupRune, handleManualClick }) => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [projectiles, setProjectiles] = useState<{id: string, type: string, start: {x:number, y:number}, end: {x:number, y:number}, startTime: number}[]>([]);
  
  const trees = useMemo(() => {
      const t = [];
      for(let i=0; i<12; i++) t.push({ id: `t-top-${i}`, x: -5 + (i * 10), y: -5 + Math.random() * 5, scale: 0.8 + Math.random() * 0.4 });
      for(let i=0; i<12; i++) t.push({ id: `t-bot-${i}`, x: -5 + (i * 10), y: 85 + Math.random() * 5, scale: 0.8 + Math.random() * 0.4 });
      t.push({ id: 't-l-1', x: -5, y: 30, scale: 1 });
      t.push({ id: 't-l-2', x: -2, y: 50, scale: 1.1 });
      t.push({ id: 't-r-1', x: 92, y: 20, scale: 0.9 });
      t.push({ id: 't-r-2', x: 95, y: 40, scale: 1.2 });
      return t;
  }, []);
  const groundDecor = useMemo(() => {
      const d = [];
      for(let i=0; i<8; i++) d.push({ id: `rock-${i}`, x: Math.random() * 90, y: Math.random() * 90, type: 'rock' });
      return d;
  }, []);

  useEffect(() => {
    let frameId: number;
    const loop = () => { setCurrentTime(Date.now()); frameId = requestAnimationFrame(loop); };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
      enemies.forEach(e => {
          if ((e.type === 'ranged' || e.type === 'healer') && currentTime - e.lastAttack < 50) { 
              setProjectiles(prev => [...prev, { id: Math.random().toString(), type: 'ranged', start: {x: e.x, y: e.y}, end: {x: hero.x, y: hero.y}, startTime: currentTime }]);
          }
      });
      setProjectiles(prev => prev.filter(p => currentTime - p.startTime < 400));
  }, [enemies, currentTime, hero.x, hero.y]);

  const isHeroAttacking = currentTime - hero.lastAttackTime < 200;
  const bonusEnemy = enemies.find(e => e.type === 'bonus');
  
  const onEnemyClick = (e: React.MouseEvent, enemyId: string) => {
      e.stopPropagation();
      if (handleManualClick) handleManualClick(enemyId);
      const target = e.currentTarget as HTMLElement;
      target.style.transform = 'scale(0.95)';
      setTimeout(() => target.style.transform = '', 50);
  };

  return (
    <div className="flex-1 bg-[#222b1d] relative overflow-hidden select-none cursor-crosshair flex flex-col shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] border-b-4 border-[#333] group font-pixel-text">
      
      {/* Background Terrain Layer */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[#1a2316]" />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#3a4f2e 2px, transparent 2px)', backgroundSize: '24px 24px' }} />
          {groundDecor.map(d => (
              <div key={d.id} className="absolute w-8 h-8" style={{ left: `${d.x}%`, top: `${d.y}%` }}><PixelRock /></div>
          ))}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      {trees.map(tree => (
          <div key={tree.id} className="absolute w-24 h-24 z-10" style={{ left: `${tree.x}%`, top: `${tree.y}%`, transform: `scale(${tree.scale})`, marginTop: '-48px', marginLeft: '-48px' }}>
              <PixelTree />
          </div>
      ))}

      {/* Wave Control Bar HUD */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-[#1b1d21] border-2 border-[#444] p-1 shadow-[4px_4px_0_#000]">
          <button onClick={() => setWaveManually('prev')} disabled={wave <= 1 || !!bonusEnemy} className="p-1 bg-[#222] border border-[#333] hover:bg-[#333] text-[#888] active:translate-y-0.5">
             <ChevronLeft size={20} />
          </button>
          
          <div className="px-4 flex flex-col items-center min-w-[100px] bg-black border-l-2 border-r-2 border-[#333] py-1">
             <span className="text-[10px] text-[#e2d096] uppercase font-bold tracking-widest">{bonusEnemy ? 'BONUS' : 'WAVE'}</span>
             <span className={`text-2xl font-bold leading-none font-pixel-title ${bonusEnemy ? 'text-yellow-400' : 'text-white'}`}>{wave}</span>
          </div>

          <button onClick={() => setWaveManually('next')} disabled={!!bonusEnemy} className="p-1 bg-[#222] border border-[#333] hover:bg-[#333] text-[#888] active:translate-y-0.5">
             <ChevronRight size={20} />
          </button>
          <div className="w-1 h-8 bg-[#333] mx-2" />
          <button onClick={toggleAutoProgress} className={`flex items-center gap-2 px-3 py-1 text-xs font-bold border-2 active:translate-y-0.5 pixel-btn ${hero.autoProgress ? 'bg-[#1a3d24] text-[#37d63e] border-[#2ecc71]' : 'bg-[#222] text-[#888] border-[#444]'}`}>
             {hero.autoProgress ? <Play size={10} fill="currentColor" /> : <Pause size={10} fill="currentColor" />} AUTO
          </button>
      </div>
      
      {bonusEnemy && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center">
             <div className="text-[#e2d096] font-pixel-title text-xl animate-pulse shadow-black drop-shadow-[2px_2px_0_#000]">SMASH THE COURIER!</div>
          </div>
      )}

      <div className="flex-1 relative">
        {runes.map(rune => {
            const color = rune.type === 'DD' ? 'text-blue-400' : (rune.type === 'HASTE' ? 'text-red-400' : 'text-green-400');
            return (
                <div key={rune.id} onClick={() => pickupRune(rune)} className="absolute z-20 cursor-pointer animate-bounce flex flex-col items-center" style={{ left: `${rune.x}%`, top: `${rune.y}%` }}>
                    <svg viewBox="0 0 16 16" className={`w-8 h-8 ${color} drop-shadow-lg pixel-art`}><path d="M8,2 L14,8 L8,14 L2,8 Z" fill="currentColor" stroke="white" strokeWidth="1" /><rect x="6" y="6" width="4" height="4" fill="white" /></svg>
                    <div className={`text-[10px] font-bold ${color} drop-shadow-[1px_1px_0_black] uppercase font-pixel-text mt-[-2px]`}>{rune.type}</div>
                </div>
            );
        })}

        {projectiles.map(p => {
            const progress = (currentTime - p.startTime) / 300; 
            if (progress > 1) return null;
            return <PixelProjectile key={p.id} type={p.type} start={p.start} end={p.end} progress={progress} />;
        })}

        {illusions.map(ill => {
            const isAttacking = currentTime - ill.lastAttackTime < 150;
            return (
                <div key={ill.id} className={`absolute w-32 h-32 z-20 transition-transform duration-75 opacity-60 ${isAttacking ? 'translate-x-4' : 'translate-x-0'}`} style={{ left: `${ill.x}%`, top: `${ill.y}%`, marginTop: '-64px', marginLeft: '-64px' }}>
                    <div className="w-full h-full filter hue-rotate-180 brightness-125"><PixelHero isAttacking={isAttacking} /></div>
                    <div className="absolute -top-2 left-0 right-0 h-2 bg-black border border-blue-900"><div style={{width: `${(ill.hp/ill.maxHp)*100}%`}} className="h-full bg-blue-500"></div></div>
                </div>
            )
        })}

        <div className={`absolute w-32 h-32 z-20 transition-transform duration-75 ${isHeroAttacking ? 'translate-x-2' : 'translate-x-0'}`} style={{ left: `${hero.x}%`, top: `${hero.y}%`, marginTop: '-64px', marginLeft: '-64px' }}>
            <div className={`w-full h-full relative ${hero.isDead ? 'grayscale opacity-50' : ''}`}><PixelHero isAttacking={isHeroAttacking} /></div>
            <div className="absolute -top-4 left-4 right-4 flex flex-col gap-1 z-30">
                <div className="h-2 bg-black border border-[#333]"><div style={{width: `${Math.max(0, (hero.hp/hero.baseStats.hpMax)*100)}%`}} className="h-full bg-[#1a6e2e]"></div></div>
                <div className="h-1 bg-black border border-[#333]"><div style={{width: `${Math.max(0, (hero.mana/hero.baseStats.manaMax)*100)}%`}} className="h-full bg-[#1d4ed8]"></div></div>
            </div>
        </div>

        {enemies.map(enemy => {
            const isEnemyAttacking = currentTime - enemy.lastAttack < 150;
            const isStunned = currentTime < enemy.stunnedUntil;
            const isBoss = enemy.type === 'boss';
            const isBonus = enemy.type === 'bonus';
            
            const sizeClass = isBoss ? 'w-64 h-64 z-30' : (isBonus ? 'w-32 h-32 z-30' : 'w-24 h-24 z-20');
            const marginTop = isBoss ? '-128px' : (isBonus ? '-64px' : '-48px');
            const marginLeft = isBoss ? '-128px' : (isBonus ? '-64px' : '-48px');

            return (
            <div key={enemy.id} onClick={(e) => onEnemyClick(e, enemy.id)} className={`absolute ${sizeClass} transition-all duration-75 cursor-pointer active:scale-95 hover:brightness-110 ${isEnemyAttacking ? '-translate-x-2' : 'translate-x-0'}`} style={{ left: `${enemy.x}%`, top: `${enemy.y}%`, marginTop, marginLeft }}>
                {!isBonus && (
                    <div className={`absolute ${isBoss ? '-top-12 w-32' : '-top-4 w-16'} left-1/2 -translate-x-1/2 flex flex-col gap-[1px] z-40`}>
                        <div className="h-2 bg-black border border-[#333] pointer-events-none"><div className="h-full bg-[#a31616]" style={{ width: `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%` }} /></div>
                    </div>
                )}
                <div className={`w-full h-full relative ${isStunned ? 'grayscale brightness-50' : ''}`}>
                    {isBoss ? (
                        <PixelBoss isAttacking={isEnemyAttacking} />
                    ) : (isBonus ? (
                        <div className="animate-bounce"><PixelCourier /></div>
                    ) : (
                        enemy.type === 'melee' ? <PixelCreepMelee isAttacking={isEnemyAttacking} color={enemy.color} /> : <PixelCreepRanged isAttacking={isEnemyAttacking} />
                    ))}
                    {isStunned && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl animate-spin pixel-art">💫</div>}
                </div>
                {isBoss && <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm font-bold text-[#e2d096] bg-black/50 px-2 font-pixel-title border border-[#e2d096]">ROSHAN</div>}
                {isBonus && <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-[#e2d096] bg-black/50 px-2 border border-yellow-500 pointer-events-none font-pixel-title">GOLDEN COURIER</div>}
            </div>
            );
        })}

        {texts.map(txt => (
            <div key={txt.id} className={`absolute font-bold pointer-events-none animate-float game-text-shadow whitespace-nowrap ${txt.color} font-pixel-title`} style={{ left: `${txt.x}%`, top: `${txt.y}%`, fontSize: txt.text === 'MISS' ? '20px' : (txt.isCrit ? '40px' : (txt.text.includes('!') ? '24px' : '16px')), zIndex: 50, textShadow: txt.isCrit ? '4px 4px 0px #000' : '2px 2px 0px #000' }}>
                {txt.text}
            </div>
        ))}
        
        {hero.isDead && (
            <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
                <h2 className="text-6xl font-pixel-title text-[#ff3c28] mb-4 drop-shadow-[4px_4px_0_#000]">YOU DIED</h2>
                <div className="text-4xl font-pixel-text text-white animate-pulse">{Math.ceil(hero.respawnTimer)}</div>
            </div>
        )}
      </div>
    </div>
  );
};
