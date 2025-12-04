
import React from 'react';

interface Props {
  id: string;
  className?: string;
}

export const PixelSkillIcon: React.FC<Props> = ({ id, className = "" }) => {
  const renderContent = () => {
    switch (id) {
      case 'manabreak':
        return (
          <>
            {/* Background */}
            <rect x="0" y="0" width="20" height="20" fill="#172554" />
            {/* Mana Orb */}
            <circle cx="10" cy="10" r="6" fill="#2563eb" />
            <circle cx="10" cy="10" r="4" fill="#3b82f6" />
            {/* Shatter Effect */}
            <path d="M4,16 L10,10" stroke="#f472b6" strokeWidth="2" />
            <path d="M10,10 L16,4" stroke="#fff" strokeWidth="2" />
            <path d="M10,10 L14,14" stroke="#db2777" strokeWidth="1" />
            <rect x="9" y="9" width="2" height="2" fill="#fff" className="animate-pulse" />
          </>
        );
      case 'blink':
        return (
          <>
             {/* Background */}
             <rect x="0" y="0" width="20" height="20" fill="#2e1065" />
             {/* Motion Trail */}
             <rect x="2" y="12" width="4" height="2" fill="#a855f7" opacity="0.3" />
             <rect x="4" y="10" width="4" height="2" fill="#a855f7" opacity="0.6" />
             <rect x="6" y="8" width="4" height="2" fill="#a855f7" opacity="0.8" />
             {/* Flash */}
             <path d="M10,6 L14,2 L18,6 L14,10 Z" fill="#e879f9" />
             <rect x="13" y="5" width="2" height="2" fill="#fff" className="animate-pulse" />
             {/* Lines */}
             <line x1="2" y1="18" x2="18" y2="2" stroke="#c084fc" strokeWidth="1" strokeDasharray="2 2" />
          </>
        );
      case 'counterspell':
        return (
          <>
             {/* Background */}
             <rect x="0" y="0" width="20" height="20" fill="#1e1b4b" />
             {/* Shield Base */}
             <path d="M4,4 L16,4 L16,10 Q16,16 10,18 Q4,16 4,10 Z" fill="#312e81" stroke="#4f46e5" strokeWidth="1" />
             {/* Inner Glow */}
             <path d="M6,6 L14,6 L14,10 Q14,14 10,16 Q6,14 6,10 Z" fill="#4338ca" />
             {/* Reflection */}
             <path d="M2,10 L6,10 L8,8" stroke="#fcd34d" strokeWidth="2" />
             <circle cx="8" cy="8" r="1" fill="#fff" className="animate-ping" />
          </>
        );
      case 'manavoid':
        return (
          <>
             {/* Background */}
             <rect x="0" y="0" width="20" height="20" fill="#450a0a" />
             {/* Ground Cracks */}
             <path d="M2,18 L8,12 M18,18 L12,12 M2,2 L8,8 M18,2 L12,8" stroke="#7f1d1d" strokeWidth="1" />
             {/* Energy Burst */}
             <circle cx="10" cy="10" r="5" fill="#c026d3" />
             <circle cx="10" cy="10" r="3" fill="#e879f9" className="animate-pulse" />
             {/* Lightning */}
             <path d="M10,2 L10,6" stroke="#f5d0fe" strokeWidth="2" />
             <path d="M10,14 L10,18" stroke="#f5d0fe" strokeWidth="2" />
             <path d="M2,10 L6,10" stroke="#f5d0fe" strokeWidth="2" />
             <path d="M14,10 L18,10" stroke="#f5d0fe" strokeWidth="2" />
          </>
        );
      default:
        return <rect x="0" y="0" width="20" height="20" fill="#333" />;
    }
  };

  return (
    <svg viewBox="0 0 20 20" className={`w-full h-full pixel-art ${className}`} shapeRendering="crispEdges">
       {renderContent()}
    </svg>
  );
};
