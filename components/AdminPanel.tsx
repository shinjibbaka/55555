
import React, { useState } from 'react';
import { X, Shield, DollarSign, ChevronsUp, Heart, Skull, Zap, Star } from 'lucide-react';

interface Props {
    adminActions: {
        addGold: () => void;
        levelUp: () => void;
        heal: () => void;
        killWave: () => void;
        toggleGodMode: () => void;
        toggleWtfMode: () => void;
        addTalentPoints: () => void;
    };
    godMode: boolean;
}

export const AdminPanel: React.FC<Props> = ({ adminActions, godMode }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-50 bg-[#331111] text-red-500 hover:text-white px-4 py-2 border-2 border-red-900 font-pixel-title text-xs shadow-[4px_4px_0_#000]"
            >
                DEBUG
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm font-pixel-text">
            <div className="bg-[#111] border-4 border-red-900 p-6 shadow-[8px_8px_0_#000] max-w-sm w-full">
                <div className="flex justify-between items-center mb-4 border-b-2 border-red-900/50 pb-2">
                    <h3 className="text-red-500 font-bold font-pixel-title uppercase flex items-center gap-2">
                        <Shield size={16} /> Admin Console
                    </h3>
                    <button onClick={() => setIsOpen(false)} className="text-[#666] hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={adminActions.addGold} className="bg-[#222] hover:bg-[#332200] border-2 border-[#444] hover:border-yellow-500 p-2 flex flex-col items-center gap-1 pixel-btn">
                        <DollarSign size={20} className="text-yellow-500" />
                        <span className="text-xs font-bold text-[#ccc]">+9999 Gold</span>
                    </button>
                    
                    <button onClick={adminActions.levelUp} className="bg-[#222] hover:bg-[#001133] border-2 border-[#444] hover:border-blue-500 p-2 flex flex-col items-center gap-1 pixel-btn">
                        <ChevronsUp size={20} className="text-blue-500" />
                        <span className="text-xs font-bold text-[#ccc]">+1 Level</span>
                    </button>
                    
                    <button onClick={adminActions.heal} className="bg-[#222] hover:bg-[#002200] border-2 border-[#444] hover:border-green-500 p-2 flex flex-col items-center gap-1 pixel-btn">
                        <Heart size={20} className="text-green-500" />
                        <span className="text-xs font-bold text-[#ccc]">Full Heal</span>
                    </button>
                    
                    <button onClick={adminActions.killWave} className="bg-[#222] hover:bg-[#330000] border-2 border-[#444] hover:border-red-500 p-2 flex flex-col items-center gap-1 pixel-btn">
                        <Skull size={20} className="text-red-500" />
                        <span className="text-xs font-bold text-[#ccc]">Kill Wave</span>
                    </button>

                    <button onClick={adminActions.addTalentPoints} className="bg-[#222] hover:bg-[#220033] border-2 border-[#444] hover:border-purple-500 p-2 flex flex-col items-center gap-1 pixel-btn">
                        <Star size={20} className="text-purple-500" />
                        <span className="text-xs font-bold text-[#ccc]">+100 TP</span>
                    </button>
                    
                    <button onClick={adminActions.toggleGodMode} className={`col-span-1 p-2 flex items-center justify-center gap-2 border-2 pixel-btn ${godMode ? 'bg-[#002200] border-green-500 text-green-400' : 'bg-[#222] border-[#444] text-[#666]'}`}>
                        <Shield size={16} fill={godMode ? "currentColor" : "none"} />
                        <span className="text-xs font-bold">GOD MODE</span>
                    </button>

                    <button onClick={adminActions.toggleWtfMode} className="col-span-2 p-2 flex items-center justify-center gap-2 border-2 bg-[#111] border-blue-900 text-blue-400 hover:bg-[#001133] pixel-btn">
                        <Zap size={16} />
                        <span className="text-xs font-bold">WTF MODE</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
