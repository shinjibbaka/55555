
import React from 'react';

interface Props {
  id: string;
  className?: string;
}

export const PixelItemIcon: React.FC<Props> = ({ id, className = "" }) => {
  // Helper for Recipes (Scrolls)
  if (id.startsWith('recipe_')) {
    return (
      <svg viewBox="0 0 20 20" className={`w-full h-full pixel-art ${className}`} shapeRendering="crispEdges">
         <rect x="4" y="2" width="12" height="16" fill="#fcd34d" /> {/* Paper */}
         <rect x="5" y="4" width="10" height="1" fill="#b45309" opacity="0.5" />
         <rect x="5" y="7" width="8" height="1" fill="#b45309" opacity="0.5" />
         <rect x="5" y="10" width="10" height="1" fill="#b45309" opacity="0.5" />
         <rect x="8" y="14" width="4" height="4" fill="#ef4444" opacity="0.8" /> {/* Seal */}
         <rect x="4" y="2" width="1" height="16" fill="#d97706" /> {/* Shadow L */}
         <rect x="15" y="2" width="1" height="16" fill="#d97706" /> {/* Shadow R */}
      </svg>
    );
  }

  // Helper for Tomes
  if (id.startsWith('tome_')) {
      const color = id === 'tome_str' ? '#ef4444' : (id === 'tome_agi' ? '#22c55e' : '#3b82f6');
      return (
        <svg viewBox="0 0 20 20" className={`w-full h-full pixel-art ${className}`} shapeRendering="crispEdges">
            <rect x="4" y="3" width="12" height="14" fill={color} />
            <rect x="14" y="3" width="2" height="14" fill="#000" opacity="0.2" /> {/* Spine */}
            <rect x="6" y="5" width="6" height="2" fill="#fff" opacity="0.5" /> {/* Title */}
            <rect x="4" y="3" width="12" height="1" fill="#fff" opacity="0.3" /> {/* Highlight */}
            <rect x="8" y="10" width="4" height="4" fill="#fff" /> {/* Symbol */}
        </svg>
      );
  }

  const renderContent = () => {
    switch (id) {
      // --- COMPONENTS ---
      case 'mithril_hammer':
        return (
          <>
            <rect x="2" y="2" width="8" height="6" fill="#9ca3af" /> {/* Head */}
            <rect x="5" y="8" width="2" height="10" fill="#78350f" /> {/* Handle */}
            <rect x="2" y="2" width="1" height="6" fill="#fff" opacity="0.5" />
          </>
        );
      case 'blight_stone':
        return (
          <>
             <rect x="5" y="5" width="10" height="10" rx="2" fill="#3f3f46" />
             <rect x="7" y="7" width="6" height="6" fill="#7f1d1d" />
             <rect x="6" y="6" width="2" height="2" fill="#ef4444" opacity="0.5" />
          </>
        );
      case 'claymore':
        return (
          <>
             <rect x="9" y="1" width="2" height="12" fill="#e5e7eb" /> {/* Blade */}
             <rect x="6" y="13" width="8" height="2" fill="#facc15" /> {/* Guard */}
             <rect x="9" y="15" width="2" height="4" fill="#78350f" /> {/* Hilt */}
          </>
        );
      case 'talisman_evasion':
        return (
          <>
             <path d="M10,2 L16,8 L10,18 L4,8 Z" fill="#22d3ee" opacity="0.8" />
             <rect x="8" y="8" width="4" height="4" fill="#fff" />
          </>
        );
      case 'eaglesong':
        return (
          <>
             <path d="M14,2 Q18,6 16,12 Q14,18 4,18" stroke="#84cc16" strokeWidth="3" fill="none" />
             <path d="M14,2 Q18,6 16,12 Q14,18 4,18" stroke="#a3e635" strokeWidth="1" fill="none" />
          </>
        );
      case 'belt_strength':
        return (
          <>
             <rect x="2" y="6" width="16" height="8" fill="#78350f" />
             <rect x="8" y="6" width="4" height="8" fill="#b45309" /> {/* Buckle */}
             <rect x="9" y="7" width="2" height="6" fill="#fcd34d" />
          </>
        );
      case 'band_elvenskin':
        return (
            <>
                <path d="M4,10 Q10,18 16,10" stroke="#166534" strokeWidth="4" fill="none" />
                <rect x="8" y="12" width="4" height="4" fill="#22c55e" />
            </>
        );
      case 'ogre_axe':
        return (
            <>
                <rect x="8" y="8" width="2" height="10" fill="#78350f" /> {/* Handle */}
                <path d="M8,4 L14,2 L16,10 L8,8 Z" fill="#b91c1c" /> {/* Blade */}
                <rect x="14" y="2" width="2" height="8" fill="#fff" opacity="0.2" />
            </>
        );
      case 'blade_alacrity':
        return (
            <>
                <path d="M4,14 L14,4 L16,6 L6,16 Z" fill="#22d3ee" />
                <rect x="4" y="14" width="4" height="4" fill="#0e7490" />
            </>
        );
      case 'ultimate_orb':
        return (
            <>
                <circle cx="10" cy="10" r="7" fill="#fff" />
                <circle cx="10" cy="10" r="4" fill="#e2e8f0" />
                <circle cx="10" cy="10" r="7" stroke="#94a3b8" strokeWidth="1" fill="none" />
            </>
        );
      case 'broadsword':
        return (
            <>
                <rect x="8" y="2" width="4" height="10" fill="#9ca3af" />
                <rect x="6" y="12" width="8" height="2" fill="#4b5563" />
                <rect x="9" y="14" width="2" height="4" fill="#78350f" />
            </>
        );
      case 'blades_attack':
         return (
             <>
                <rect x="4" y="4" width="4" height="8" fill="#fbbf24" opacity="0.8" />
                <rect x="12" y="4" width="4" height="8" fill="#fbbf24" opacity="0.8" />
             </>
         );
      case 'demon_edge':
          return (
              <>
                  <path d="M10,2 L14,14 L10,18 L6,14 Z" fill="#22d3ee" />
                  <rect x="9" y="2" width="2" height="16" fill="#ec4899" opacity="0.3" />
              </>
          );
      case 'boots_speed':
          return (
              <>
                  <path d="M6,4 L10,4 L10,12 L16,12 L16,16 L6,16 Z" fill="#92400e" />
                  <rect x="6" y="4" width="4" height="2" fill="#b45309" />
              </>
          );
      case 'gloves_haste':
          return (
              <>
                  <rect x="4" y="4" width="12" height="12" rx="2" fill="#166534" />
                  <rect x="4" y="4" width="3" height="4" fill="#fcd34d" />
                  <rect x="8" y="4" width="3" height="4" fill="#fcd34d" />
                  <rect x="12" y="4" width="3" height="4" fill="#fcd34d" />
              </>
          );
      case 'javelin':
          return (
              <>
                  <line x1="2" y1="18" x2="18" y2="2" stroke="#cbd5e1" strokeWidth="2" />
                  <path d="M14,2 L18,2 L18,6 Z" fill="#64748b" />
              </>
          );
      case 'hyperstone':
          return (
              <>
                  <circle cx="10" cy="10" r="7" fill="#15803d" />
                  <circle cx="10" cy="10" r="3" fill="#22c55e" className="animate-pulse" />
              </>
          );
      case 'vitality_booster':
          return (
              <>
                  <circle cx="10" cy="10" r="7" fill="#b91c1c" />
                  <path d="M7,7 L13,7 L10,13 Z" fill="#fca5a5" />
              </>
          );
      case 'reaver':
          return (
              <>
                  <path d="M2,6 L10,14 L18,6" stroke="#7f1d1d" strokeWidth="4" fill="none" />
                  <rect x="8" y="12" width="4" height="6" fill="#b91c1c" />
              </>
          );

      // --- UPGRADES ---
      case 'power_treads':
          return (
              <>
                  <path d="M4,4 L10,4 L10,12 L16,12 L16,16 L4,16 Z" fill="#78350f" />
                  <rect x="4" y="4" width="6" height="4" fill="#b45309" />
                  <rect x="12" y="12" width="2" height="4" fill="#ef4444" /> {/* Str */}
                  <rect x="14" y="12" width="2" height="4" fill="#22c55e" /> {/* Agi */}
              </>
          );
      case 'desolator':
          return (
              <>
                  <path d="M16,4 Q4,4 4,16" stroke="#b91c1c" strokeWidth="3" fill="none" />
                  <path d="M16,4 L12,18" stroke="#7f1d1d" strokeWidth="2" />
                  <circle cx="10" cy="8" r="2" fill="#ef4444" className="animate-pulse" />
              </>
          );
      case 'butterfly':
          return (
              <>
                  <path d="M10,18 L16,2 L12,2 Z" fill="#22c55e" /> {/* Blade */}
                  <path d="M10,18 L4,6" stroke="#15803d" strokeWidth="2" /> {/* Guard */}
                  <path d="M10,18 L16,10" stroke="#86efac" strokeWidth="1" />
              </>
          );
      case 'sange':
          return (
              <>
                  <path d="M10,18 L16,4 L12,4 Z" fill="#b91c1c" />
                  <rect x="9" y="14" width="2" height="4" fill="#7f1d1d" />
              </>
          );
      case 'yasha':
          return (
              <>
                  <path d="M8,18 L14,2 L12,2 Z" fill="#22c55e" />
                  <rect x="7" y="14" width="2" height="4" fill="#14532d" />
              </>
          );
      case 'sange_yasha':
          return (
              <>
                   <path d="M8,18 L12,4 L10,4 Z" fill="#b91c1c" /> {/* Sange */}
                   <path d="M12,18 L16,4 L14,4 Z" fill="#22c55e" /> {/* Yasha */}
                   <circle cx="10" cy="11" r="3" fill="#a855f7" opacity="0.5" />
              </>
          );
      case 'manta':
          return (
              <>
                  <path d="M6,16 L2,4 L6,4 L8,10 Z" fill="#60a5fa" /> {/* Axe L */}
                  <path d="M14,16 L18,4 L14,4 L12,10 Z" fill="#60a5fa" /> {/* Axe R */}
                  <rect x="8" y="12" width="4" height="2" fill="#fff" />
              </>
          );
      case 'crystalys':
          return (
              <>
                  <path d="M4,16 L16,4" stroke="#ec4899" strokeWidth="3" />
                  <path d="M4,4 L16,16" stroke="#fbcfe8" strokeWidth="1" />
              </>
          );
      case 'daedalus':
          return (
              <>
                   <path d="M2,10 Q10,2 18,10" stroke="#b91c1c" strokeWidth="2" fill="none" /> {/* Bow */}
                   <line x1="10" y1="4" x2="10" y2="16" stroke="#fbbf24" strokeWidth="2" /> {/* Bolt */}
                   <rect x="8" y="12" width="4" height="4" fill="#7f1d1d" />
              </>
          );
      case 'maelstrom':
          return (
              <>
                  <rect x="8" y="6" width="4" height="8" fill="#60a5fa" />
                  <path d="M6,4 L14,4 L10,16 Z" fill="#2563eb" opacity="0.5" />
                  <path d="M4,8 L16,12" stroke="#fff" strokeWidth="1" className="animate-pulse" />
              </>
          );
      case 'mjollnir':
          return (
              <>
                  <rect x="6" y="4" width="8" height="6" fill="#1d4ed8" />
                  <rect x="9" y="10" width="2" height="8" fill="#444" />
                  <path d="M2,2 L8,8 M18,2 L12,8" stroke="#60a5fa" strokeWidth="2" className="animate-pulse" />
              </>
          );
      case 'mkb':
          return (
              <>
                  <rect x="9" y="2" width="2" height="16" fill="#facc15" />
                  <rect x="8" y="2" width="4" height="2" fill="#ca8a04" />
                  <rect x="8" y="16" width="4" height="2" fill="#ca8a04" />
              </>
          );
      case 'heart':
          return (
              <>
                  <path d="M10,18 L4,10 Q2,6 6,4 Q10,6 10,8 Q10,6 14,4 Q18,6 16,10 Z" fill="#b91c1c" />
                  <path d="M6,6 L8,8" stroke="#fca5a5" strokeWidth="1" />
              </>
          );

      default:
        // Generic Fallback
        return (
            <rect x="4" y="4" width="12" height="12" fill="#333" />
        );
    }
  };

  return (
    <svg viewBox="0 0 20 20" className={`w-full h-full pixel-art overflow-visible ${className}`} shapeRendering="crispEdges">
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
             <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
             <feOffset dx="0" dy="1" result="offsetblur" />
             <feComponentTransfer>
               <feFuncA type="linear" slope="0.5" />
             </feComponentTransfer>
             <feMerge>
               <feMergeNode />
               <feMergeNode in="SourceGraphic" />
             </feMerge>
        </filter>
        <g filter="url(#dropShadow)">
            {renderContent()}
        </g>
    </svg>
  );
};
