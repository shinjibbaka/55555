import { useState, useEffect, useRef, useCallback } from 'react';
import { HeroState, Enemy, FloatingText, Stats, Item, LogEntry, Illusion, Rune, Talent, Skill, FakeHero, ChatMessage, TalentNode } from '../types';
import { BASE_HERO_STATS, LEVEL_STATS_GAIN, XP_FORMULA, ITEMS, INITIAL_SKILLS, TALENTS, getItemTotalCost, DOTA_HEROES, RU_NICKNAMES, TOXIC_TEAM_MESSAGES, ENEMY_CHAT_MESSAGES, HERO_DEATH_TEAM_MESSAGES, HERO_DEATH_ENEMY_MESSAGES, PRESTIGE_TREE } from '../constants';

const WAVE_DELAY = 500; // Fast spawns!
const RUNE_INTERVAL = 60000;
const BONUS_ROUND_DURATION = 30000;
const SAVE_KEY = 'dota_clicker_release_v1';
const AUTO_SAVE_INTERVAL = 5000; // Save every 5 seconds

// Helper to deep clone skills to prevent mutation of constants
const getInitialSkills = () => JSON.parse(JSON.stringify(INITIAL_SKILLS));

const DEFAULT_HERO_STATE: HeroState = {
    level: 1,
    xp: 0,
    gold: 600,
    hp: 500,
    mana: 200,
    skillPoints: 1,
    skills: getInitialSkills(),
    inventory: [],
    backpack: [], 
    itemCooldowns: {},
    baseStats: BASE_HERO_STATS,
    isDead: false,
    respawnTimer: 0,
    lastAttackTime: 0,
    buffs: { blinkUntil: 0, hasteUntil: 0, ddUntil: 0, regenUntil: 0 },
    x: 20,
    y: 50,
    talents: {},
    prestige: { points: 0, totalPointsEarned: 0, rebirthCount: 0, unlockedNodes: [] },
    autoCast: false,
    autoProgress: true,
    highestWave: 1,
    godMode: false,
    wtfMode: false,
    consumedTomes: { str: 0, agi: 0, int: 0 }
};

