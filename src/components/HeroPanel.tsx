
import React, { useEffect, useState } from 'react';
import { HeroState, Stats, Item, Skill } from '../types';
import { ITEMS, TALENTS, getItemTotalCost } from '../constants';
import { Shield, Sword, Gauge, Move, Coins, Timer, Brain } from 'lucide-react';
import { PixelItemIcon } from './PixelItemIcon';
import { PixelSkillIcon } from './PixelSkillIcon';

interface Props {
  hero: HeroState;
  stats: Stats;
  xpRequired: number;
  dps?: number;
  onSkillLevelUp: (id: string) => void;
  openShop: () => void;
  castSkill: (id: string) => void;
  toggleAutoCast: () => void;
  selectTalent: (lvl: number, id: string) => void;
  onSellItem: (index: number, fromBackpack?: boolean) => void;
  swapItem?: (fromIdx: number, fromContainer: 'inventory'|'backpack', toIdx: number, toContainer: 'inventory'|'backpack') => void;
  onShowTooltip: (content: React.ReactNode, rect: DOMRect) => void;
  onHideTooltip: () => void;
  openTalentTree: () => void;
}

export const HeroPanel: React.FC<Props> = ({ 
    hero, stats, xpRequired, dps = 0, 
    onSkillLevelUp, openShop, castSkill, toggleAutoCast, selectTalent, onSellItem, swapItem,
    onShowTooltip, onHideTooltip, openTalentTree
}) => {
  const [now, setNow] = useState(Date.now());
  const [selectedSlot, setSelectedSlot] = useState<{idx: number, type: 'inventory'|'backpack'} | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(interval);
  }, []);

  const handleSlotClick = (idx: number, type: 'inventory'|'backpack') => {
      if (!swapItem) return;
      if (selectedSlot) {
          if (selectedSlot.idx === idx && selectedSlot.type === type) {
              setSelectedSlot(null);
          } else {
              swapItem(selectedSlot.idx, selectedSlot.type, idx, type);
              setSelectedSlot(null);
          }
      } else {
          const hasItem = type === 'inventory' ? hero.inventory[idx] : (hero.backpack ? hero.backpack[idx] : null);
          if (hasItem) setSelectedSlot({ idx, type });
      }
  };

  const handleMouseEnter = (e: React.MouseEvent, content: React.ReactNode) => {
      const rect = e.currentTarget.getBoundingClientRect();
      onShowTooltip(content, rect);
  };

  const xpPercent = Math.min(100, (hero.xp / xpRequired) * 100);
  
  const renderStat = (icon: React.ReactNode, label: string, value: number | string, sub?: string, color: string = "text-[#aaa]") => (
    <div className="flex items-center justify-between text-sm mb-1 px-1 cursor-default font-pixel-text tracking-wide">
      <div className="flex items-center gap-2 text-[#808fa0]">
        <span className="opacity-70">{icon}</span>
        <span>{label}</span>
      </div>
      <div className="text-right flex flex-col items-end leading-none">
        <span className={`font-bold ${color} text-lg`}>{value}</span>
        {sub && <span className="text-xs text-[#e2d096]">{sub}</span>}
      </div>
    </div>
  );

  const getSkillTooltipContent = (skill: Skill) => {
     return (
        <div className="w-[320px] bg-[#1b1d21] border-2 border-white/20 p-0 text-sm shadow-[8px_8px_0_#000] font-pixel-text">
            <div className="bg-[#2a2d33] p-3 border-b-2 border-white/10 flex justify-between items-start">
                <div>
                    <div className="font-pixel-title text-[#e2d096] text-sm uppercase">{skill.name}</div>
                    <div className="text-[#888]">LVL {skill.level} / {skill.maxLevel}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    {skill.manaCost > 0 && <span className="text-[#3b82f6] font-bold">{skill.manaCost} MANA</span>}
                    {skill.cooldown > 0 && <span className="text-[#ccc] font-bold">{skill.cooldown}s CD</span>}
                </div>
            </div>
            
            <div className="p-3">
                <p className="text-[#ccc] mb-4 leading-normal">{skill.description}</p>
                {skill.params && (
                    <div className="space-y-1 mb-4 border-t border-white/10 pt-2">
                        {Object.entries(skill.params).map(([key, values]) => (
                            <div key={key} className="flex justify-between items-center text-xs">
                                <span className="text-[#888] uppercase">{key}</span>
                                <div className="flex gap-2 font-mono text-[#666]">
                                    {values.map((v, i) => (
                                        <span key={i} className={i + 1 === skill.level ? 'text-[#e2d096] font-bold underline' : ''}>
                                            {v}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {skill.lore && <div className="text-xs text-[#555] italic border-t border-white/10 pt-2">{skill.lore}</div>}
            </div>
        </div>
     );
  };

  const getItemTooltipContent = (item: Item, isBackpack: boolean) => {
     const realCost = getItemTotalCost(item.id);
     return (
        <div className="w-[300px] bg-[#1b1d21] border-2 border-white/20 p-0 text-sm shadow-[8px_8px_0_#000] font-pixel-text">
            <div className="bg-[#2a2d33] p-3 border-b-2 border-white/10 flex justify-between items-start">
                <div className="flex items-center gap-3">
                     <div className={`w-8 h-8 border-2 border-[#555] p-1 ${item.color} bg-black`}>
                        <PixelItemIcon id={item.id} />
                     </div>
                     <div>
                        <div className={`font-pixel-title text-sm ${item.color}`}>{item.name}</div>
                        <div className="text-[#888] text-xs uppercase">{item.category}</div>
                     </div>
                </div>
                <div className="text-[#e2d096] flex items-center gap-1 font-bold">
                    <Coins size={12} /> {realCost}
                </div>
            </div>

            {isBackpack && <div className="bg-[#3d1a1a] p-1 text-center text-[#ff8080] font-bold uppercase border-b-2 border-[#5a2525]">Inactive</div>}

            <div className="p-3">
                <div className="space-y-1 text-[#ccc] mb-4">
                {Object.entries(item.stats).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-white/5 pb-0.5">
                        <span className="capitalize text-[#888]">{k.replace('Pct', '%').replace('critChance', 'Crit %').replace('hpRegenPct', '% HP Reg')}</span>
                        <span className="font-bold text-white">{k.includes('critDamage') ? `x${v}` : `+${v}`}</span>
                    </div>
                ))}
                </div>
                {item.description && <div className="text-[#aaa] mb-2 leading-tight text-xs">{item.description}</div>}
                <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                    <span className="text-[#666]">Sell Value</span>
                    <span className="text-[#e2d096]">+{Math.floor(realCost/2)}g</span>
                </div>
            </div>
        </div>
     );
  };

  const renderItemSlot = (itemId: string | undefined, index: number, type: 'inventory'|'backpack') => {
      const item = itemId ? ITEMS[itemId] : null;
      const isSelected = selectedSlot?.idx === index && selectedSlot?.type === type;
      
      let cooldownRemaining = 0;
      if (item && item.cooldown && type === 'inventory') {
          const lastProc = hero.itemCooldowns?.[item.id] || 0;
          const elapsed = now - lastProc;
          if (elapsed < item.cooldown * 1000) {
              cooldownRemaining = Math.ceil((item.cooldown * 1000 - elapsed) / 1000);
          }
      }
      
      return (
         <div 
            key={`${type}-${index}`} 
            onClick={() => handleSlotClick(index, type)}
            onContextMenu={(e) => { e.preventDefault(); onSellItem(index, type === 'backpack'); }}
            onMouseEnter={(e) => item && handleMouseEnter(e, getItemTooltipContent(item, type === 'backpack'))}
            onMouseLeave={onHideTooltip}
            className={`
                aspect-square bg-[#111] relative group cursor-pointer pixel-art
                flex items-center justify-center
                border-2 ${isSelected ? 'border-[#e2d096]' : 'border-[#444] hover:border-[#666]'}
            `}
         >
            {item ? (
               <>
                 <div className={`w-[80%] h-[80%] ${item.color}`}>
                    <PixelItemIcon id={item.id} />
                 </div>
                 {cooldownRemaining > 0 && (
                     <div className="absolute inset-0 bg-black/80 z-20 flex items-center justify-center font-pixel-title text-white">
                         {cooldownRemaining}
                     </div>
                 )}
               </>
            ) : null}
            <div className="absolute top-0.5 left-1 text-[8px] text-[#444] pointer-events-none font-pixel-text">{type === 'inventory' ? index + 1 : ''}</div>
         </div>
       )
  };

  return (
    <div className="w-full md:w-[340px] bg-[#1b1d21] border-r-4 border-[#333] flex flex-col h-full overflow-y-auto shrink-0 z-20 custom-scrollbar font-pixel-text shadow-[4px_0_0_rgba(0,0,0,0.5)]">
      
      {/* Hero Header */}
      <div className="bg-[#222] p-4 border-b-4 border-[#333] flex flex-col items-center">
         {/* Portrait */}
         <div className="relative mb-2">
             <div className="w-20 h-20 border-4 border-[#555] bg-[#000] overflow-hidden">
                <svg viewBox="0 0 32 32" className="w-full h-full pixel-art transform scale-125 translate-y-2">
                     <rect x="12" y="4" width="8" height="7" fill="#ffedd5" />
                     <rect x="12" y="6" width="8" height="2" fill="#1e1b4b" />
                     <rect x="11" y="6" width="1" height="2" fill="#0f172a" />
                     <rect x="20" y="6" width="1" height="2" fill="#0f172a" />
                     <path d="M14,1 h4 v3 h-4 Z" fill="#f3f4f6" />
                     <rect x="15" y="0" width="2" height="2" fill="#fff" />
                     <rect x="10" y="10" width="12" height="12" fill="#ffedd5" />
                     <path d="M11,11 h2 v1 h-1 v1 h-1 Z" fill="#7c3aed" opacity="0.9" />
                </svg>
             </div>
             <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#1b1d21] border-2 border-[#e2d096] text-[#e2d096] w-6 h-6 flex items-center justify-center text-xs font-bold">
                 {hero.level}
             </div>
         </div>
         
         <h1 className="text-xl font-pixel-title text-[#e2d096] uppercase tracking-wider mb-2">Anti-Mage</h1>
         
         {/* XP Bar */}
         <div className="w-full h-4 bg-[#000] border-2 border-[#444] relative">
            <div className="h-full bg-[#b38b38]" style={{ width: `${xpPercent}%` }} />
            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white drop-shadow-[1px_1px_0_#000]">
                {hero.xp} / {xpRequired} XP
            </div>
         </div>
      </div>

      {/* HP / Mana Bars */}
      <div className="p-4 bg-[#1a1c20] border-b-4 border-[#333] space-y-3">
         <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white font-bold">HEALTH</span>
              <span className="text-[#37d63e]">+{stats.hpRegen.toFixed(1)}</span>
            </div>
            <div className="h-6 bg-[#000] border-2 border-[#333] relative">
              <div className="h-full bg-[#1a6e2e]" style={{ width: `${Math.max(0, (hero.hp / stats.hpMax) * 100)}%` }}></div>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white drop-shadow-[1px_1px_0_#000]">
                  {Math.floor(Math.max(0, hero.hp))} / {stats.hpMax}
              </div>
            </div>
         </div>
         
         <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white font-bold">MANA</span>
              <span className="text-[#3b82f6]">+{stats.manaRegen.toFixed(1)}</span>
            </div>
            <div className="h-6 bg-[#000] border-2 border-[#333] relative">
              <div className="h-full bg-[#1d4ed8]" style={{ width: `${Math.max(0, (hero.mana / stats.manaMax) * 100)}%` }}></div>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white drop-shadow-[1px_1px_0_#000]">
                  {Math.floor(Math.max(0, hero.mana))} / {stats.manaMax}
              </div>
            </div>
         </div>
      </div>

      {/* Stats Section */}
      <div className="p-4 border-b-4 border-[#333] bg-[#222]">
        {/* Attributes Primary */}
        <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-[#15171a] p-2 border-2 border-[#444] flex flex-col items-center">
                <div className="w-2 h-2 bg-red-600 mb-1" />
                <div className="text-white font-bold text-xl leading-none">{stats.strength}</div>
                <div className="text-[10px] text-[#666] uppercase">Str</div>
            </div>
            
            <div className="bg-[#15171a] p-2 border-2 border-[#22c55e] flex flex-col items-center relative shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                <div className="w-2 h-2 bg-[#22c55e] mb-1" />
                <div className="text-white font-bold text-xl leading-none">{stats.agility}</div>
                <div className="text-[10px] text-[#22c55e] uppercase">Agi</div>
            </div>

            <div className="bg-[#15171a] p-2 border-2 border-[#444] flex flex-col items-center">
                 <div className="w-2 h-2 bg-blue-500 mb-1" />
                <div className="text-white font-bold text-xl leading-none">{stats.intelligence}</div>
                <div className="text-[10px] text-[#666] uppercase">Int</div>
            </div>
        </div>

        {/* Detailed Stats */}
        <div className="bg-[#15171a] p-2 border-2 border-[#333]">
           {renderStat(<Sword size={14}/>, "DAMAGE", stats.damage)}
           {renderStat(<Shield size={14}/>, "ARMOR", stats.armor.toFixed(1))}
           {renderStat(<Gauge size={14}/>, "ATK SPD", stats.attackSpeed.toFixed(2))}
           {renderStat(<Move size={14}/>, "SPEED", stats.moveSpeed)}
        </div>
        
        <button 
            onClick={openTalentTree}
            className="mt-4 w-full h-10 bg-[#222] border-2 border-[#e2d096] text-[#e2d096] font-pixel-title text-xs hover:bg-[#e2d096] hover:text-black transition-colors flex items-center justify-center gap-2 pixel-btn"
        >
            <Brain size={14} /> TALENT TREE
        </button>
      </div>

      {/* Skills */}
      <div className="p-4 border-b-4 border-[#333] bg-[#1a1c20]">
         <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold text-[#666] uppercase font-pixel-title">Abilities</h3>
            <button 
                onClick={toggleAutoCast}
                className={`text-[10px] px-2 py-1 border-2 font-bold uppercase transition-all ${
                    hero.autoCast 
                    ? 'bg-[#1a3d24] border-[#2ecc71] text-[#2ecc71]' 
                    : 'bg-[#15171a] border-[#444] text-[#666] hover:text-white'
                }`}
            >
                {hero.autoCast ? 'AUTO: ON' : 'AUTO: OFF'}
            </button>
         </div>
         <div className="grid grid-cols-4 gap-2">
            {hero.skills.map(skill => {
               const isOnCooldown = now - skill.lastCast < skill.cooldown * 1000;
               const cdRemaining = Math.ceil((skill.cooldown * 1000 - (now - skill.lastCast)) / 1000);
               const isActive = skill.type === 'Active';
               const isBlink = skill.id === 'blink';
               
               return (
               <div key={skill.id} className="relative aspect-square">
                  <div 
                    className={`w-full h-full relative border-2 border-[#444] bg-black ${isActive && skill.level > 0 && !isBlink ? 'hover:border-[#e2d096] cursor-pointer' : ''}`}
                    onMouseEnter={(e) => handleMouseEnter(e, getSkillTooltipContent(skill))}
                    onMouseLeave={onHideTooltip}
                  >
                    <button 
                        disabled={!isActive || isOnCooldown || skill.level === 0 || isBlink}
                        onClick={() => isActive && castSkill(skill.id)}
                        className={`w-full h-full flex items-center justify-center relative active:translate-y-0.5 ${skill.level === 0 || isBlink ? 'grayscale opacity-30 cursor-not-allowed' : ''}`}
                    >
                         {/* PIXEL SKILL ICON */}
                        <div className="w-full h-full">
                           <PixelSkillIcon id={skill.id} />
                        </div>
                        
                        {isOnCooldown && (
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
                                <span className="text-white font-pixel-title text-sm">{cdRemaining}</span>
                            </div>
                        )}
                        
                         {/* Level Dots */}
                        <div className="absolute bottom-0.5 left-0 w-full flex justify-center gap-0.5 px-0.5">
                            {Array.from({length: skill.maxLevel}).map((_, i) => (
                                <div key={i} className={`w-1 h-1 ${i < skill.level ? 'bg-[#e2d096]' : 'bg-[#333]'}`}></div>
                            ))}
                        </div>
                    </button>

                    {/* Level Up Button */}
                    {hero.skillPoints > 0 && skill.level < skill.maxLevel && !isBlink && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onSkillLevelUp(skill.id); }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-[#e2d096] text-black border border-white flex items-center justify-center z-30 hover:scale-110"
                        >
                            +
                        </button>
                    )}
                  </div>
               </div>
            )})}
         </div>
         {hero.skillPoints > 0 && (
             <div className="mt-2 text-center text-[#e2d096] text-xs font-bold animate-pulse font-pixel-title">
                 {hero.skillPoints} POINTS AVAILABLE
             </div>
         )}
      </div>

      {/* Inventory */}
      <div className="p-4 flex-1 bg-[#121316]">
         <div className="flex justify-between items-center mb-3">
             <h3 className="text-xs font-bold text-[#666] uppercase font-pixel-title">Items</h3>
             <div className="text-[#e2d096] font-pixel-text text-lg flex items-center gap-2">
                <div className="w-3 h-3 bg-[#e2d096] rounded-none rotate-45" />
                {hero.gold.toLocaleString()}
             </div>
         </div>
         
         <div className="grid grid-cols-3 gap-2 mb-4 bg-[#0b0c0f] p-2 border-2 border-[#333]">
            {Array.from({ length: 6 }).map((_, i) => renderItemSlot(hero.inventory[i], i, 'inventory'))}
         </div>

         <div className="mb-4">
             <h3 className="text-[10px] font-bold text-[#444] uppercase mb-1 font-pixel-title pl-1">Backpack</h3>
             <div className="grid grid-cols-3 gap-2 opacity-70">
                {Array.from({ length: 3 }).map((_, i) => renderItemSlot(hero.backpack ? hero.backpack[i] : undefined, i, 'backpack'))}
             </div>
         </div>

         <button 
            onClick={openShop}
            className="w-full py-3 bg-[#4d3a24] border-2 border-[#6d5233] text-[#e2d096] font-pixel-title text-sm hover:brightness-110 pixel-btn flex items-center justify-center gap-2 mt-auto"
         >
            <Coins size={16} /> SHOP
         </button>
      </div>
    </div>
  );
};
