
import { Item, Stats, Skill, Talent, TalentNode } from './types';

// Base Anti-Mage Stats
export const BASE_HERO_STATS: Stats = {
  strength: 23, 
  agility: 26, 
  intelligence: 15,
  damage: 49,
  armor: 3,
  attackSpeed: 0.85, 
  hpMax: 0,
  hpRegen: 1.5,
  manaMax: 0,
  manaRegen: 0.5,
  cleavePct: 0,
  evasion: 0,
  moveSpeed: 315,
  armorCorruption: 0,
  critChance: 0,
  critDamage: 1.0,
  trueStrike: false,
  chainLightning: undefined,
  hpRegenPct: 0,
  lifesteal: 0,
  goldGainPct: 0,
  xpGainPct: 0,
  shopDiscountPct: 0,
  illusionDamageMult: 1.0,
  illusionDurationMult: 1.0,
  manaBurnMult: 1.0
};

export const LEVEL_STATS_GAIN = {
  strength: 2.2,
  agility: 3.2,
  intelligence: 1.8
};

export const XP_FORMULA = (level: number) => Math.floor(150 * Math.pow(level, 1.35));

// --- PRESTIGE / ASCENSION TREE ---
// Coordinates: Row (Y), Col (X). 0,0 is Center.
// Top Left: Economy (Col < 0, Row > 0)
// Bottom Left: Survival (Col < 0, Row < 0)
// Top Right: Offense (Col > 0, Row > 0)
// Bottom Right: Ability (Col > 0, Row < 0)