export const useGameEngine = () => {
  // --- State ---
  const [hero, setHero] = useState<HeroState>(() => {
    try {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(SAVE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Deep merge to ensure new fields exist and skills are reset if structure changed
                return {
                    ...DEFAULT_HERO_STATE,
                    ...parsed,
                    prestige: { ...DEFAULT_HERO_STATE.prestige, ...(parsed.prestige || {}) },
                    consumedTomes: { ...DEFAULT_HERO_STATE.consumedTomes, ...(parsed.consumedTomes || {}) },
                    baseStats: { ...DEFAULT_HERO_STATE.baseStats, ...(parsed.baseStats || {}) },
                    buffs: { ...DEFAULT_HERO_STATE.buffs, ...(parsed.buffs || {}) },
                    skills: (parsed.skills && parsed.skills.length === INITIAL_SKILLS.length) ? parsed.skills : getInitialSkills()
                };
            }
        }
    } catch (e) {
        console.error("Failed to load save", e);
    }
    return DEFAULT_HERO_STATE;
  });

  const [illusions, setIllusions] = useState<Illusion[]>([]);
  const [runes, setRunes] = useState<Rune[]>([]);
  const [computedStats, setComputedStats] = useState<Stats>(BASE_HERO_STATS);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [wave, setWave] = useState(1);
  const [texts, setTexts] = useState<FloatingText[]>([]);
  const [combatLog, setCombatLog] = useState<LogEntry[]>([]);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isTalentTreeOpen, setIsTalentTreeOpen] = useState(false);
  const [dps, setDps] = useState(0);

  // New State for Dashboard
  const [radiantTeam, setRadiantTeam] = useState<FakeHero[]>([]);
  const [direTeam, setDireTeam] = useState<FakeHero[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [gameTime, setGameTime] = useState(0);
  const [bonusTimer, setBonusTimer] = useState<number | null>(null);

  // Refs for game loop access
  const heroRef = useRef(hero);
  const enemiesRef = useRef(enemies);
  const illusionsRef = useRef(illusions);
  const runesRef = useRef(runes);
  const statsRef = useRef(computedStats);
  const waveRef = useRef(wave);
  const radiantTeamRef = useRef(radiantTeam);
  const direTeamRef = useRef(direTeam);
  const floatingTextBufferRef = useRef<FloatingText[]>([]);
  
  const waveStateRef = useRef<'fighting' | 'waiting' | 'spawning'>('waiting');
  const waveTimerRef = useRef(0);
  const bonusEndTimeRef = useRef<number>(0);
  
  const dmgHistoryRef = useRef<{time: number, dmg: number}[]>([]);
  const lastDpsUpdateRef = useRef(0);
  const nextRuneTimeRef = useRef(Date.now() + 30000);
  const lastTimeRef = useRef(Date.now());
  const skillRequestQueueRef = useRef<string[]>([]);
  const manualAttackQueueRef = useRef<string[]>([]);
  
  // Throttle Ref
  const frameCountRef = useRef(0);

  // Initialize Scoreboard Teams
  useEffect(() => {
    const getRandom = (arr: any[], n: number) => {
        const result = new Set();
        while(result.size < n) result.add(arr[Math.floor(Math.random() * arr.length)]);
        return Array.from(result);
    };

    const heroes = getRandom(DOTA_HEROES, 9) as typeof DOTA_HEROES;
    const nicks = getRandom(RU_NICKNAMES, 9) as string[];
    const lanes: ('top'|'mid'|'bot')[] = ['top', 'top', 'mid', 'bot', 'bot']; 

    const newRadiant: FakeHero[] = [
        { id: 'p1', name: 'Anti-Mage', nickname: 'Вы', avatar: '👿', isDead: false, respawnTimer: 0, color: 'bg-purple-900', x: 25, y: 65, lane: 'bot' },
        ...heroes.slice(0, 4).map((h, i) => ({
            id: `rad-${i}`, name: h.name, nickname: nicks[i], avatar: h.icon, isDead: false, respawnTimer: 0, color: h.color,
            x: 5, y: 95, lane: lanes[i+1] 
        }))
    ];

    const newDire: FakeHero[] = heroes.slice(4, 9).map((h, i) => ({
        id: `dire-${i}`, name: h.name, nickname: nicks[i + 4], avatar: h.icon, isDead: false, respawnTimer: 0, color: h.color,
        x: 95, y: 5, lane: lanes[i]
    }));

    setRadiantTeam(newRadiant);
    setDireTeam(newDire);
  }, []);

  useEffect(() => { 
    enemiesRef.current = enemies; 
    if (enemies.length > 0 && waveStateRef.current === 'waiting') {
        waveStateRef.current = 'fighting';
    }
  }, [enemies]);
  useEffect(() => { illusionsRef.current = illusions; }, [illusions]);
  useEffect(() => { runesRef.current = runes; }, [runes]);
  useEffect(() => { statsRef.current = computedStats; }, [computedStats]);
  useEffect(() => { waveRef.current = wave; }, [wave]);
  useEffect(() => { radiantTeamRef.current = radiantTeam; }, [radiantTeam]);
  useEffect(() => { direTeamRef.current = direTeam; }, [direTeam]);

  // --- Auto Save Effect ---
  useEffect(() => {
      const saveInterval = setInterval(() => {
          try {
              if (typeof window !== 'undefined') {
                  localStorage.setItem(SAVE_KEY, JSON.stringify(heroRef.current));
              }
          } catch (e) {
              console.error('Save failed', e);
          }
      }, AUTO_SAVE_INTERVAL);
      return () => clearInterval(saveInterval);
  }, []);

  // --- Helpers ---
  
  const addLog = (message: string, color: string = 'text-slate-300') => {
    const entry = { id: Math.random().toString(36), message, color };
    setCombatLog(prev => [entry, ...prev].slice(0, 50));
  };

  const addChatMessage = (sender: string, content: string, type: ChatMessage['type'], heroIcon?: string) => {
      setChatMessages(prev => [...prev, {
          id: Math.random().toString(36), sender, content, type, heroIcon
      }].slice(-20));
  };

  const calculateStats = useCallback((currentHero: HeroState): Stats => {
    const tomes = currentHero.consumedTomes || { str: 0, agi: 0, int: 0 };
    const str = currentHero.baseStats.strength + ((currentHero.level - 1) * LEVEL_STATS_GAIN.strength) + tomes.str;
    const agi = currentHero.baseStats.agility + ((currentHero.level - 1) * LEVEL_STATS_GAIN.agility) + tomes.agi;
    const int = currentHero.baseStats.intelligence + ((currentHero.level - 1) * LEVEL_STATS_GAIN.intelligence) + tomes.int;

    let extra: Stats = { 
        strength: 0, agility: 0, intelligence: 0, damage: 0, armor: 0, 
        attackSpeed: 0, hpMax: 0, hpRegen: 0, manaRegen: 0, manaMax: 0,
        cleavePct: 0, armorCorruption: 0,
        critChance: 0, critDamage: 0, evasion: 0, moveSpeed: 0,
        trueStrike: false, chainLightning: undefined, hpRegenPct: 0,
        illusionDamageMult: 0, illusionDurationMult: 0, manaBurnMult: 0,
        lifesteal: 0, goldGainPct: 0, xpGainPct: 0, shopDiscountPct: 0
    };
    
    let evasionSources: number[] = [];
    
    // 1. ITEMS
    currentHero.inventory.forEach(itemId => {
      const item = ITEMS[itemId];
      if (item?.stats) {
         Object.entries(item.stats).forEach(([k, v]) => {
             const key = k as keyof Stats;
             // Handle standard additive stats
             if (typeof v === 'number' && !['cleavePct', 'evasion', 'critChance', 'critDamage', 'chainLightning', 'hpRegenPct'].includes(key)) {
                 // @ts-ignore
                 extra[key] = (extra[key] as number || 0) + v;
             }
         });
         // Handle special props
         if (item.stats.cleavePct) extra.cleavePct = Math.max(extra.cleavePct, item.stats.cleavePct);
         if (item.stats.evasion) evasionSources.push(item.stats.evasion);
         if (item.stats.critChance) extra.critChance = Math.max(extra.critChance, item.stats.critChance);
         if (item.stats.critDamage) extra.critDamage = Math.max(extra.critDamage, item.stats.critDamage);
         if (item.stats.trueStrike) extra.trueStrike = true;
         if (item.stats.chainLightning) extra.chainLightning = item.stats.chainLightning;
         if (item.stats.hpRegenPct) extra.hpRegenPct = Math.max(extra.hpRegenPct || 0, item.stats.hpRegenPct);
      }
    });

    // 2. TALENTS
    Object.values(currentHero.talents).forEach(talentId => {
       let foundTalent: Talent | undefined;
       Object.values(TALENTS).forEach(list => {
           const t = list.find(x => x.id === talentId);
           if (t) foundTalent = t;
       });

       if (foundTalent?.stats) {
          Object.entries(foundTalent.stats).forEach(([k, v]) => {
            const key = k as keyof Stats;
            if (typeof v === 'number' && key !== 'evasion') {
                // @ts-ignore
                extra[key] = (extra[key] as number || 0) + v;
            }
            if (key === 'evasion' && typeof v === 'number') evasionSources.push(v);
         });
       }
    });

    // 3. PRESTIGE TREE
    const nodes = currentHero.prestige?.unlockedNodes || [];
    nodes.forEach(nodeId => {
        const node = PRESTIGE_TREE.find(n => n.id === nodeId);
        if (node?.stats) {
             Object.entries(node.stats).forEach(([k, v]) => {
                const key = k as keyof Stats;
                if (typeof v === 'number' && key !== 'evasion') {
                    // @ts-ignore
                    extra[key] = (extra[key] as number || 0) + v;
                }
                if (key === 'evasion' && typeof v === 'number') evasionSources.push(v);
             });
        }
    });
    
    // 4. SKILLS
    const counterSpell = currentHero.skills.find(s => s.id === 'counterspell');
    if (counterSpell && counterSpell.level > 0) {
        const evParams = counterSpell.params?.['Passive Evasion %'] || [15, 25, 35, 45];
        const evVal = evParams[Math.min(counterSpell.level - 1, evParams.length - 1)] / 100;
        evasionSources.push(evVal);
    }
    
    // Stack Evasion Multiplicatively
    const finalEvasion = 1 - evasionSources.reduce((acc, val) => acc * (1 - val), 1);

    const now = Date.now();
    let buffAS = 0;
    if (now < currentHero.buffs.blinkUntil) buffAS += 0.50;
    if (now < currentHero.buffs.hasteUntil) buffAS += 0.50;
    
    let buffDmgMult = 1;
    if (now < currentHero.buffs.ddUntil) buffDmgMult = 2;

    const finalStr = Math.floor(str + extra.strength);
    const finalAgi = Math.floor(agi + extra.agility);
    const finalInt = Math.floor(int + extra.intelligence);
    
    const maxHp = Math.floor(200 + (finalStr * 22) + extra.hpMax);

    return {
      strength: finalStr,
      agility: finalAgi,
      intelligence: finalInt,
      damage: Math.floor((currentHero.baseStats.damage + finalAgi + extra.damage) * buffDmgMult),
      armor: Math.floor(currentHero.baseStats.armor + (finalAgi * 0.16) + extra.armor),
      attackSpeed: currentHero.baseStats.attackSpeed + (finalAgi * 0.01) + extra.attackSpeed + buffAS, 
      hpMax: maxHp,
      hpRegen: currentHero.baseStats.hpRegen + (finalStr * 0.1) + extra.hpRegen + (extra.hpRegenPct ? maxHp * extra.hpRegenPct : 0) + (now < currentHero.buffs.regenUntil ? 50 : 0),
      manaMax: Math.floor(75 + (finalInt * 12)),
      manaRegen: currentHero.baseStats.manaRegen + (finalInt * 0.05) + extra.manaRegen + (now < currentHero.buffs.regenUntil ? 30 : 0),
      cleavePct: extra.cleavePct,
      evasion: finalEvasion,
      moveSpeed: 300,
      armorCorruption: extra.armorCorruption,
      critChance: extra.critChance,
      critDamage: extra.critDamage,
      trueStrike: extra.trueStrike,
      chainLightning: extra.chainLightning,
      hpRegenPct: extra.hpRegenPct,
      illusionDamageMult: (currentHero.baseStats.illusionDamageMult || 1) + (extra.illusionDamageMult || 0),
      illusionDurationMult: (currentHero.baseStats.illusionDurationMult || 1) + (extra.illusionDurationMult || 0),
      manaBurnMult: (currentHero.baseStats.manaBurnMult || 1) + (extra.manaBurnMult || 0),
      lifesteal: extra.lifesteal,
      goldGainPct: extra.goldGainPct,
      xpGainPct: extra.xpGainPct,
      shopDiscountPct: extra.shopDiscountPct
    };
  }, []);

  useEffect(() => {
    setComputedStats(calculateStats(hero));
  }, [hero, calculateStats]);

  // --- Actions ---

  const rebirth = () => {
     const earnedPoints = Math.floor(hero.highestWave / 10);
     if (earnedPoints <= 0 && hero.prestige.rebirthCount === 0) {
         addLog("Reach wave 10 to Rebirth!", "text-red-500");
         return;
     }

     const newPrestige = {
         ...hero.prestige,
         points: hero.prestige.points + earnedPoints,
         totalPointsEarned: hero.prestige.totalPointsEarned + earnedPoints,
         rebirthCount: hero.prestige.rebirthCount + 1
     };

     const newHeroState: HeroState = {
        ...DEFAULT_HERO_STATE,
        skills: getInitialSkills(), // CRITICAL: Use a fresh copy of skills
        prestige: newPrestige,
        godMode: hero.godMode,
        wtfMode: hero.wtfMode,
        consumedTomes: { str: 0, agi: 0, int: 0 } 
     };

     setHero(newHeroState);
     heroRef.current = newHeroState;
     setWave(1); waveRef.current = 1;
     setEnemies([]); enemiesRef.current = [];
     setIllusions([]);
     setTexts([]);
     setCombatLog([]);
     localStorage.setItem(SAVE_KEY, JSON.stringify(newHeroState)); // Force Save on Rebirth
     addLog(`REBIRTH! Gained ${earnedPoints} Talent Points.`, "text-purple-400 font-bold text-lg");
  };
  
  const resetSave = () => {
      if (window.confirm("ARE YOU SURE? This will wipe all progress including Prestige.")) {
          localStorage.removeItem(SAVE_KEY);
          window.location.reload();
      }
  };
  
  const unlockPrestigeNode = (nodeId: string) => {
      const node = PRESTIGE_TREE.find(n => n.id === nodeId);
      if (!node) return;
      if (hero.prestige.unlockedNodes.includes(nodeId)) return;
      if (hero.prestige.points < node.cost) return;
      if (node.parentId && node.parentId !== 'root' && !hero.prestige.unlockedNodes.includes(node.parentId)) return;

      setHero(prev => {
          const newState = {
              ...prev,
              prestige: {
                  ...prev.prestige,
                  points: prev.prestige.points - node.cost,
                  unlockedNodes: [...prev.prestige.unlockedNodes, nodeId]
              }
          };
          heroRef.current = newState;
          return newState;
      });
      addLog(`Learned Talent: ${node.name}`, "text-purple-300");
  };

  const requestCastSkill = (skillId: string) => {
      skillRequestQueueRef.current.push(skillId);
  };
  
  const handleManualClick = (enemyId: string) => {
      manualAttackQueueRef.current.push(enemyId);
  };

  const generateEnemies = (waveNum: number): Enemy[] => {
    const isBossWave = waveNum % 5 === 0;
    const isBonusWave = waveNum % 10 === 0;
    
    const now = Date.now();
    const baseArmor = Math.floor((waveNum - 1) * 0.3);

    const newEnemies: Enemy[] = [];

    if (isBonusWave) {
        bonusEndTimeRef.current = now + BONUS_ROUND_DURATION;
        setBonusTimer(BONUS_ROUND_DURATION);
        
        const donkeyHp = 1000000000; 
        newEnemies.push({
            id: `bonus-donkey-${waveNum}`,
            name: 'Golden Courier', type: 'bonus', level: waveNum,
            hp: donkeyHp, maxHp: donkeyHp,
            mana: 0, maxMana: 0,
            damage: 0, armor: 0, attackSpeed: 1, 
            xpReward: 0, goldReward: 0,
            range: 0, x: 70, y: 50, lastAttack: now,
            color: 'bg-yellow-400', stunnedUntil: 0, targetId: null
        });
        
    } else if (isBossWave) {
        // SCALING: Stronger bosses in late game
        const scalingMult = 1 + (waveNum * 0.15) + (waveNum > 30 ? Math.pow(waveNum - 30, 1.5) * 0.05 : 0);
        const baseHp = 2500 * Math.pow(1.35, waveNum / 5);
        const baseDmg = 120 * scalingMult;
        
        newEnemies.push({
            id: `boss-${waveNum}-${now}`,
            name: 'Roshan', type: 'boss', level: waveNum,
            hp: Math.floor(baseHp), maxHp: Math.floor(baseHp),
            mana: 2000, maxMana: 2000,
            damage: Math.floor(baseDmg), armor: baseArmor + 5 + (waveNum > 20 ? 10 : 0),
            attackSpeed: 0.6, 
            xpReward: Math.floor(1500 * scalingMult),
            goldReward: Math.floor(1500 * scalingMult),
            range: 15, x: 70, y: 40, lastAttack: now + 1000,
            color: 'bg-purple-900', stunnedUntil: 0, targetId: 'hero'
        });
    } else {
        // MASSIVE WAVES: Swarm mechanics for high levels
        let count = Math.min(3 + Math.floor(waveNum / 2), 60); // Cap at 60 to prevent total crash, but it's huge
        if (waveNum > 40) count = Math.min(20 + Math.floor((waveNum - 40) * 1.5), 60);

        for (let i = 0; i < count; i++) {
          const rand = Math.random();
          let type: 'melee' | 'ranged' | 'healer' = 'melee';
          if (rand > 0.85) type = 'healer';
          else if (rand > 0.65) type = 'ranged';

          const hpMult = 1 + (waveNum * 0.12);
          const dmgMult = 1 + (waveNum * 0.10);
          
          // Slightly weaker individual stats for mass waves to balance count
          let baseHp = 280; let baseMana = 100; let baseDmg = 25; let range = 10;
          let color = 'bg-red-700'; let name = 'Satyr';

          if (type === 'ranged') {
              baseHp = 200; baseMana = 300; baseDmg = 35; range = 45; color = 'bg-orange-600'; name = 'Banisher';
          } else if (type === 'healer') {
              baseHp = 240; baseMana = 400; baseDmg = 20; range = 35; color = 'bg-pink-600'; name = 'Tormenter';
          }
          
          newEnemies.push({
            id: `enemy-${waveNum}-${i}-${now}`, name, type, level: waveNum,
            hp: Math.floor(baseHp * hpMult), maxHp: Math.floor(baseHp * hpMult),
            mana: baseMana, maxMana: baseMana,
            damage: Math.floor(baseDmg * dmgMult), armor: baseArmor,
            attackSpeed: 0.6 + (waveNum * 0.01),
            xpReward: Math.floor(90 * (1 + waveNum * 0.15)), 
            goldReward: Math.floor(65 * (1 + waveNum * 0.12)),
            range, x: 60 + Math.random() * 30, y: 15 + Math.random() * 70,
            lastAttack: now + (Math.random() * 1500),
            color, stunnedUntil: 0, targetId: 'hero'
          });
        }
    }
    return newEnemies;
  };

  const spawnRune = () => {
      const types: Rune['type'][] = ['DD', 'HASTE', 'REGEN'];
      const type = types[Math.floor(Math.random() * types.length)];
      setRunes(prev => [...prev, {
          id: `rune-${Date.now()}`, type, x: 30 + Math.random() * 40, y: 30 + Math.random() * 40,
          spawnTime: Date.now(), expiresAt: Date.now() + 30000
      }]);
      addLog(`A ${type} Rune spawned!`, 'text-yellow-300 font-bold');
  };

  const pickupRune = (rune: Rune) => {
      const now = Date.now();
      let updates: Partial<HeroState['buffs']> = {};
      if (rune.type === 'DD') updates.ddUntil = now + 30000;
      if (rune.type === 'HASTE') updates.hasteUntil = now + 30000;
      if (rune.type === 'REGEN') updates.regenUntil = now + 5000;
      
      setHero(prev => {
          const newState = { ...prev, buffs: { ...prev.buffs, ...updates } };
          heroRef.current = newState;
          return newState;
      });
      setRunes(prev => prev.filter(r => r.id !== rune.id));
      
      setTimeout(() => {
        setTexts(prev => [...prev, { id: Math.random().toString(), text: `${rune.type} ACTIVATED!`, x: heroRef.current.x, y: heroRef.current.y - 20, color: 'text-yellow-400 font-bold text-xl', timestamp: Date.now() }]);
      }, 0);
  };

  const buyItem = (item: Item) => {
    let realCost = getItemTotalCost(item.id);
    if (statsRef.current.shopDiscountPct) {
        realCost = Math.floor(realCost * (1 - statsRef.current.shopDiscountPct));
    }

    const canFitInventory = hero.inventory.length < 6;
    const canFitBackpack = (hero.backpack?.length || 0) < 3;
    
    if (item.isConsumable) {
        if (hero.gold >= realCost) {
            setHero(prev => {
                const tomes = { ...(prev.consumedTomes || { str: 0, agi: 0, int: 0 }) };
                if (item.stats.strength) tomes.str += item.stats.strength;
                if (item.stats.agility) tomes.agi += item.stats.agility;
                if (item.stats.intelligence) tomes.int += item.stats.intelligence;
                const newState = { ...prev, gold: prev.gold - realCost, consumedTomes: tomes };
                heroRef.current = newState;
                return newState;
            });
            addLog(`Used ${item.name}`, 'text-purple-400');
            setTimeout(() => setTexts(prev => [...prev, { id: Math.random().toString(), text: "STATS UP!", x: heroRef.current.x, y: heroRef.current.y - 40, color: 'text-purple-300 font-bold text-xl', timestamp: Date.now() }]), 0);
        } else {
             addLog("Not enough gold!", "text-red-500");
        }
        return;
    }

    if (hero.gold >= realCost && (canFitInventory || canFitBackpack)) {
      let currentInv = [...hero.inventory];
      let currentBackpack = [...(hero.backpack || [])];
      let newItemLocation: 'inv' | 'pack' = canFitInventory ? 'inv' : 'pack';
      if (newItemLocation === 'inv') currentInv.push(item.id);
      else currentBackpack.push(item.id);

      let newGold = hero.gold - realCost;
      let changed = true;

      while (changed) {
        changed = false;
        for (const itemKey in ITEMS) {
          const recipeItem = ITEMS[itemKey];
          if (recipeItem.components) {
            const tempInv = [...currentInv];
            const tempBackpack = [...currentBackpack];
            let hasAll = true;
            for (const comp of recipeItem.components) {
               const idxInv = tempInv.indexOf(comp);
               if (idxInv !== -1) { tempInv.splice(idxInv, 1); } 
               else {
                   const idxPack = tempBackpack.indexOf(comp);
                   if (idxPack !== -1) { tempBackpack.splice(idxPack, 1); } 
                   else { hasAll = false; break; }
               }
            }

            if (hasAll) {
               if (tempInv.length < 6) {
                   currentInv = tempInv; currentInv.push(recipeItem.id); currentBackpack = tempBackpack;
               } else if (tempBackpack.length < 3) {
                   currentInv = tempInv; currentBackpack = tempBackpack; currentBackpack.push(recipeItem.id);
               } else { continue; }
               changed = true;
               addLog(`Crafted ${recipeItem.name}`, 'text-yellow-400');
               break; 
            }
          }
        }
      }
      
      setHero(prev => {
          const newState = { ...prev, gold: newGold, inventory: currentInv, backpack: currentBackpack };
          heroRef.current = newState;
          return newState;
      });
      addLog(`Bought ${item.name}`, 'text-amber-400');
    } else {
        if (!canFitInventory && !canFitBackpack) addLog("Inventory Full!", "text-red-500");
    }
  };

  const sellItem = (index: number, fromBackpack: boolean = false) => {
      const list = fromBackpack ? [...(hero.backpack || [])] : [...hero.inventory];
      if (list[index]) {
          const itemId = list[index];
          const item = ITEMS[itemId];
          const refund = Math.floor(getItemTotalCost(itemId) / 2);
          list.splice(index, 1);
          setHero(h => {
              const newState = fromBackpack 
                  ? { ...h, gold: h.gold + refund, backpack: list }
                  : { ...h, gold: h.gold + refund, inventory: list };
              heroRef.current = newState; 
              return newState;
          });
          addLog(`Sold ${item.name}`, 'text-slate-500');
          setTimeout(() => setTexts(prev => [...prev, { id: Math.random().toString(), text: `+${refund}g`, x: heroRef.current.x, y: heroRef.current.y, color: 'text-yellow-400', timestamp: Date.now() }]), 0);
      }
  }

  const swapItem = (fromIdx: number, fromContainer: 'inventory'|'backpack', toIdx: number, toContainer: 'inventory'|'backpack') => {
      const inv = [...hero.inventory];
      const pack = [...(hero.backpack || [])];
      
      const getItem = (c: string, i: number) => c === 'inventory' ? inv[i] : pack[i];
      const setItem = (c: string, i: number, val: string) => c === 'inventory' ? inv[i] = val : pack[i] = val;
      const removeItem = (c: string, i: number) => c === 'inventory' ? inv.splice(i, 1) : pack.splice(i, 1);
      const pushItem = (c: string, val: string) => c === 'inventory' ? inv.push(val) : pack.push(val);

      const itemA = getItem(fromContainer, fromIdx);
      const itemB = toIdx >= 0 ? getItem(toContainer, toIdx) : null;

      if (!itemA) return;

      if (itemB) { setItem(fromContainer, fromIdx, itemB); setItem(toContainer, toIdx, itemA); } 
      else { removeItem(fromContainer, fromIdx); pushItem(toContainer, itemA); }
      
      if (inv.length > 6 || pack.length > 3) return; 
      
      setHero(h => {
          const newState = { ...h, inventory: inv, backpack: pack };
          heroRef.current = newState;
          return newState;
      });
  };

  const levelUpSkill = (skillId: string) => {
    if (hero.skillPoints > 0) {
      setHero(prev => {
          const updatedSkills = prev.skills.map(s => s.id === skillId && s.level < s.maxLevel ? { ...s, level: s.level + 1 } : s);
          const newState = { ...prev, skillPoints: prev.skillPoints - 1, skills: updatedSkills };
          heroRef.current = newState;
          return newState;
      });
    }
  };

  const selectTalent = (level: number, talentId: string) => {
     if (hero.talents[level]) return;
     setHero(prev => {
         const newState = { ...prev, talents: { ...prev.talents, [level]: talentId } };
         heroRef.current = newState;
         return newState;
     });
     addLog(`Talent Selected: ${TALENTS[level].find(t => t.id === talentId)?.name}`, 'text-purple-300');
  };

  const adminActions = {
    addGold: () => { 
        setHero(h => { const s = { ...h, gold: h.gold + 9999 }; heroRef.current = s; return s; }); 
        setTimeout(() => setTexts(prev => [...prev, { id: Math.random().toString(), text: "+9999g", x: heroRef.current.x, y: heroRef.current.y, color: "text-yellow-400 font-bold", timestamp: Date.now() }]), 0);
    },
    levelUp: () => { 
        setHero(h => { const s = { ...h, level: h.level + 1, skillPoints: h.skillPoints + 1, xp: 0 }; heroRef.current = s; return s; }); 
        setTimeout(() => setTexts(prev => [...prev, { id: Math.random().toString(), text: "LEVEL UP!", x: heroRef.current.x, y: heroRef.current.y, color: "text-yellow-500 font-bold text-2xl", timestamp: Date.now() }]), 0);
    },
    heal: () => { 
        setHero(h => { const s = { ...h, hp: statsRef.current.hpMax, mana: statsRef.current.manaMax, isDead: false }; heroRef.current = s; return s; }); 
        setTimeout(() => setTexts(prev => [...prev, { id: Math.random().toString(), text: "FULL HEAL", x: heroRef.current.x, y: heroRef.current.y, color: "text-green-400 font-bold", timestamp: Date.now() }]), 0);
    },
    killWave: () => { 
        setEnemies(prev => prev.map(e => ({ ...e, hp: 0 }))); 
        enemiesRef.current = enemiesRef.current.map(e => ({ ...e, hp: 0 }));
        addLog("ADMIN: Wave Killed", "text-red-500"); 
    },
    toggleGodMode: () => { 
        setHero(h => { const s = { ...h, godMode: !h.godMode }; heroRef.current = s; return s; });
        addLog(`God Mode: ${!hero.godMode ? 'ON' : 'OFF'}`, !hero.godMode ? "text-green-500" : "text-slate-400"); 
    },
    toggleWtfMode: () => { 
        setHero(h => { const s = { ...h, wtfMode: !h.wtfMode }; heroRef.current = s; return s; });
        addLog(`WTF Mode: ${!hero.wtfMode ? 'ON' : 'OFF'}`, !hero.wtfMode ? "text-blue-500" : "text-slate-400"); 
    },
    addTalentPoints: () => {
        setHero(h => {
            const s = { ...h, prestige: { ...h.prestige, points: h.prestige.points + 100 } };
            heroRef.current = s;
            return s;
        });
        addLog("Added 100 Talent Points", "text-purple-400");
    },
    resetSave
  };

  // --- Fake Hero Loop (Minimap & Chat) ---
  useEffect(() => {
    const interval = setInterval(() => {
        setGameTime(prev => prev + 1);
        const moveHero = (h: FakeHero, isRadiant: boolean) => {
            const speed = 2; const jitter = Math.random() * 2 - 1;
            let tx = 50, ty = 50; 
            
            if (h.lane === 'top') { tx = isRadiant ? 15 : 85; ty = 15; } 
            else if (h.lane === 'bot') { tx = 85; ty = isRadiant ? 85 : 15; } 
            else { tx = 50; ty = 50; }

            const dx = tx - h.x; const dy = ty - h.y; const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist > 5) {
                const nx = h.x + (dx/dist) * speed + (jitter * 0.1);
                const ny = h.y + (dy/dist) * speed + (jitter * 0.1);
                return { x: nx, y: ny };
            } else { return { x: h.x + jitter, y: h.y + jitter }; }
        };

        const updateTeam = (team: FakeHero[], isRadiant: boolean) => {
            return team.map(h => {
                if (h.id === 'p1') {
                    return { ...h, isDead: heroRef.current.isDead, respawnTimer: heroRef.current.respawnTimer, x: heroRef.current.isDead ? 5 : (25 + Math.random()), y: heroRef.current.isDead ? 95 : (65 + Math.random()) };
                }
                if (h.isDead) {
                    const baseX = isRadiant ? 5 : 95; const baseY = isRadiant ? 95 : 5;
                    if (h.respawnTimer <= 1) { return { ...h, isDead: false, respawnTimer: 0, x: baseX, y: baseY }; }
                    return { ...h, respawnTimer: h.respawnTimer - 1, x: baseX, y: baseY };
                } else {
                    const newPos = moveHero(h, isRadiant);
                    if (Math.random() < 0.002) {
                         const killerName = !isRadiant 
                             ? (radiantTeam[Math.floor(Math.random()*radiantTeam.length)]?.nickname || 'Крип-мечник') 
                             : (direTeam[Math.floor(Math.random()*direTeam.length)]?.nickname || 'Крип-маг');
                         addChatMessage(killerName, `проломил голову ${h.nickname} за ${200 + Math.floor(Math.random()*300)} золота!`, 'system', !isRadiant ? '⚔️' : '💀');
                         return { ...h, isDead: true, respawnTimer: 15 + Math.floor(Math.random() * 35) };
                    }
                    if (Math.random() < 0.01) {
                        let msg = isRadiant ? TOXIC_TEAM_MESSAGES[Math.floor(Math.random() * TOXIC_TEAM_MESSAGES.length)] : ENEMY_CHAT_MESSAGES[Math.floor(Math.random() * ENEMY_CHAT_MESSAGES.length)];
                        addChatMessage(h.nickname, msg, isRadiant ? 'radiant' : 'dire', h.name);
                    }
                    return { ...h, x: newPos.x, y: newPos.y };
                }
            });
        };
        setRadiantTeam(prev => updateTeam(prev, true));
        setDireTeam(prev => updateTeam(prev, false));
    }, 1000);
    return () => clearInterval(interval);
  }, [radiantTeam, direTeam]);

  // --- Game Loop ---
  useEffect(() => {
    let rafId: number;
    
    const updateGame = (timestamp: number) => {
      const dt = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Throttle render updates
      frameCountRef.current++;
      const shouldRender = frameCountRef.current % 3 === 0;

      if (dt > 200) { rafId = requestAnimationFrame(updateGame); return; }

      const now = Date.now();
      const currentStats = statsRef.current;
      const dtSec = dt / 1000;
      
      // Floating Text Logic: BUFFER it every frame, FLUSH it on render frame
      const addFrameText = (text: string, x: number, y: number, color: string, isCrit: boolean = false) => {
          if (floatingTextBufferRef.current.length < 50) {
             floatingTextBufferRef.current.push({ id: Math.random().toString(36), text, x, y, color, timestamp: now, isCrit });
          }
      };

      let enemiesList = [...enemiesRef.current]; // Working copy
      let illusionsList = [...illusionsRef.current];
      let heroUpdates: Partial<HeroState> = {};
      
      // --- HERO DEATH CHECK ---
      if (heroRef.current.isDead) {
        setHero(prev => {
          if (prev.respawnTimer <= 0) {
            const spawned = { ...prev, isDead: false, hp: statsRef.current.hpMax, mana: statsRef.current.manaMax, x: 20, y: 50 };
            heroRef.current = spawned;
            return spawned;
          }
          const waiting = { ...prev, respawnTimer: prev.respawnTimer - dtSec };
          heroRef.current = waiting; 
          return waiting;
        });
        rafId = requestAnimationFrame(updateGame);
        return;
      }

      // ... (Bonus Round Logic) ...
      const hasBonus = enemiesList.some(e => e.type === 'bonus');
      if (hasBonus) {
          const timeLeft = Math.max(0, bonusEndTimeRef.current - now);
          if (shouldRender) setBonusTimer(timeLeft);
          
          if (timeLeft <= 0) {
             const donkey = enemiesList.find(e => e.type === 'bonus');
             if (donkey) {
                 const damageDealt = donkey.maxHp - donkey.hp;
                 const reward = Math.floor(damageDealt * (0.5 * (1 + waveRef.current * 0.1)));
                 heroUpdates.gold = (heroUpdates.gold || heroRef.current.gold) + reward;
                 addLog(`BONUS ROUND OVER!`, 'text-yellow-400 font-bold');
                 addFrameText(`+${reward}g`, donkey.x, donkey.y, 'text-yellow-300 font-bold text-3xl');
             }
             enemiesList = [];
             enemiesRef.current = [];
             if (shouldRender) setEnemies([]);
             if (shouldRender) setBonusTimer(null);
             if (heroRef.current.autoProgress) {
                const nextWave = waveRef.current + 1;
                if (shouldRender) setWave(nextWave);
                heroUpdates.highestWave = Math.max(heroRef.current.highestWave, nextWave);
            }
            waveStateRef.current = 'waiting';
          }
      }

      // ... (Spawn Logic) ...
      if (enemiesList.length === 0) {
        if (waveStateRef.current === 'waiting') {
            waveStateRef.current = 'spawning';
            waveTimerRef.current = now;
        } else if (waveStateRef.current === 'spawning') {
            if (now - waveTimerRef.current > WAVE_DELAY) {
                const newEnemies = generateEnemies(waveRef.current);
                enemiesList = newEnemies; 
                enemiesRef.current = newEnemies; 
                setEnemies(newEnemies); 
                waveStateRef.current = 'fighting';
                
                if (waveRef.current % 10 === 0) addLog(`💰 BONUS ROUND! Hit the Courier!`, 'text-yellow-300 font-bold text-lg');
                else if (waveRef.current % 5 === 0) addLog(`⚠️ BOSS WAVE ${waveRef.current} STARTED!`, 'text-red-500 font-bold');
                else addLog(`Wave ${waveRef.current} Spawned!`, 'text-amber-400');
            }
        }
      } else {
          if (waveStateRef.current === 'waiting') waveStateRef.current = 'fighting';
      }

      // ... (Skill Execution Logic) ...
      const executeSkill = (skillId: string) => {
         const skillIndex = heroRef.current.skills.findIndex(s => s.id === skillId);
         const skill = heroRef.current.skills[skillIndex];
         if (!skill || skill.level === 0) return;
         const isWtf = heroRef.current.wtfMode;
         const manaCost = isWtf ? 0 : skill.manaCost;
         const pendingMana = heroUpdates.mana !== undefined ? heroUpdates.mana : heroRef.current.mana;
         if (pendingMana < manaCost) return;
         let cooldown = isWtf ? 0 : skill.cooldown;
         if (!isWtf) {
             const nodes = heroRef.current.prestige?.unlockedNodes || [];
             if (nodes.includes('abil_cap')) cooldown *= 0.75;
         }
         if (!isWtf && now - skill.lastCast < cooldown * 1000) return;

         if (skillId === 'blink') {
             const newX = 10 + Math.random() * 30; const newY = 20 + Math.random() * 60;
             let duration = 6000;
             if (currentStats.illusionDurationMult) duration *= currentStats.illusionDurationMult;
             illusionsList.push({
                 id: `ill-${now}-${Math.random()}`, x: heroRef.current.x, y: heroRef.current.y,
                 hp: heroRef.current.hp, maxHp: statsRef.current.hpMax,
                 damage: Math.floor(statsRef.current.damage * 0.33 * (currentStats.illusionDamageMult || 1)),
                 attackSpeed: statsRef.current.attackSpeed, spawnTime: now, duration, maxDuration: duration,
                 lastAttackTime: 0, incomingDmgMult: 3
             });
             heroUpdates.x = newX; heroUpdates.y = newY;
             heroUpdates.buffs = { ...heroRef.current.buffs, blinkUntil: now + 3000 };
             addFrameText("BLINK!", heroRef.current.x, heroRef.current.y, 'text-purple-400');
         } else if (skillId === 'manavoid') {
             const bestTarget = enemiesList.reduce((best, curr) => (curr.maxMana - curr.mana > (best?.maxMana - best?.mana || -1) ? curr : best), null as Enemy | null);
             if (bestTarget) {
                 const damage = Math.max(50, (bestTarget.maxMana - bestTarget.mana) * 1.1);
                 bestTarget.hp -= damage;
                 bestTarget.stunnedUntil = now + 1500;
                 addFrameText(`${Math.floor(damage)} VOID!`, bestTarget.x, bestTarget.y - 20, 'text-fuchsia-500 font-bold', true);
             }
         } else if (skillId === 'counterspell') {
             enemiesList.forEach(e => { if (Math.sqrt(Math.pow(e.x - heroRef.current.x, 2) + Math.pow(e.y - heroRef.current.y, 2)) < 50) e.mana -= 200; });
             addFrameText("COUNTERSPELL!", heroRef.current.x, heroRef.current.y - 30, 'text-indigo-300 font-bold');
         }
         heroUpdates.mana = pendingMana - manaCost;
         heroUpdates.skills = (heroUpdates.skills || heroRef.current.skills).map(s => s.id === skillId ? { ...s, lastCast: now } : s);
      };
      
      // Process Queues
      while (manualAttackQueueRef.current.length > 0) {
          const targetId = manualAttackQueueRef.current.shift();
          const target = enemiesList.find(e => e.id === targetId);
          if (target && target.hp > 0) {
              // BUFF: Manual click deals 100% damage now to encourage clicking
              const clickDmg = Math.ceil(statsRef.current.damage);
              target.hp -= clickDmg;
              addFrameText(`${clickDmg}`, target.x + (Math.random()*4-2), target.y - 5 + (Math.random()*4-2), 'text-white/80 font-mono text-xs');
          }
      }
      while (skillRequestQueueRef.current.length > 0) { const skillId = skillRequestQueueRef.current.shift(); if (skillId) executeSkill(skillId); }
      if (heroRef.current.autoCast && enemiesList.length > 0) { ['blink', 'manavoid', 'counterspell'].forEach(executeSkill); }
      
      // ... (Item Cooldowns - Manta) ...
      heroRef.current.inventory.forEach(itemId => {
          if (itemId === 'manta' && enemiesList.length > 0) {
              const lastCast = heroRef.current.itemCooldowns?.[itemId] || 0;
              if (now - lastCast >= 30000) {
                  for(let i=0; i<2; i++) {
                       illusionsList.push({
                           id: `ill-manta-${now}-${Math.random()}`, x: heroRef.current.x + Math.random()*20-10, y: heroRef.current.y + Math.random()*20-10,
                           hp: heroRef.current.hp, maxHp: statsRef.current.hpMax,
                           damage: Math.floor(statsRef.current.damage * 0.33 * (currentStats.illusionDamageMult || 1)),
                           attackSpeed: statsRef.current.attackSpeed, spawnTime: now, duration: 20000, maxDuration: 20000,
                           lastAttackTime: 0, incomingDmgMult: 3
                       });
                  }
                  addFrameText("MANTA!", heroRef.current.x, heroRef.current.y - 30, 'text-blue-400 font-bold');
                  heroUpdates.itemCooldowns = { ...(heroUpdates.itemCooldowns || heroRef.current.itemCooldowns || {}), [itemId]: now };
              }
          }
      });

      // ... (Rune Spawning) ...
      if (now >= nextRuneTimeRef.current) {
          if (runesRef.current.length < 3) spawnRune();
          nextRuneTimeRef.current = now + RUNE_INTERVAL;
      }
      if (shouldRender) setRunes(prev => prev.filter(r => r.expiresAt > now));

      // Regen
      let hpRegenTick = currentStats.hpRegen * dtSec;
      let manaRegenTick = currentStats.manaRegen * dtSec;
      let currentHp = Math.max(0, Math.min(currentStats.hpMax, (heroUpdates.hp !== undefined ? heroUpdates.hp : heroRef.current.hp) + hpRegenTick));
      let currentMana = Math.max(0, Math.min(currentStats.manaMax, (heroUpdates.mana !== undefined ? heroUpdates.mana : heroRef.current.mana) + manaRegenTick));
      
      illusionsList = illusionsList.filter(i => now - i.spawnTime < i.duration && i.hp > 0);
      
      // --- Combat Loop (Optimized) ---
      const tryAttack = (attacker: any, isHero: boolean, illusionId?: string) => {
         if (enemiesList.length === 0) return;
         let target: Enemy | null = null;
         let minDistSq = 9999999;
         const ax = attacker.x; const ay = attacker.y;
         
         // Simple nearest neighbor
         for (let i = 0; i < enemiesList.length; i++) {
             const e = enemiesList[i];
             const distSq = (e.x - ax) * (e.x - ax) + (e.y - ay) * (e.y - ay);
             if (distSq < minDistSq) { minDistSq = distSq; target = e; }
         }

         if (target && now - attacker.lastAttackTime >= (1000 / attacker.attackSpeed)) {
            const t = target as Enemy;
            let damage = attacker.damage;
            let isCrit = false;
            let hit = true;
            
            if (hit) {
                if (isHero && currentStats.critChance > 0 && Math.random() < currentStats.critChance) {
                    damage *= currentStats.critDamage; isCrit = true;
                }
                
                // Mana Break
                if (isHero) {
                     const burn = Math.min(t.mana, 60); 
                     t.mana -= burn; 
                     damage += burn * 0.8;
                }

                if (isHero && currentStats.lifesteal && currentStats.lifesteal > 0) {
                     currentHp = Math.min(currentStats.hpMax, currentHp + damage * currentStats.lifesteal);
                }
                
                t.hp -= damage;
                dmgHistoryRef.current.push({ time: now, dmg: damage });
                addFrameText(`${Math.floor(damage)}`, t.x, t.y - 10, isCrit ? 'text-red-500 text-lg font-bold' : 'text-white', isCrit);

                if (currentStats.cleavePct > 0 && isHero) {
                    const cleaveDmg = Math.floor(damage * currentStats.cleavePct);
                    for (let j = 0; j < enemiesList.length; j++) {
                        const e = enemiesList[j];
                        if (e.id !== t.id && Math.abs(e.x - t.x) < 20 && Math.abs(e.y - t.y) < 20) { e.hp -= cleaveDmg; }
                    }
                }
            }

            if (isHero) heroUpdates.lastAttackTime = now;
            else if (illusionId) {
                const illIdx = illusionsList.findIndex(i => i.id === illusionId);
                if (illIdx >= 0) illusionsList[illIdx].lastAttackTime = now;
            }
         }
      };

      tryAttack({ ...currentStats, lastAttackTime: (heroUpdates.lastAttackTime || heroRef.current.lastAttackTime), x: (heroUpdates.x || heroRef.current.x), y: (heroUpdates.y || heroRef.current.y) }, true);
      illusionsList.forEach(ill => tryAttack({ damage: ill.damage, attackSpeed: ill.attackSpeed, lastAttackTime: ill.lastAttackTime, x: ill.x, y: ill.y }, false, ill.id));

      const survivors: Enemy[] = [];
      
      for (let i = 0; i < enemiesList.length; i++) {
          const enemy = enemiesList[i];
          if (enemy.hp <= 0 && enemy.type !== 'bonus') { 
              let gold = enemy.goldReward;
              if (currentStats.goldGainPct) gold = Math.floor(gold * (1 + currentStats.goldGainPct));
              heroUpdates.gold = (heroUpdates.gold || heroRef.current.gold) + gold;
              
              let xp = enemy.xpReward;
              if (currentStats.xpGainPct) xp = Math.floor(xp * (1 + currentStats.xpGainPct));
              let newXp = (heroUpdates.xp || heroRef.current.xp) + xp;
              let newLvl = (heroUpdates.level || heroRef.current.level);
              const reqXp = XP_FORMULA(newLvl);
              if (newXp >= reqXp && newLvl < 30) { newXp -= reqXp; newLvl++; heroUpdates.skillPoints = (heroUpdates.skillPoints || heroRef.current.skillPoints) + 1; }
              heroUpdates.xp = newXp; heroUpdates.level = newLvl;
              continue;
          }
          survivors.push(enemy);
          
          if (enemy.stunnedUntil > now) continue;
          if (enemy.type === 'bonus') continue;
          
          if (now - enemy.lastAttack >= (1000 / enemy.attackSpeed)) {
             let hit = true;
             // Hero Evasion
             if (!currentStats.trueStrike && Math.random() < currentStats.evasion) hit = false;
             
             if (hit) {
                 const dmg = enemy.damage;
                 let mitigation = 1 - ((0.06 * currentStats.armor) / (1 + 0.06 * currentStats.armor));
                 currentHp -= Math.max(1, dmg * mitigation);
             } else {
                 addFrameText("MISS", heroRef.current.x, heroRef.current.y, "text-slate-500 font-bold");
             }
             enemy.lastAttack = now;
          }
      }

      // Check Hero Death
      if (currentHp <= 0 && !heroRef.current.godMode && !heroRef.current.isDead) {
         currentHp = 0;
         heroUpdates.isDead = true;
         heroUpdates.respawnTimer = 10 + (heroRef.current.level * 2);
         const deathMsg = HERO_DEATH_TEAM_MESSAGES[Math.floor(Math.random() * HERO_DEATH_TEAM_MESSAGES.length)];
         const randomTeammate = radiantTeam[Math.floor(Math.random()*radiantTeam.length)];
         if (randomTeammate) addChatMessage(randomTeammate.nickname, deathMsg, 'radiant', randomTeammate.name);
         
         const deathMsgEnemy = HERO_DEATH_ENEMY_MESSAGES[Math.floor(Math.random() * HERO_DEATH_ENEMY_MESSAGES.length)];
         const randomEnemy = direTeam[Math.floor(Math.random()*direTeam.length)];
         if (randomEnemy) addChatMessage(randomEnemy.nickname, deathMsgEnemy, 'dire', randomEnemy.name);
      }

      if (survivors.length === 0 && enemiesRef.current.length > 0) {
          enemiesRef.current = []; 
          if (shouldRender) setEnemies([]);
          if (heroRef.current.autoProgress) {
              const nextWave = waveRef.current + 1;
              if (shouldRender) setWave(nextWave);
              heroUpdates.highestWave = Math.max(heroRef.current.highestWave, nextWave);
          }
          waveStateRef.current = 'waiting';
      } else {
          // FORCE STATE SYNC if shouldRender, regardless of count, to remove zombies
          if (shouldRender) {
             setEnemies(survivors);
          }
          enemiesRef.current = survivors; 
      }

      // Cleanup & Commit
      dmgHistoryRef.current = dmgHistoryRef.current.filter(d => now - d.time < 1000);
      if (now - lastDpsUpdateRef.current > 500) {
          if (shouldRender) setDps(dmgHistoryRef.current.reduce((sum, d) => sum + d.dmg, 0));
          lastDpsUpdateRef.current = now;
      }

      heroUpdates.hp = Math.max(0, currentHp); 
      heroUpdates.mana = Math.max(0, currentMana);
      
      // Only trigger React updates for Hero on render frames or if death happened
      if (shouldRender || heroUpdates.isDead) {
          const nextHeroState = { ...heroRef.current, ...heroUpdates };
          heroRef.current = nextHeroState;
          setHero(nextHeroState);
          setIllusions(illusionsList);
          
          // Flush Floating Texts from Buffer
          if (floatingTextBufferRef.current.length > 0) {
              setTexts(prev => [...prev, ...floatingTextBufferRef.current].slice(-20));
              floatingTextBufferRef.current = []; // Clear buffer after flush
          }
          
          // Cleanup old texts
          setTimeout(() => setTexts(prev => prev.filter(t => t.timestamp > Date.now() - 1000)), 1000);
      } else {
          // If not rendering, just update the ref
          heroRef.current = { ...heroRef.current, ...heroUpdates };
          illusionsRef.current = illusionsList;
      }
      
      // Auto-save logic is now handled by the useEffect above
      rafId = requestAnimationFrame(updateGame);
    };

    rafId = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(rafId);
  }, [calculateStats]); 

  return {
    hero, stats: computedStats, enemies, illusions, wave, texts, combatLog, isShopOpen, runes, dps,
    radiantTeam, direTeam, chatMessages, gameTime, isTalentTreeOpen, bonusTimer,
    setIsShopOpen, setIsTalentTreeOpen, buyItem, levelUpSkill, castSkill: requestCastSkill, handleManualClick,
    xpRequired: XP_FORMULA(hero.level),
    toggleAutoCast: () => setHero(h => { const s = { ...h, autoCast: !h.autoCast }; heroRef.current = s; return s; }),
    toggleAutoProgress: () => setHero(h => { const s = { ...h, autoProgress: !h.autoProgress }; heroRef.current = s; return s; }),
    setWaveManually: (dir: 'prev' | 'next') => {
        const target = dir === 'prev' ? wave - 1 : wave + 1;
        if (target < 1 || (dir === 'next' && target > hero.highestWave + 1)) return; 
        setWave(target); setEnemies([]); enemiesRef.current = []; waveStateRef.current = 'waiting'; waveTimerRef.current = Date.now() - WAVE_DELAY + 200; 
    },
    selectTalent, pickupRune, adminActions, sellItem, swapItem, rebirth, unlockPrestigeNode
  };
};
