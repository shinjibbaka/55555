
import React from 'react';
import { PrestigeData } from '../types';
import { PRESTIGE_TREE } from '../constants';
import { X, Check, Lock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  prestige: PrestigeData;
  onUnlock: (nodeId: string) => void;
  onRebirth: () => void;
  currentWave: number;
}

export const TalentTreeModal: React.FC<Props> = ({ isOpen, onClose, prestige, onUnlock, onRebirth, currentWave }) => {
  if (!isOpen) return null;

  const earnedPoints = Math.floor(currentWave / 10);
  const canRebirth = currentWave >= 10;

  // Helper to calculate positions based on the 4-quadrant layout
  // Center is 50, 50.
  // Col > 0 moves Right, Col < 0 moves Left
  // Row > 0 moves Up, Row < 0 moves Down
  const getPosition = (row: number, col: number) => {
      const centerX = 50;
      const centerY = 50;
      const scaleX = 12; // Horizontal Spread
      const scaleY = 10; // Vertical Spread
      return {
          left: centerX + (col * scaleX),
          bottom: centerY + (row * scaleY)
      };
  };

  const renderLines = () => {
    return PRESTIGE_TREE.map(node => {
      if (!node.parentId) return null;
      const parent = PRESTIGE_TREE.find(p => p.id === node.parentId);
      if (!parent) return null;

      const pos1 = getPosition(node.row, node.col);
      const pos2 = getPosition(parent.row, parent.col);
      
      const isUnlocked = prestige.unlockedNodes.includes(node.id);
      
      return (
        <line 
          key={`${parent.id}-${node.id}`}
          x1={`${pos1.left}%`} y1={`${100 - pos1.bottom}%`} x2={`${pos2.left}%`} y2={`${100 - pos2.bottom}%`}
          stroke={isUnlocked ? '#e2d096' : '#333'}
          strokeWidth="4"
          className="transition-colors duration-500"
        />
      );
    });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#111] flex flex-col items-center justify-center animate-in fade-in duration-300 font-pixel-text">
      <div className="absolute inset-0 bg-[#000]/50" />

      {/* Header */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-start z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-4xl font-pixel-title text-[#e2d096] uppercase drop-shadow-[4px_4px_0_#000]">
            Ascension Tree
          </h1>
          <p className="text-[#888] text-sm uppercase mt-1">
            Rebirth to unlock permanent power
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          <button onClick={onClose} className="text-[#666] hover:text-white mb-4 border-2 border-transparent hover:border-white p-2">
            <X size={32} />
          </button>
          
          <div className="flex items-center gap-2 bg-[#222] px-4 py-2 border-2 border-[#444] shadow-[4px_4px_0_#000]">
            <span className="text-[#888] uppercase text-xs">Points:</span>
            <span className="text-2xl font-bold text-[#e2d096]">{prestige.points}</span>
          </div>
        </div>
      </div>

      {/* Branch Labels */}
      <div className="absolute top-[20%] left-[20%] text-[#333] font-bold text-6xl opacity-20 pointer-events-none uppercase">ECO</div>
      <div className="absolute top-[20%] right-[20%] text-[#333] font-bold text-6xl opacity-20 pointer-events-none uppercase">OFFENSE</div>
      <div className="absolute bottom-[20%] left-[20%] text-[#333] font-bold text-6xl opacity-20 pointer-events-none uppercase">DEFENSE</div>
      <div className="absolute bottom-[20%] right-[20%] text-[#333] font-bold text-6xl opacity-20 pointer-events-none uppercase">ABILITY</div>

      {/* Tree Visualization */}
      <div className="relative w-full max-w-6xl aspect-[16/9] bg-[#0b0c0f] border-4 border-[#333] mt-12 mb-8 mx-4 shadow-[8px_8px_0_#000] overflow-visible">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {renderLines()}
        </svg>

        {PRESTIGE_TREE.map(node => {
          const isUnlocked = prestige.unlockedNodes.includes(node.id);
          const isParentUnlocked = !node.parentId || prestige.unlockedNodes.includes(node.parentId);
          const isMutexLocked = node.mutexId && prestige.unlockedNodes.includes(node.mutexId);
          const canBuy = isParentUnlocked && !isUnlocked && !isMutexLocked && prestige.points >= node.cost;

          const pos = getPosition(node.row, node.col);
          const isHighNode = node.row > 0;

          return (
            <div 
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${pos.left}%`, bottom: `${pos.bottom}%`, zIndex: 10 }}
            >
              <button
                onClick={() => canBuy && onUnlock(node.id)}
                disabled={!canBuy && !isUnlocked}
                className={`
                  w-14 h-14 border-4 flex items-center justify-center text-xl relative shadow-[4px_4px_0_#000] transition-all
                  ${isUnlocked 
                    ? 'bg-[#e2d096] border-[#fff] text-black' 
                    : (isMutexLocked
                        ? 'bg-[#220000] border-[#550000] text-[#550000] cursor-not-allowed opacity-50'
                        : (canBuy 
                            ? 'bg-[#333] border-[#e2d096] text-[#e2d096] animate-pulse hover:bg-[#444]' 
                            : 'bg-[#111] border-[#333] text-[#444] grayscale cursor-not-allowed'))
                  }
                `}
              >
                {isMutexLocked ? <Lock size={20} /> : node.icon}
                {isUnlocked && <div className="absolute -top-2 -right-2 bg-green-500 text-black border-2 border-black p-0.5"><Check size={12} strokeWidth={4} /></div>}
              </button>

              {/* Tooltip */}
              <div 
                className={`
                    absolute left-1/2 -translate-x-1/2 w-64 bg-[#1b1d21] border-2 border-[#fff] p-3 text-center 
                    opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none 
                    shadow-[8px_8px_0_#000] z-[100]
                    ${isHighNode ? 'top-full mt-4' : 'bottom-full mb-4'}
                `}
              >
                 <h3 className="text-[#e2d096] font-bold font-pixel-title uppercase text-sm">{node.name}</h3>
                 <p className="text-[#ccc] text-xs my-2 leading-relaxed">{node.description}</p>
                 <div className="text-xs uppercase font-bold text-[#666]">
                    {isUnlocked 
                        ? <span className="text-green-500">Learned</span> 
                        : (isMutexLocked 
                            ? <span className="text-red-500">Locked by Choice</span> 
                            : <span>Cost: {node.cost} Points</span>)
                    }
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rebirth Controls */}
      <div className="absolute bottom-8 flex flex-col items-center">
         <div className="bg-[#1b1d21] p-4 border-4 border-[#333] shadow-[8px_8px_0_#000] flex items-center gap-6 max-w-2xl pixel-panel">
            <div className="text-left">
               <h3 className="text-xl font-bold text-white font-pixel-title uppercase mb-1">Rebirth Ritual</h3>
               <p className="text-xs text-[#888] leading-tight max-w-xs">
                 Reset Level & Gold to earn <span className="text-[#e2d096]">Ascension Points</span>.
               </p>
            </div>
            
            <div className="flex flex-col items-center">
               <div className="text-[#e2d096] font-bold text-3xl font-pixel-title mb-2">+{earnedPoints} PTS</div>
               <button 
                  onClick={onRebirth}
                  disabled={!canRebirth}
                  className={`px-6 py-3 font-bold uppercase text-sm border-4 pixel-btn ${
                      canRebirth 
                      ? 'bg-[#4c1d95] text-white border-[#a855f7]' 
                      : 'bg-[#222] text-[#555] cursor-not-allowed border-[#333]'
                  }`}
               >
                  {canRebirth ? 'REBIRTH NOW' : 'REQ: WAVE 10'}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