export const PRESTIGE_TREE: TalentNode[] = [
  // --- ROOT ---
  { 
    id: 'root', name: 'Awakening', description: 'Begin your journey. +3 All Stats.',
    row: 0, col: 0, cost: 1, icon: '✨', branch: 'core',
    stats: { strength: 3, agility: 3, intelligence: 3 }
  },

  // === OFFENSE BRANCH (Top Right) ===
  { 
    id: 'off_1', name: 'Sharpness', description: '+12 Damage.',
    row: 1, col: 1, cost: 2, icon: '🗡️', branch: 'offense', parentId: 'root',
    stats: { damage: 12 }
  },
  { 
    id: 'off_2', name: 'Alacrity', description: '+15 Attack Speed.',
    row: 2, col: 2, cost: 3, icon: '⚡', branch: 'offense', parentId: 'off_1',
    stats: { attackSpeed: 0.15 }
  },
  // Choice: Crit vs Raw Power
  { 
    id: 'off_3_a', name: 'Lethality', description: '+10% Crit Chance & +25% Crit Dmg.',
    row: 3, col: 1.5, cost: 5, icon: '🎯', branch: 'offense', parentId: 'off_2', mutexId: 'off_3_b',
    stats: { critChance: 0.10, critDamage: 0.25 }
  },
  { 
    id: 'off_3_b', name: 'Brute Force', description: '+30 Damage & +5 Str.',
    row: 2.5, col: 3, cost: 5, icon: '🔨', branch: 'offense', parentId: 'off_2', mutexId: 'off_3_a',
    stats: { damage: 30, strength: 5 }
  },
  // Capstone
  { 
    id: 'off_cap', name: 'God Slayer', description: '+150 Damage & True Strike.',
    row: 4, col: 2.5, cost: 15, icon: '💀', branch: 'offense', parentId: 'off_3_a', // Requires choice A or B technically, simpler to link to A visually or check logic
    stats: { damage: 150, trueStrike: true }
  },


  // === ECONOMY BRANCH (Top Left) ===
  { 
    id: 'eco_1', name: 'Greed', description: '+10% Gold Gain.',
    row: 1, col: -1, cost: 2, icon: '💰', branch: 'economy', parentId: 'root',
    stats: { goldGainPct: 0.10 }
  },
  { 
    id: 'eco_2', name: 'Wisdom', description: '+15% XP Gain.',
    row: 2, col: -2, cost: 3, icon: '📜', branch: 'economy', parentId: 'eco_1',
    stats: { xpGainPct: 0.15 }
  },
  // Choice: Active Midas vs Passive Discount
  { 
    id: 'eco_3_a', name: 'Hand of Midas', description: '+25% Gold Gain.',
    row: 3, col: -1.5, cost: 5, icon: '✋', branch: 'economy', parentId: 'eco_2', mutexId: 'eco_3_b',
    stats: { goldGainPct: 0.25 }
  },
  { 
    id: 'eco_3_b', name: 'Haggling', description: 'Items cost 10% less.',
    row: 2.5, col: -3, cost: 5, icon: '📉', branch: 'economy', parentId: 'eco_2', mutexId: 'eco_3_a',
    stats: { shopDiscountPct: 0.10 }
  },
  // Capstone
  { 
    id: 'eco_cap', name: 'Tycoon', description: 'Items cost 15% less & +20% Gold.',
    row: 4, col: -2.5, cost: 15, icon: '👑', branch: 'economy', parentId: 'eco_3_a',
    stats: { shopDiscountPct: 0.15, goldGainPct: 0.20 }
  },


  // === SURVIVAL BRANCH (Bottom Left) ===
  { 
    id: 'surv_1', name: 'Thick Skin', description: '+3 Armor.',
    row: -1, col: -1, cost: 2, icon: '🛡️', branch: 'survival', parentId: 'root',
    stats: { armor: 3 }
  },
  { 
    id: 'surv_2', name: 'Vitality', description: '+300 Health.',
    row: -2, col: -2, cost: 3, icon: '❤️', branch: 'survival', parentId: 'surv_1',
    stats: { hpMax: 300 }
  },
  // Choice: Lifesteal vs Evasion
  { 
    id: 'surv_3_a', name: 'Vampirism', description: '+8% Lifesteal.',
    row: -3, col: -1.5, cost: 5, icon: '🩸', branch: 'survival', parentId: 'surv_2', mutexId: 'surv_3_b',
    stats: { lifesteal: 0.08 }
  },
  { 
    id: 'surv_3_b', name: 'Blur', description: '+10% Evasion.',
    row: -2.5, col: -3, cost: 5, icon: '👻', branch: 'survival', parentId: 'surv_2', mutexId: 'surv_3_a',
    stats: { evasion: 0.10 }
  },
  // Capstone
  { 
    id: 'surv_cap', name: 'Immortality', description: 'Regenerate 2.5% Max HP per second.',
    row: -4, col: -2.5, cost: 15, icon: '🧬', branch: 'survival', parentId: 'surv_3_a',
    stats: { hpRegenPct: 0.025 }
  },


  // === ABILITY BRANCH (Bottom Right) ===
  { 
    id: 'abil_1', name: 'Focus', description: '+10 Intelligence.',
    row: -1, col: 1, cost: 2, icon: '🧠', branch: 'ability', parentId: 'root',
    stats: { intelligence: 10 }
  },
  { 
    id: 'abil_2', name: 'Mystic', description: '-10% Cooldowns.',
    row: -2, col: 2, cost: 3, icon: '🔮', branch: 'ability', parentId: 'abil_1',
    stats: { } // Logic in useGameEngine for general CDR if needed, or implement generic stat
    // Currently we handle skillMod. Let's add specific Skill Mods here manually in logic or loop
  },
  // Choice: Mana Void vs Blink
  { 
    id: 'abil_3_a', name: 'Void Mastery', description: 'Mana Void Cooldown -30s.',
    row: -3, col: 1.5, cost: 5, icon: '🎆', branch: 'ability', parentId: 'abil_2', mutexId: 'abil_3_b',
    skillMod: { skillId: 'manavoid', prop: 'cooldown', value: -30 }
  },
  { 
    id: 'abil_3_b', name: 'Blink Mastery', description: 'Blink Cooldown -2s.',
    row: -2.5, col: 3, cost: 5, icon: '🦶', branch: 'ability', parentId: 'abil_2', mutexId: 'abil_3_a',
    skillMod: { skillId: 'blink', prop: 'cooldown', value: -2 }
  },
  // Capstone
  { 
    id: 'abil_cap', name: 'Archmage', description: 'All Cooldowns reduced by 25%.',
    row: -4, col: 2.5, cost: 15, icon: '🧙', branch: 'ability', parentId: 'abil_3_a',
    // Logic needs to be handled in calculating skill CDs
  }
];

