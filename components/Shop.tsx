
import React, { useState } from 'react';
import { Item } from '../types';
import { ITEMS, getItemTotalCost } from '../constants';
import { X, Layers, Zap, CornerDownRight, Coins, Book } from 'lucide-react';
import { PixelItemIcon } from './PixelItemIcon';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  gold: number;
  onBuy: (item: Item) => void;
}

type Tab = 'upgrade' | 'basic' | 'consumable';

export const Shop: React.FC<Props> = ({ isOpen, onClose, gold, onBuy }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('upgrade');

  if (!isOpen) return null;

  const itemsInTab = Object.values(ITEMS).filter(i => i.category === activeTab && !i.isRecipe);
  
  const getComponents = (itemId: string): Item[] => {
      const item = ITEMS[itemId];
      if (!item || !item.components) return [];
      return item.components.map(id => ITEMS[id]).filter(Boolean) as Item[];
  };

  const renderRecipeTree = (item: Item, depth: number = 0) => {
      const children = getComponents(item.id);
      const realCost = getItemTotalCost(item.id);
      const canAfford = gold >= realCost;

      return (
          <div key={item.id} className="flex flex-col font-pixel-text">
              <div 
                onClick={() => setSelectedItem(item)}
                className={`flex items-center gap-2 p-1 mb-1 cursor-pointer hover:bg-[#333] border-b border-[#222] ${selectedItem?.id === item.id ? 'bg-[#333]' : ''}`}
                style={{ paddingLeft: `${depth * 16 + 8}px` }}
              >
                  {depth > 0 && <CornerDownRight size={12} className="text-[#666]" />}
                  <div className={`w-6 h-6 border border-[#444] bg-black p-0.5 ${item.color}`}>
                      <PixelItemIcon id={item.id} />
                  </div>
                  <div className="flex-1">
                      <div className={`text-sm ${item.color}`}>{item.name}</div>
                      <div className={`text-xs ${canAfford ? 'text-[#e2d096]' : 'text-[#ff3c28]'}`}>
                         {realCost}g
                      </div>
                  </div>
                  <button 
                         onClick={(e) => { e.stopPropagation(); onBuy(item); }}
                         disabled={!canAfford}
                         className={`px-2 py-1 text-xs border border-[#444] ${canAfford ? 'bg-[#4d3a24] text-[#e2d096]' : 'bg-[#222] text-[#444]'}`}
                      >
                          BUY
                  </button>
              </div>
              {children.length > 0 && (
                  <div className="border-l border-[#333] ml-4">
                      {children.map(child => renderRecipeTree(child, depth + 1))}
                  </div>
              )}
          </div>
      );
  };

  const selectedItemCost = selectedItem ? getItemTotalCost(selectedItem.id) : 0;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-pixel-text">
      <div className="bg-[#1b1d21] w-full max-w-5xl h-[80vh] pixel-panel flex flex-col relative">
        
        {/* Header */}
        <div className="p-4 border-b-4 border-[#333] flex justify-between items-center bg-[#222]">
          <div className="flex items-center gap-8">
              <div>
                <h2 className="text-2xl font-pixel-title text-[#e2d096] uppercase drop-shadow-[2px_2px_0_#000]">SECRET SHOP</h2>
                <div className="text-sm text-[#888]">
                    GOLD: <span className="text-[#e2d096]">{gold.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                  {['upgrade', 'basic', 'consumable'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as Tab)}
                        className={`px-4 py-2 border-2 text-sm uppercase font-bold pixel-btn ${
                            activeTab === tab 
                            ? 'bg-[#333] border-[#ccc] text-white' 
                            : 'bg-[#111] border-[#444] text-[#666] hover:text-[#999]'
                        }`}
                      >
                         {tab}s
                      </button>
                  ))}
              </div>
          </div>
          
          <button onClick={onClose} className="text-[#666] hover:text-white p-2 border-2 border-transparent hover:border-[#444]">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
            {/* Left: Item Grid */}
            <div className="flex-[2] p-4 overflow-y-auto grid grid-cols-5 gap-2 content-start bg-[#15171a] border-r-4 border-[#333] custom-scrollbar">
            {itemsInTab.map(item => {
                const realCost = getItemTotalCost(item.id);
                const canAfford = gold >= realCost;
                const isSelected = selectedItem?.id === item.id;
                
                return (
                    <button 
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`flex flex-col p-1 text-left h-20 border-2 pixel-btn ${
                        isSelected ? 'bg-[#333] border-[#e2d096]' : 'bg-[#222] border-[#444] hover:border-[#666]'
                    }`}
                    >
                        <div className="flex justify-between w-full mb-1">
                            <div className={`w-8 h-8 bg-black border border-[#333] p-1 ${item.color}`}>
                                <PixelItemIcon id={item.id} />
                            </div>
                            <div className={`text-xs px-1 ${canAfford ? 'text-[#e2d096]' : 'text-[#ff3c28]'}`}>
                                {realCost}
                            </div>
                        </div>
                        <div className={`text-[10px] leading-tight ${item.color}`}>{item.name}</div>
                    </button>
                );
            })}
            </div>

            {/* Right: Details */}
            <div className="flex-[1.2] bg-[#1a1c20] flex flex-col overflow-hidden p-4">
                {selectedItem ? (
                    <div className="h-full flex flex-col">
                        <div className="flex gap-4 mb-4 border-b-2 border-[#333] pb-4">
                             <div className={`w-16 h-16 bg-black border-2 border-[#555] p-2 ${selectedItem.color}`}>
                                <PixelItemIcon id={selectedItem.id} />
                             </div>
                             <div>
                                 <h3 className={`text-xl font-pixel-title ${selectedItem.color} uppercase`}>{selectedItem.name}</h3>
                                 <div className="text-xs text-[#666] uppercase mb-2">{selectedItem.category} Item</div>
                                 <button 
                                    onClick={() => onBuy(selectedItem)}
                                    disabled={gold < selectedItemCost}
                                    className={`w-full px-4 py-2 border-2 text-sm font-bold uppercase pixel-btn ${
                                        gold >= selectedItemCost 
                                        ? 'bg-[#4d3a24] border-[#6d5233] text-[#e2d096]' 
                                        : 'bg-[#222] border-[#333] text-[#444] cursor-not-allowed'
                                    }`}
                                >
                                    {gold >= selectedItemCost ? 'BUY' : 'NO GOLD'}
                                </button>
                             </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="mb-4">
                                <div className="text-xs font-bold text-[#666] uppercase mb-2">Attributes</div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                    {Object.entries(selectedItem.stats).map(([k, v]) => (
                                        <div key={k} className="flex justify-between border-b border-[#333]">
                                            <span className="capitalize text-[#888]">{k.replace('Pct', '%').replace('critChance', 'Crit')}</span>
                                            <span className="text-white font-bold">{v}</span>
                                        </div>
                                    ))}
                                </div>
                                {selectedItem.description && (
                                    <div className="mt-4 text-xs text-[#aaa] italic p-2 bg-[#111] border border-[#333]">
                                        {selectedItem.description}
                                    </div>
                                )}
                            </div>

                            {!selectedItem.isConsumable && (
                                <div>
                                    <div className="text-xs font-bold text-[#666] uppercase mb-2">Components</div>
                                    <div className="bg-[#111] border border-[#333] p-2">
                                        {renderRecipeTree(selectedItem)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-[#444]">
                        Select an item...
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
