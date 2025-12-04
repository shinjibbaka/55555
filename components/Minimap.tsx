
import React from 'react';
import { FakeHero } from '../types';
import { PixelHeroIcon } from './PixelHeroIcon';

interface Props {
  radiantTeam: FakeHero[];
  direTeam: FakeHero[];
}

export const Minimap: React.FC<Props> = ({ radiantTeam, direTeam }) => {
  // Coordinates for buildings (0-100 scale)
  const radiantBuildings = [
      { type: 't1', x: 12, y: 55 }, { type: 't2', x: 12, y: 72 }, { type: 't3', x: 12, y: 82 }, 
      { type: 'rax', x: 10, y: 86 }, { type: 'rax', x: 14, y: 86 },
      { type: 't1', x: 42, y: 62 }, { type: 't2', x: 32, y: 72 }, { type: 't3', x: 24, y: 80 },
      { type: 'rax', x: 20, y: 83 }, { type: 'rax', x: 23, y: 86 },
      { type: 't1', x: 55, y: 88 }, { type: 't2', x: 35, y: 88 }, { type: 't3', x: 22, y: 88 },
      { type: 'rax', x: 18, y: 92 }, { type: 'rax', x: 18, y: 86 },
      { type: 't4', x: 16, y: 92 }, { type: 't4', x: 18, y: 90 },
      { type: 'ancient', x: 8, y: 94 }
  ];

  const direBuildings = [
      { type: 't1', x: 45, y: 12 }, { type: 't2', x: 65, y: 12 }, { type: 't3', x: 78, y: 12 },
      { type: 'rax', x: 82, y: 10 }, { type: 'rax', x: 82, y: 14 },
      { type: 't1', x: 58, y: 38 }, { type: 't2', x: 68, y: 28 }, { type: 't3', x: 76, y: 20 },
      { type: 'rax', x: 79, y: 18 }, { type: 'rax', x: 76, y: 16 },
      { type: 't1', x: 88, y: 45 }, { type: 't2', x: 88, y: 28 }, { type: 't3', x: 88, y: 18 },
      { type: 'rax', x: 92, y: 16 }, { type: 'rax', x: 86, y: 16 },
      { type: 't4', x: 84, y: 8 }, { type: 't4', x: 82, y: 10 },
      { type: 'ancient', x: 92, y: 6 }
  ];

  return (
    <div className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] bg-[#000] border-4 border-[#333] relative shadow-[4px_4px_0_#000] overflow-hidden select-none group">
        
        {/* --- MAP SVG LAYER --- */}
        <svg viewBox="0 0 100 100" className="w-full h-full bg-[#1e231e] pixel-art">
            {/* Terrain Base */}
            <rect x="0" y="0" width="100" height="100" fill="#1e231e" /> 
            <path d="M0,100 L100,0 L100,100 Z" fill="#2d2222" /> 

            {/* River */}
            <path d="M10,25 Q35,45 50,50 T90,75" stroke="#3b82f6" strokeWidth="8" fill="none" opacity="0.3" />
            
            {/* Bases */}
            <path d="M0,100 L0,70 Q10,70 30,100 Z" fill="#2d382a" />
            <path d="M100,0 L70,0 Q70,10 100,30 Z" fill="#382a2a" />

            {/* Lanes */}
            <path d="M12,88 L12,12 L88,12" stroke="#444" strokeWidth="4" fill="none" opacity="0.3" /> 
            <path d="M20,80 L80,20" stroke="#444" strokeWidth="4" fill="none" opacity="0.3" /> 
            <path d="M12,88 L88,88 L88,12" stroke="#444" strokeWidth="4" fill="none" opacity="0.3" /> 
            
            {/* Roshan */}
            <rect x="65" y="38" width="6" height="6" fill="#111" stroke="#333" strokeWidth="0.5" />

            {/* --- BUILDINGS --- */}
            {radiantBuildings.map((b, i) => (
                <rect key={`rad-${i}`} x={b.x - 1} y={b.y - 1} width="2" height="2" fill={b.type === 'rax' ? '#2e5c32' : '#37d63e'} stroke="black" strokeWidth="0.2" />
            ))}
            {direBuildings.map((b, i) => (
                <rect key={`dire-${i}`} x={b.x - 1} y={b.y - 1} width="2" height="2" fill={b.type === 'rax' ? '#5c2e2e' : '#ff3c28'} stroke="black" strokeWidth="0.2" />
            ))}

            {/* --- HEROES --- */}
            {radiantTeam.map(h => (
                <g key={h.id} transform={`translate(${h.x}, ${h.y})`}>
                     <rect x="-4" y="-4" width="8" height="8" fill="#000" />
                     <rect x="-3" y="-3" width="6" height="6" fill="#37d63e" />
                     <g transform="translate(-2.5, -2.5)"><foreignObject width="5" height="5"><div className="w-full h-full flex items-center justify-center"><PixelHeroIcon name={h.name} className="w-full h-full" /></div></foreignObject></g>
                     {h.id === 'p1' && <rect x="-5" y="-5" width="10" height="10" stroke="white" strokeWidth="0.5" fill="none" className="animate-pulse" />}
                </g>
            ))}

            {direTeam.map(h => (
                <g key={h.id} transform={`translate(${h.x}, ${h.y})`}>
                     <rect x="-4" y="-4" width="8" height="8" fill="#000" />
                     <rect x="-3" y="-3" width="6" height="6" fill="#ff3c28" />
                     <g transform="translate(-2.5, -2.5)"><foreignObject width="5" height="5"><div className="w-full h-full flex items-center justify-center"><PixelHeroIcon name={h.name} className="w-full h-full" /></div></foreignObject></g>
                </g>
            ))}
        </svg>
    </div>
  );
};