// --- ASSETS FOR UI ---
export const DOTA_HEROES = [
  { name: 'Pudge', icon: '🥩', color: 'bg-red-800' },
  { name: 'Juggernaut', icon: '👺', color: 'bg-orange-600' },
  { name: 'Crystal Maiden', icon: '❄️', color: 'bg-cyan-400' },
  { name: 'Invoker', icon: '🔮', color: 'bg-purple-600' },
  { name: 'Sniper', icon: '🔫', color: 'bg-yellow-700' },
  { name: 'Shadow Fiend', icon: '👿', color: 'bg-gray-800' },
  { name: 'Axe', icon: '🪓', color: 'bg-red-600' },
  { name: 'Zeus', icon: '⚡', color: 'bg-blue-500' },
  { name: 'Lion', icon: '🦁', color: 'bg-orange-800' },
  { name: 'Techies', icon: '💣', color: 'bg-yellow-500' },
  { name: 'Faceless Void', icon: '👽', color: 'bg-purple-800' },
  { name: 'Phantom Assassin', icon: '👻', color: 'bg-teal-700' },
  { name: 'Sven', icon: '🗡️', color: 'bg-blue-700' },
  { name: 'Earthshaker', icon: '🗿', color: 'bg-amber-800' }
];

export const RU_NICKNAMES = [
  'Заэвейдил аборт', 'Киска Мираны', 'Эдвард Руки-Пенисы', 'Попробуй меня протащи', 'Аутист', 
  'Лепёша Говнович', 'Дед Бивень', 'Мама Бивень', 'Батя в здании', 'НеКерри', 'Поводырь', 
  'Николай Дроздов', 'Вжух и ТЫ ТРУП', 'Керри с одной кнопки', 'НеЖмиКнопки', 'Жора', 
  'Твой Папич', 'Мемный Дединсайд', 'Человек-Самовар', 'Дизмораль', 'Фармящий Додик', 
  'Рука-Лицо', 'Сварщик-Убийца', 'Саппорт на ФП', 'Мидер на 2к', 'ПроНеПро', 'Раковый Рак', 
  'Крадущий Аегис', 'Бот-Одиночка', 'Таверна Гнилых Героев', 'ЯжМать', 'Чисто На Фиде', 
  'Ульта не прошла', 'Курица Сдохла', 'Ганк-Машина', 'Дотер-Задрот', 'Царь Всея Доты', 
  'Крипчик', 'Глебати', 'Шерстяной', 'Найс Габен', 'Трахать Доту', 'Банан', 'Мышь Умерла', 
  'Без Рук', 'НегрОфиг', 'Пиво реарм пиво', 'Пт насилую детей', 'Сквиртослав', 'Руки Сквиртухи', 
  'Меня бьют отцы', 'Помойная крыса', 'Задоджил аборт', 'Тапочки деда индуса', 'ПЧЛЕН', 
  'Снюс реарм снюс', 'Котях бабиджона', 'Алчное семяизвержение', 'Сын арматуры', 
  'Дикпиковая дама', 'Типни сын шлюхи', 'Кишечный глист', 'Выживший выкидыш', 
  'Имбицилообразная макака', 'Натоптыш', 'Я сутенер сучки', '7ми сантиметровый гигант', 
  'Крем для ухода из семьи', 'Анальный разрыхлитель', 'ВОТКНУЛ В ТВОЮ МАТЬ НОЖ', 
  'Мать четверых детей', 'Максим Спермоглазов', 'Нежный Отчим', 'Лёня Яебу', 
  'Геналий Полушубок', 'Я конченный бегите', 'Задний дробитель', 'Пьердун', 'Штаны отца', 
  'Сосок', 'Пушащий денчик', 'Директор платного туалета', 'Под3aлyпная шмаль', 
  'Машинистка пылесоса', 'Яша Лава', 'Пули от бабули', 'Маша два баша', 'Вика dust', 
  'Задоджил пту', 'Валя нулифаер', 'Арк Вагнер', 'Анало Говнет', 'Дядька трахач'
];

