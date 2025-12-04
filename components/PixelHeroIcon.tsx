
import React from 'react';

interface Props {
  name: string;
  className?: string;
}

export const PixelHeroIcon: React.FC<Props> = ({ name, className = "" }) => {
  const renderContent = () => {
    switch (name) {
      case 'Anti-Mage':
        return (
          <>
            <rect x="2" y="1" width="4" height="6" fill="#ffedd5" />
            <rect x="2" y="2" width="4" height="1" fill="#1e1b4b" />
            <path d="M3,0 h2 v2 h-2 Z" fill="#f3f4f6" />
            <rect x="1" y="4" width="6" height="4" fill="#1e1b4b" opacity="0.0" />
            <rect x="1" y="4" width="1" height="4" fill="#a855f7" /> {/* Glaive L */}
            <rect x="6" y="4" width="1" height="4" fill="#a855f7" /> {/* Glaive R */}
          </>
        );
      case 'Pudge':
        return (
          <>
            <rect x="1" y="1" width="6" height="6" fill="#fca5a5" /> {/* Skin */}
            <rect x="2" y="1" width="4" height="1" fill="#1f2937" /> {/* Hair */}
            <rect x="2" y="4" width="4" height="2" fill="#991b1b" /> {/* Blood/Mouth */}
            <rect x="1" y="3" width="1" height="1" fill="#fff" /> {/* Stitch */}
            <rect x="6" y="2" width="1" height="3" fill="#4ade80" opacity="0.5" /> {/* Rot */}
          </>
        );
      case 'Juggernaut':
        return (
          <>
            <rect x="1" y="1" width="6" height="6" fill="#f97316" /> {/* Mask */}
            <rect x="2" y="3" width="1" height="2" fill="#fff" /> {/* Eye slit */}
            <rect x="5" y="3" width="1" height="2" fill="#fff" />
            <rect x="3" y="1" width="2" height="6" fill="#c2410c" opacity="0.3" /> {/* Mask detail */}
            <rect x="0" y="0" width="8" height="2" fill="#fff" opacity="0.2" /> {/* Top light */}
          </>
        );
      case 'Crystal Maiden':
        return (
          <>
             <rect x="2" y="2" width="4" height="4" fill="#ffedd5" /> {/* Face */}
             <rect x="1" y="1" width="6" height="2" fill="#fef08a" /> {/* Hair */}
             <rect x="0" y="2" width="2" height="6" fill="#fef08a" />
             <rect x="6" y="2" width="2" height="6" fill="#fef08a" />
             <rect x="1" y="0" width="6" height="2" fill="#3b82f6" opacity="0.8" /> {/* Hood */}
          </>
        );
      case 'Invoker':
        return (
          <>
             <rect x="2" y="2" width="4" height="4" fill="#ffedd5" />
             <rect x="1" y="0" width="6" height="2" fill="#fbbf24" /> {/* Hair */}
             <rect x="0" y="0" width="2" height="2" fill="#facc15" /> {/* Quas */}
             <rect x="6" y="0" width="2" height="2" fill="#ec4899" /> {/* Wex */}
             <rect x="3" y="-1" width="2" height="2" fill="#3b82f6" /> {/* Exort */}
             <rect x="2" y="6" width="4" height="2" fill="#b91c1c" /> {/* Cape */}
          </>
        );
      case 'Sniper':
        return (
          <>
             <rect x="2" y="2" width="4" height="4" fill="#ffedd5" />
             <rect x="1" y="1" width="6" height="2" fill="#4b5563" /> {/* Goggles */}
             <rect x="2" y="1" width="1" height="1" fill="#38bdf8" />
             <rect x="5" y="1" width="1" height="1" fill="#38bdf8" />
             <rect x="1" y="5" width="6" height="3" fill="#fff" /> {/* Beard */}
             <rect x="2" y="0" width="4" height="1" fill="#78350f" /> {/* Hat */}
          </>
        );
      case 'Shadow Fiend':
        return (
          <>
             <rect x="1" y="0" width="6" height="8" fill="#111" />
             <rect x="2" y="2" width="1" height="1" fill="#ef4444" /> {/* Eye */}
             <rect x="5" y="2" width="1" height="1" fill="#ef4444" /> {/* Eye */}
             <rect x="0" y="0" width="8" height="8" fill="#000" opacity="0.3" /> {/* Smoke */}
             <rect x="2" y="4" width="4" height="2" fill="#ef4444" opacity="0.5" /> {/* Chest glow */}
          </>
        );
      case 'Axe':
        return (
          <>
             <rect x="1" y="2" width="6" height="5" fill="#ef4444" /> {/* Skin */}
             <rect x="2" y="0" width="4" height="2" fill="#4b5563" /> {/* Helmet */}
             <rect x="3" y="2" width="2" height="1" fill="#111" /> {/* Nose guard */}
             <rect x="3" y="4" width="2" height="1" fill="#111" /> {/* Mouth */}
          </>
        );
      case 'Zeus':
        return (
          <>
             <rect x="2" y="2" width="4" height="4" fill="#fdba74" />
             <rect x="1" y="0" width="6" height="3" fill="#fff" /> {/* Hair */}
             <rect x="1" y="5" width="6" height="3" fill="#fff" /> {/* Beard */}
             <rect x="2" y="3" width="4" height="1" fill="#fff" opacity="0.5" /> {/* Eyes */}
          </>
        );
      case 'Lion':
        return (
          <>
             <rect x="2" y="2" width="4" height="5" fill="#ca8a04" /> {/* Face */}
             <rect x="1" y="0" width="6" height="2" fill="#fca5a5" /> {/* Brain/Spikes */}
             <rect x="2" y="6" width="4" height="2" fill="#b91c1c" /> {/* Neck */}
             <rect x="2" y="3" width="1" height="1" fill="#bef264" /> {/* Eye */}
             <rect x="5" y="3" width="1" height="1" fill="#bef264" /> {/* Eye */}
          </>
        );
      case 'Techies':
        return (
          <>
             <rect x="1" y="2" width="3" height="4" fill="#facc15" /> {/* Goblin 1 */}
             <rect x="4" y="1" width="3" height="5" fill="#fde047" /> {/* Goblin 2 */}
             <rect x="1" y="6" width="6" height="2" fill="#9ca3af" /> {/* Cart */}
             <rect x="3" y="0" width="1" height="2" fill="#ef4444" /> {/* Fuse */}
          </>
        );
      case 'Faceless Void':
        return (
          <>
             <rect x="1" y="1" width="6" height="6" fill="#581c87" /> {/* Purple Skin */}
             <rect x="0" y="1" width="8" height="2" fill="#7e22ce" /> {/* Hammer head */}
             <rect x="3" y="4" width="2" height="3" fill="#a855f7" opacity="0.5" /> {/* Mouth area */}
          </>
        );
      case 'Phantom Assassin':
        return (
          <>
             <rect x="2" y="2" width="4" height="4" fill="#a5f3fc" opacity="0.8" /> {/* Skin */}
             <rect x="1" y="0" width="6" height="3" fill="#1e3a8a" /> {/* Helm */}
             <rect x="3" y="3" width="2" height="1" fill="#fff" /> {/* Eyes */}
             <rect x="0" y="2" width="8" height="6" fill="#1e3a8a" opacity="0.3" /> {/* Blur */}
          </>
        );
      case 'Sven':
        return (
          <>
             <rect x="2" y="1" width="4" height="6" fill="#1d4ed8" /> {/* Blue Armor */}
             <rect x="1" y="0" width="6" height="3" fill="#1e3a8a" /> {/* Helm Top */}
             <rect x="3" y="2" width="2" height="4" fill="#93c5fd" /> {/* Visor */}
          </>
        );
      case 'Earthshaker':
        return (
          <>
             <rect x="1" y="2" width="6" height="5" fill="#78350f" /> {/* Brown Face */}
             <rect x="2" y="1" width="4" height="2" fill="#fef3c7" /> {/* Mane */}
             <rect x="0" y="3" width="8" height="2" fill="#fef3c7" opacity="0.3" /> {/* Mane side */}
             <rect x="2" y="3" width="1" height="1" fill="#fbbf24" /> {/* Eye */}
             <rect x="5" y="3" width="1" height="1" fill="#fbbf24" /> {/* Eye */}
          </>
        );
      default:
        // Generic Creep Face
        return (
          <>
            <rect x="1" y="1" width="6" height="6" fill="#666" />
            <rect x="2" y="2" width="1" height="1" fill="#000" />
            <rect x="5" y="2" width="1" height="1" fill="#000" />
          </>
        );
    }
  };

  return (
    <div className={`pixel-art ${className}`}>
      <svg viewBox="0 0 8 8" className="w-full h-full overflow-visible" shapeRendering="crispEdges">
         {renderContent()}
      </svg>
    </div>
  );
};
