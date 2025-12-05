
import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { PixelHeroIcon } from './PixelHeroIcon';

interface Props {
  messages: ChatMessage[];
}

export const ChatWidget: React.FC<Props> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isSystemIcon = (icon: string) => icon === '⚔️' || icon === '💀';

  return (
    <div className="h-48 bg-[#000]/90 p-2 flex flex-col z-30 shrink-0 border-t-4 border-[#333] relative">
        <div className="flex-1 overflow-y-auto space-y-1 font-pixel-text text-sm custom-scrollbar pr-[230px]">
            {messages.length === 0 && <div className="text-[#444] italic">&gt; Welcome to Dota 2 Jungle Simulator...</div>}
            {messages.map(msg => (
                <div key={msg.id} className="flex items-start gap-2 leading-tight">
                    {/* Hero Icon */}
                    {msg.heroIcon ? (
                        <div className="w-5 h-5 bg-[#111] flex items-center justify-center shrink-0 border border-[#333]">
                            {isSystemIcon(msg.heroIcon) ? (
                                <span>{msg.heroIcon}</span>
                            ) : (
                                <PixelHeroIcon name={msg.heroIcon} className="w-full h-full" />
                            )}
                        </div>
                    ) : (
                        <div className="w-5 h-5" />
                    )}
                    
                    {/* Message Body */}
                    <div className="pt-0.5">
                        {msg.type === 'system' ? (
                            <span className="text-[#e2d096]">
                                {isSystemIcon(msg.heroIcon || '') ? (
                                    <>
                                       <span className="text-[#ff3c28] mr-1">{msg.sender}</span>
                                       <span className="text-[#888]">{msg.content}</span>
                                    </>
                                ) : (
                                    <>{msg.sender} {msg.content}</>
                                )}
                            </span>
                        ) : (
                            <>
                                <span className={`font-bold ${msg.type === 'radiant' ? 'text-[#37d63e]' : 'text-[#ff3c28]'}`}>
                                    {msg.sender}:
                                </span>
                                <span className="text-[#ccc] ml-1">{msg.content}</span>
                            </>
                        )}
                    </div>
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
        
        {/* Input Placeholder */}
        <div className="mt-1 bg-[#111] border border-[#333] p-1 flex items-center w-[calc(100%-230px)]">
            <span className="text-[#666] text-xs font-pixel-text">&gt; Press ENTER to chat...</span>
        </div>
    </div>
  );
};