export const TOXIC_TEAM_MESSAGES = [
  "ты зачем с лайна ушел чучело", "я один стою против двоих спс", "ам вернись на лайн ты не выфармишь лес", 
  "у тебя пт нет какой лес", "чел ты 3 пачки крипов пропустил на лайне", "найс фрифарм врагам подарил", 
  "12 минута кольцо и сапог сильный керри", "ты понимаешь что мы 4х5 играем", "мы деремся этот даун эншентов ковыряет", 
  "тп нажми нас под тавером дайвят", "у тебя тп нет или ты слепой", "гений на аме лес с 3 левела", 
  "боже дайте мне нормального керри хоть раз", "18 минута где бф мусор", "у врага керри уже с радиком наш с воидом", 
  "чисто пве игрок", "ты выйдешь когда нам трон снесут", "не дефайте пусть заканчивают у нас -1", 
  "репорт киньте на 1 позицию за руин", "аккбаер ебаный почем 2к купил", "ты хоть один камп застакал себе", 
  "зачем ты блинкаешься в кэмп маны нет", "купи варды себе в лес тогда раз там живешь", "вся карта темная офк тебя убьют щас", 
  "ахахаха так тебе и надо", "найс лес пофармил умер от саппорта", "ты юзлес кусок просто 0 импакта", 
  "мы в смоках идем ты можешь подойти", "а он все еще яшу собирает ясно", "продай аккаунт обратно", 
  "ливни нам голды больше дадут", "чекай шмот у него даже стиков нет", "ты игру понимаешь вообще", 
  "зачем ты пикаешь ама если фармить не умеешь", "встань амулет на миду", "не стиль экспу иди нахуй отсюда", 
  "ты нам всю карту заблочил своим афк", "враги рошана бьют ам лес фармит", "у нас т3 падает реакция будет", 
  "гг ам 3к нетуорса на 20й", "ты худший ам которого я видел", "с таким керри не выиграть", 
  "просто крип с блинком", "манта на 40й будет", "я не буду тебя сейвить сдыхай", 
  "мут кинул невозможно смотреть на это", "тима играет ам руинит", "надеюсь лп тебе дадут на 5 игр", 
  "животное посмотри на счет", "удаляй доту не позорься", "тп жми", "хелп", 
  "где урон", "ты пустой", "0 помощи", "лесник хуев", 
  "найс бф", "крип вейв проебал", "у нас минус 4 ты фармишь", "клоун"
];

export const ENEMY_CHAT_MESSAGES = [
  "?", ")))", "((", "ez", "изи", "лс", "спс за птс", "выйди в окно", "типай его", 
  "лол", "ахаха", "нуб", "бот", "где помощь?", "маму в кино водил", "изи мид", 
  "ливни", "зачем потеешь", "кринж", "0 импакта", "бездари", "фидьте дальше"
];

export const HERO_DEATH_TEAM_MESSAGES = [
    "найс пофармил долбоеб", "даже в лесу сдох мда", "фидь дальше животное", 
    "0 вижена он фармит", "удали игру не позорься", "нахуй ты вообще родился", 
    "чисто фраг ходячий", "спасибо за игру урод", "репорт за фид", 
    "ты карту видишь вообще нет", "корми их больше", "тупо кусок мяса", 
    "зачем я потел на лайне ради этого", "боже какой же ты лоускилл", 
    "сдохни в реале так же", "варды для кого стоят слепой", "просто ливни уже", 
    "-кери -игра", "крипы убили или герой", "типичный ам 0 10", 
    "я афк это невозможно выиграть", "найс байбек", "продай шмот купи мозги", 
    "еще раз сдохнешь я шмотки разобью", "твой уровень это с ботами играть", 
    "где бкб мусор", "тебя саппорт 5ка соло убил ахаха", "бесполезный кусок", 
    "гг вп фидер в тиме", "не выходи с фонтана лучше"
];

