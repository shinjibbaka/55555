
import React, { useState, useRef, useEffect } from 'react';
import { HeroPanel } from './components/HeroPanel';
import { Arena } from './components/Arena';
import { Shop } from './components/Shop';
import { AdminPanel } from './components/AdminPanel';
import { Scoreboard } from './components/Scoreboard';
import { ChatWidget } from './components/ChatWidget';
import { Minimap } from './components/Minimap';
import { TalentTreeModal } from './components/TalentTreeModal';
import { useGameEngine } from './hooks/useGameEngine';

const App: React.FC = () => {
  const engine = useGameEngine();
  
  // Global Tooltip State
  const [tooltip, setTooltip] = useState<{ content: React.ReactNode, rect: DOMRect } | null>(null);
  
  const handleShowTooltip = (content: React.ReactNode, rect: DOMRect) => {
    setTooltip({ content, rect });
  };

  const handleHideTooltip = () => {
    setTooltip(null);
  };

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-black font-sans text-slate-200 selection:bg-purple-500/30 relative">
      
      {/* SYSTEM RESET Banner */}
      <div className="absolute top-0 left-0 bg-red-600 text-white font-bold px-2 py-1 z-[100] text-xs pointer-events-none border-b-2 border-r-2 border-red-800 animate-pulse">
          SYSTEM RESET - BLINK PURGED
      </div>

      <Scoreboard 
        radiantTeam={engine.radiantTeam}
        direTeam={engine.direTeam}
        gameTime={engine.gameTime}
      />
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
          {/* Left Panel */}
          <HeroPanel 
            hero={engine.hero}
            stats={engine.stats}
            xpRequired={engine.xpRequired}
            dps={engine.dps}
            onSkillLevelUp={engine.levelUpSkill}
            openShop={() => engine.setIsShopOpen(true)}
            castSkill={engine.castSkill}
            toggleAutoCast={engine.toggleAutoCast}
            selectTalent={engine.selectTalent}
            onSellItem={engine.sellItem}
            swapItem={engine.swapItem}
            onShowTooltip={handleShowTooltip}
            onHideTooltip={handleHideTooltip}
            openTalentTree={() => engine.setIsTalentTreeOpen(true)}
          />
          
          {/* Center Column: Arena + Chat */}
          <div className="flex-1 flex flex-col h-full min-w-0 bg-[#111] relative">
               {/* Arena (Shrunk vertically by the existence of Chat) */}
               <Arena 
                hero={engine.hero}
                enemies={engine.enemies}
                illusions={engine.illusions}
                runes={engine.runes}
                wave={engine.wave}
                texts={engine.texts}
                combatLog={engine.combatLog}
                isShopOpen={engine.isShopOpen}
                toggleAutoProgress={engine.toggleAutoProgress}
                setWaveManually={engine.setWaveManually}
                pickupRune={engine.pickupRune}
                handleManualClick={engine.handleManualClick}
              />
              
              {/* Bottom Chat */}
              <ChatWidget messages={engine.chatMessages} />
              
              {/* Minimap Overlay (Bottom Right) */}
              <div className="absolute bottom-0 right-0 z-40">
                  <Minimap 
                    radiantTeam={engine.radiantTeam} 
                    direTeam={engine.direTeam} 
                  />
              </div>
          </div>
      </div>
      
      <Shop 
        isOpen={engine.isShopOpen}
        onClose={() => engine.setIsShopOpen(false)}
        gold={engine.hero.gold}
        onBuy={engine.buyItem}
      />

      <TalentTreeModal 
        isOpen={engine.isTalentTreeOpen}
        onClose={() => engine.setIsTalentTreeOpen(false)}
        prestige={engine.hero.prestige}
        onUnlock={engine.unlockPrestigeNode}
        onRebirth={engine.rebirth}
        currentWave={engine.hero.highestWave}
      />

      <AdminPanel 
        adminActions={engine.adminActions}
        godMode={engine.hero.godMode}
      />

      {/* Global Tooltip Layer */}
      {tooltip && (
        <TooltipOverlay rect={tooltip.rect}>
            {tooltip.content}
        </TooltipOverlay>
      )}
    </div>
  );
};

// Internal component for positioning
const TooltipOverlay: React.FC<{ rect: DOMRect, children: React.ReactNode }> = ({ rect, children }) => {
    const [pos, setPos] = useState<{top: number, left: number}>({ top: 0, left: 0 });
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            const isDesktop = window.innerWidth >= 768;
            const width = ref.current.offsetWidth;
            const height = ref.current.offsetHeight;
            
            let top = rect.top;
            let left = rect.right + 12; // Default to right side

            if (isDesktop) {
                // Check right edge
                if (left + width > window.innerWidth) {
                    left = rect.left - width - 12; // Flip to left
                }
                // Check bottom edge
                if (top + height > window.innerHeight) {
                    top = window.innerHeight - height - 12;
                }
            } else {
                // Mobile: Position below or above
                left = 12; // Center-ish
                top = rect.bottom + 12;
                if (top + height > window.innerHeight) {
                    top = rect.top - height - 12;
                }
            }

            setPos({ top, left });
        }
    }, [rect]);

    return (
        <div 
            ref={ref}
            style={{ top: pos.top, left: pos.left }}
            className="fixed z-[100] pointer-events-none animate-in fade-in zoom-in-95 duration-75"
        >
            {children}
        </div>
    );
};

export default App;
