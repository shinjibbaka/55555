
export enum StatType {
  STR = 'Strength',
  AGI = 'Agility',
  INT = 'Intelligence'
}

export interface Stats {
  strength: number;
  agility: number;
  intelligence: number;
  damage: number;
  armor: number;
  attackSpeed: number; // Attacks per second
  hpMax: number;
  hpRegen: number;
  manaMax: number;
  manaRegen: number;
  cleavePct: number; // 0-1 multiplier for splash damage
  evasion: number; // 0-1 chance to dodge
  moveSpeed: number;
  armorCorruption: number; // Desolator effect
  critChance: number; // 0-1
  critDamage: number; // multiplier (e.g. 1.5 = 150%)
  
  // New Mechanics
  trueStrike?: boolean;
  chainLightning?: [number, number]; // [chance, damage]
  hpRegenPct?: number; // % of Max HP per sec
  lifesteal?: number; // 0-1 multiplier (heal fraction of damage dealt)
  
  // Economy Stats
  goldGainPct?: number; // Multiplier (e.g. 0.1 = +10% gold)
  xpGainPct?: number;   // Multiplier (e.g. 0.1 = +10% xp)
  shopDiscountPct?: number; // 0-1 (0.1 = 10% off)

  // Prestige Stats
  illusionDamageMult?: number; // Multiplier for illusion damage (base is usually 0.33)
  illusionDurationMult?: number; // Multiplier for duration
  manaBurnMult?: number; // Multiplier for mana burn
}

export interface Item {
  id: string;
  name: string;
  cost: number;
  stats: Partial<Stats>;
  isRecipe?: boolean;
  isConsumable?: boolean; // NEW: Items that are consumed on buy
  components?: string[]; // IDs of items required to make this
  icon: string;
  color: string;
  description?: string;
  category: 'basic' | 'upgrade' | 'consumable';
  cooldown?: number; // Seconds
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  description: string;
  lore?: string;
  color: string;
  type: 'Passive' | 'Active';
  cooldown: number; // in seconds
  manaCost: number;
  lastCast: number; // timestamp
  params?: {
    [key: string]: number[]; // Array of values per level
  };
}

export interface Talent {
  id: string;
  name: string;
  stats?: Partial<Stats>;
  skillMod?: { skillId: string, prop: 'cooldown' | 'manaCost' | 'damageMult', value: number };
}

// --- NEW PRESTIGE TYPES ---
export interface TalentNode {
  id: string;
  name: string;
  description: string;
  row: number; // Y Axis: Positive = Up, Negative = Down
  col: number; // X Axis: Positive = Right, Negative = Left
  cost: number;
  icon: string;
  stats?: Partial<Stats>; // Permanent stats
  skillMod?: { skillId: string, prop: string, value: number };
  parentId?: string; // Dependency
  mutexId?: string; // If you pick this, you can't pick the mutexId node
  branch: 'economy' | 'survival' | 'offense' | 'ability' | 'core';
}

export interface PrestigeData {
  points: number;
  totalPointsEarned: number;
  rebirthCount: number;
  unlockedNodes: string[]; // IDs of unlocked talent nodes
}

export interface Rune {
  id: string;
  type: 'DD' | 'HASTE' | 'REGEN';
  x: number;
  y: number;
  spawnTime: number;
  expiresAt: number;
}

export interface HeroState {
  level: number;
  xp: number;
  gold: number;
  hp: number;
  mana: number;
  skillPoints: number;
  skills: Skill[];
  inventory: string[]; // Item IDs (Max 6)
  backpack: string[]; // Item IDs (Max 3, inactive)
  itemCooldowns: Record<string, number>; // itemId -> lastProcTime
  baseStats: Stats;
  isDead: boolean;
  respawnTimer: number;
  lastAttackTime: number; // timestamp for animation
  buffs: {
    blinkUntil: number;
    hasteUntil: number;
    ddUntil: number;
    regenUntil: number;
  };
  x: number;
  y: number;
  
  // Features
  talents: Record<number, string>; // In-run talents (Level 10/15/20/25)
  prestige: PrestigeData; // Meta-progression
  autoCast: boolean;
  autoProgress: boolean;
  highestWave: number;
  godMode: boolean;
  wtfMode: boolean;
  
  // Infinite Scaling
  consumedTomes: {
      str: number;
      agi: number;
      int: number;
  };
}

export interface Illusion {
  id: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  damage: number;
  attackSpeed: number;
  spawnTime: number;
  duration: number;
  lastAttackTime: number;
  maxDuration: number; 
  incomingDmgMult: number;
}

export interface Enemy {
  id: string;
  name: string;
  type: 'melee' | 'ranged' | 'healer' | 'boss' | 'bonus' | 'elite';
  level: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  damage: number;
  armor: number; // New Stat
  attackSpeed: number; // Attacks per second
  xpReward: number;
  goldReward: number;
  range: number;
  x: number; // 0-100%
  y: number; // 0-100%
  lastAttack: number;
  color: string;
  stunnedUntil: number; // timestamp
  targetId: string | null; // 'hero' or illusion ID
  
  // Elite Mechanics
  specialAbility?: 'bash' | 'evasion' | 'lifesteal';
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  timestamp: number;
  isCrit?: boolean;
}

export interface LogEntry {
  id: string;
  message: string;
  color: string;
}

// --- New Types for Dashboard ---

export interface FakeHero {
  id: string;
  name: string;
  nickname: string;
  avatar: string; // Emoji or URL
  isDead: boolean;
  respawnTimer: number; // seconds
  color: string; // for avatar bg
  
  // Minimap Props
  x: number; // 0-100 map coord
  y: number; // 0-100 map coord
  lane: 'top' | 'mid' | 'bot';
}

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  type: 'radiant' | 'dire' | 'system';
  heroIcon?: string;
}