export const HERO_DEATH_ENEMY_MESSAGES = [
    "спс за голду", "изи", "?", "банкомат пришел", "найс лес бро", 
    "где команда", "ты потерялся?", "сладкий", "вкусный ам", 
    "(Типнул Anti-Mage)", "приходи еще", "спс за птс", "какой же ты слабый", 
    "бот?", "просто крип", "удачи в лп", "1к ммр гейминг", "не фарми больше", 
    "хахаха", "лол", "тима раков", "сорри зря быканул", "давай по новой", 
    "карма", "на коленки", "домой", "в таверну мусор", "даже кнопки жать не надо", 
    "фрифарм окончен", "ливай"
];

// --- ITEMS DATABASE ---
export const ITEMS: Record<string, Item> = {
  // --- BASIC COMPONENTS ---
  
  // Desolator Components
  'mithril_hammer': { id: 'mithril_hammer', name: 'Mithril Hammer', cost: 1600, stats: { damage: 24 }, icon: '🔨', color: 'text-slate-300', category: 'basic' },
  'blight_stone': { id: 'blight_stone', name: 'Blight Stone', cost: 300, stats: { armorCorruption: 2 }, icon: '🌑', color: 'text-orange-900', category: 'basic', description: 'Passively reduces enemy armor.' },
  
  // Butterfly Components
  'claymore': { id: 'claymore', name: 'Claymore', cost: 1350, stats: { damage: 20 }, icon: '🗡️', color: 'text-slate-200', category: 'basic' },
  'talisman_evasion': { id: 'talisman_evasion', name: 'Talisman of Evasion', cost: 1300, stats: { evasion: 0.15 }, icon: '🧿', color: 'text-yellow-100', category: 'basic' },
  'eaglesong': { id: 'eaglesong', name: 'Eaglesong', cost: 2800, stats: { agility: 25 }, icon: '🦅', color: 'text-green-200', category: 'basic' },
  
  // Sange / Yasha / Manta Components
  'belt_strength': { id: 'belt_strength', name: 'Belt of Strength', cost: 450, stats: { strength: 6 }, icon: '🥋', color: 'text-red-300', category: 'basic' },
  'band_elvenskin': { id: 'band_elvenskin', name: 'Band of Elvenskin', cost: 450, stats: { agility: 6 }, icon: '🧝', color: 'text-green-300', category: 'basic' },
  'ogre_axe': { id: 'ogre_axe', name: 'Ogre Axe', cost: 1000, stats: { strength: 10 }, icon: '🪓', color: 'text-red-700', category: 'basic' },
  'blade_alacrity': { id: 'blade_alacrity', name: 'Blade of Alacrity', cost: 1000, stats: { agility: 10 }, icon: '🗡️', color: 'text-cyan-200', category: 'basic' },
  'ultimate_orb': { id: 'ultimate_orb', name: 'Ultimate Orb', cost: 2100, stats: { strength: 10, agility: 10, intelligence: 10 }, icon: '🔮', color: 'text-white', category: 'basic' },
  'recipe_sange': { id: 'recipe_sange', name: 'Recipe: Sange', cost: 550, stats: {}, icon: '📜', color: 'text-yellow-600', category: 'basic', isRecipe: true },
  'recipe_yasha': { id: 'recipe_yasha', name: 'Recipe: Yasha', cost: 550, stats: {}, icon: '📜', color: 'text-yellow-600', category: 'basic', isRecipe: true },
  'recipe_manta': { id: 'recipe_manta', name: 'Recipe: Manta', cost: 500, stats: {}, icon: '📜', color: 'text-yellow-600', category: 'basic', isRecipe: true },
  
  // Daedalus / Crystalys Components
  'broadsword': { id: 'broadsword', name: 'Broadsword', cost: 1000, stats: { damage: 15 }, icon: '⚔️', color: 'text-slate-200', category: 'basic' },
  'blades_attack': { id: 'blades_attack', name: 'Blades of Attack', cost: 450, stats: { damage: 9 }, icon: '⚔️', color: 'text-slate-300', category: 'basic' },
  'recipe_crystalys': { id: 'recipe_crystalys', name: 'Recipe: Crystalys', cost: 500, stats: {}, icon: '📜', color: 'text-yellow-600', category: 'basic', isRecipe: true },
  'demon_edge': { id: 'demon_edge', name: 'Demon Edge', cost: 2200, stats: { damage: 40 }, icon: '🗡️', color: 'text-cyan-200', category: 'basic' },
  'recipe_daedalus': { id: 'recipe_daedalus', name: 'Recipe: Daedalus', cost: 1000, stats: {}, icon: '📜', color: 'text-yellow-600', category: 'basic', isRecipe: true },
  
  // Power Treads Components
  'boots_speed': { id: 'boots_speed', name: 'Boots of Speed', cost: 500, stats: { moveSpeed: 45 }, icon: '👢', color: 'text-amber-700', category: 'basic' },
  'gloves_haste': { id: 'gloves_haste', name: 'Gloves of Haste', cost: 450, stats: { attackSpeed: 0.20 }, icon: '🧤', color: 'text-yellow-200', category: 'basic' },

  // MKB / Mjollnir / Heart Components
  'javelin': { id: 'javelin', name: 'Javelin', cost: 1100, stats: { damage: 10 }, icon: '🏹', color: 'text-slate-300', category: 'basic', description: 'Chance to pierce evasion.' },
  'hyperstone': { id: 'hyperstone', name: 'Hyperstone', cost: 2000, stats: { attackSpeed: 0.6 }, icon: '🟢', color: 'text-green-500', category: 'basic' },
  'vitality_booster': { id: 'vitality_booster', name: 'Vitality Booster', cost: 1000, stats: { hpMax: 250 }, icon: '❤️', color: 'text-red-600', category: 'basic' },
  'reaver': { id: 'reaver', name: 'Reaver', cost: 2800, stats: { strength: 25 }, icon: '🪓', color: 'text-red-800', category: 'basic' },
  'recipe_mjollnir': { id: 'recipe_mjollnir', name: 'Recipe: Mjollnir', cost: 900, stats: {}, icon: '📜', color: 'text-yellow-600', category: 'basic', isRecipe: true },
  'recipe_mkb': { id: 'recipe_mkb', name: 'Recipe: MKB', cost: 675, stats: {}, icon: '📜', color: 'text-yellow-600', category: 'basic', isRecipe: true },
  'recipe_heart': { id: 'recipe_heart', name: 'Recipe: Heart', cost: 1200, stats: {}, icon: '📜', color: 'text-yellow-600', category: 'basic', isRecipe: true },

  // --- INFINITE SCALING (TOMES) ---
  'tome_str': { 
      id: 'tome_str', name: 'Tome of Strength', cost: 10000, 
      stats: { strength: 5 }, icon: '📕', color: 'text-red-500', 
      category: 'consumable', isConsumable: true,
      description: 'Consume to permanently gain +5 Strength.' 
  },
  'tome_agi': { 
      id: 'tome_agi', name: 'Tome of Agility', cost: 10000, 
      stats: { agility: 5 }, icon: '📗', color: 'text-green-500', 
      category: 'consumable', isConsumable: true,
      description: 'Consume to permanently gain +5 Agility.' 
  },
  'tome_int': { 
      id: 'tome_int', name: 'Tome of Intelligence', cost: 10000, 
      stats: { intelligence: 5 }, icon: '📘', color: 'text-blue-500', 
      category: 'consumable', isConsumable: true,
      description: 'Consume to permanently gain +5 Intelligence.' 
  },


  // --- INTERMEDIATE ITEMS ---
  'sange': { 
    id: 'sange', name: 'Sange', cost: 0, 
    stats: { strength: 16, hpRegen: 4 }, 
    components: ['belt_strength', 'ogre_axe', 'recipe_sange'],
    icon: '🩸', color: 'text-red-600', category: 'upgrade',
    description: 'Sange is a weapon of unusual power.'
  },
  'yasha': { 
    id: 'yasha', name: 'Yasha', cost: 0, 
    stats: { agility: 16, attackSpeed: 0.12, moveSpeed: 20 }, 
    components: ['band_elvenskin', 'blade_alacrity', 'recipe_yasha'],
    icon: '🌙', color: 'text-green-400', category: 'upgrade',
    description: 'Yasha is considered a quick blade.'
  },
  'crystalys': {
    id: 'crystalys', name: 'Crystalys', cost: 0,
    stats: { damage: 32, critChance: 0.30, critDamage: 1.6 },
    components: ['broadsword', 'blades_attack', 'recipe_crystalys'],
    icon: '💎', color: 'text-pink-300', category: 'upgrade',
    description: 'Critical Strike: 30% chance to deal 160% damage.'
  },
  'maelstrom': {
    id: 'maelstrom', name: 'Maelstrom', cost: 0,
    stats: { damage: 24, attackSpeed: 0.15, chainLightning: [0.3, 140] },
    components: ['mithril_hammer', 'javelin'],
    icon: '⚡', color: 'text-blue-300', category: 'upgrade',
    description: 'Chance to release Chain Lightning.'
  },

  // --- BIG UPGRADES ---
  
  'power_treads': {
      id: 'power_treads', name: 'Power Treads', cost: 0,
      stats: { strength: 10, attackSpeed: 0.25, moveSpeed: 45 }, 
      components: ['boots_speed', 'gloves_haste', 'belt_strength'],
      icon: '👞', color: 'text-amber-600', category: 'upgrade',
      description: 'Grants attributes and attack speed.'
  },

  'desolator': {
    id: 'desolator', name: 'Desolator', cost: 0,
    stats: { damage: 50, armorCorruption: 6 },
    components: ['mithril_hammer', 'mithril_hammer', 'blight_stone'],
    icon: '💀', color: 'text-red-600', category: 'upgrade',
    description: 'Corruption: Your attacks reduce the target\'s armor by 6.'
  },

  'butterfly': {
    id: 'butterfly', name: 'Butterfly', cost: 0,
    stats: { agility: 35, damage: 25, attackSpeed: 0.30, evasion: 0.35 },
    components: ['eaglesong', 'talisman_evasion', 'claymore'],
    icon: '🦋', color: 'text-green-300', category: 'upgrade',
    description: 'Flutter: Grants 35% evasion and attack speed.'
  },

  'sange_yasha': {
    id: 'sange_yasha', name: 'Sange and Yasha', cost: 0,
    stats: { strength: 16, agility: 16, attackSpeed: 0.20, damage: 16, hpRegen: 6, moveSpeed: 30 },
    components: ['sange', 'yasha'],
    icon: '🌗', color: 'text-purple-400', category: 'upgrade',
    description: 'Sange and Yasha become a devastating combination.'
  },
  
  'manta': {
    id: 'manta', name: 'Manta Style', cost: 0,
    stats: { strength: 10, agility: 26, intelligence: 10, attackSpeed: 0.12, moveSpeed: 20 },
    components: ['yasha', 'ultimate_orb', 'recipe_manta'],
    icon: '🌒', color: 'text-blue-400', category: 'upgrade',
    cooldown: 30, // Default CD, reduced by Talents
    description: 'Active: Creates illusions of yourself.'
  },

  'daedalus': {
    id: 'daedalus', name: 'Daedalus', cost: 0,
    stats: { damage: 88, critChance: 0.30, critDamage: 2.25 },
    components: ['crystalys', 'demon_edge', 'recipe_daedalus'],
    icon: '🏹', color: 'text-red-500', category: 'upgrade',
    description: 'Critical Strike: 30% chance to deal 225% damage.'
  },

  'mjollnir': {
    id: 'mjollnir', name: 'Mjollnir', cost: 0,
    stats: { damage: 24, attackSpeed: 0.70, chainLightning: [0.3, 200] },
    components: ['maelstrom', 'hyperstone', 'recipe_mjollnir'],
    icon: '🔨', color: 'text-blue-200', category: 'upgrade',
    description: 'Chain Lightning: 30% chance to deal 200 magical damage to 4 targets.'
  },

  'mkb': {
    id: 'mkb', name: 'Monkey King Bar', cost: 0,
    stats: { damage: 45, attackSpeed: 0.45, trueStrike: true },
    components: ['demon_edge', 'javelin', 'recipe_mkb'], 
    icon: '📏', color: 'text-yellow-400', category: 'upgrade',
    description: 'True Strike: Prevents your attacks from missing.'
  },

  'heart': {
    id: 'heart', name: 'Heart of Tarrasque', cost: 0,
    stats: { strength: 45, hpMax: 250, hpRegenPct: 0.016 },
    components: ['reaver', 'vitality_booster', 'recipe_heart'],
    icon: '❤️', color: 'text-red-600', category: 'upgrade',
    description: 'Restores 1.6% of max HP per second.'
  }
};

