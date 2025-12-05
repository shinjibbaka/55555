
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
      <div className="absolute bottom-[20%