export const getItemTotalCost = (itemId: string): number => {
  const item = ITEMS[itemId];
  if (!item) return 0;
  // If it's a base component or has no components defined, return its direct cost
  if (!item.components || item.components.length === 0) return item.cost;
  // Recursively calculate cost
  return item.components.reduce((sum, id) => sum + getItemTotalCost(id), 0) + item.cost;
};

export const INITIAL_SKILLS: Skill[] = [
  { 
    id: 'manabreak', name: 'Mana Break', level: 0, maxLevel: 4, 
    description: 'Passive: Burns mana from the enemy on each attack. Deals extra physical damage equal to a percentage of the mana burned.', 
    lore: 'The monks of Turstarkuri watched the rugged valleys below their mountain monastery as wave after wave of invaders swept through.',
    color: 'bg-blue-600', type: 'Passive', cooldown: 0, manaCost: 0, lastCast: 0,
    params: {
      'Mana Burn per Hit': [40, 50, 60, 70], // Buffed early game (was 28)
      'Damage as % of Burn': [50, 60, 70, 80]
    }
  },
  { 
    id: 'blink', name: 'DISABLED', level: 0, maxLevel: 4, 
    description: 'This skill has been disabled.', 
    lore: 'Anti-Mage forgot how to blink.',
    color: 'bg-gray-600', type: 'Active', cooldown: 9999, manaCost: 0, lastCast: 0,
    params: {}
  },
  { 
    id: 'counterspell', name: 'Counterspell', level: 0, maxLevel: 4, 
    description: 'Passive: Grants Evasion.\nActive: Burns mana from all nearby enemies (AOE).', 
    lore: 'With focused meditation, Anti-Mage turns the magical energies of his enemies back upon them.',
    color: 'bg-indigo-600', type: 'Active', cooldown: 15, manaCost: 45, lastCast: 0,
    params: {
      'Passive Evasion %': [15, 25, 35, 45], // Buffed (was 10-25)
      'Active Mana Burn': [150, 250, 350, 450],
      'Radius': [500, 500, 500, 500]
    }
  },
  { 
    id: 'manavoid', name: 'Mana Void', level: 0, maxLevel: 3, 
    description: 'Active: Deals damage based on missing mana. Stuns the target.', 
    lore: 'After bringing an enemy to their knees, Anti-Mage punishes them for their reliance on the arcane arts.',
    color: 'bg-fuchsia-700', type: 'Active', cooldown: 70, manaCost: 150, lastCast: 0,
    params: {
      'Damage per Missing Mana': [0.8, 0.95, 1.1],
      'Stun Duration (s)': [1.3, 1.5, 1.8]
    }
  }
];

export const TALENTS: Record<number, Talent[]> = {
  10: [
    { id: 't10_left', name: '+9 Strength', stats: { strength: 9 } },
    { id: 't10_right', name: '+250 Mana', stats: { manaMax: 250 } }
  ],
  15: [
    { id: 't15_left', name: '+0.5s Blink Stun', stats: { } }, // Logic placeholder
    { id: 't15_right', name: '+15 Agility', stats: { agility: 15 } }
  ],
  20: [
    { id: 't20_left', name: '+150 Mana Void Radius', stats: { } }, 
    { id: 't20_right', name: '-1s Blink Cooldown', skillMod: { skillId: 'blink', prop: 'cooldown', value: -1 } }
  ],
  25: [
    { id: 't25_left', name: '-50s Mana Void Cooldown', skillMod: { skillId: 'manavoid', prop: 'cooldown', value: -50 } },
    { id: 't25_right', name: '+20% Counterspell Evasion', stats: { evasion: 0.2 } } 
  ]
};
