// js/data.js

// 1. Full Survivor Registry with Level-Scaling Variables
const SURVIVORS = {
    "Commando": { baseDmg: 12, dmgGrowth: 2.4 },
    "Huntress": { baseDmg: 12, dmgGrowth: 2.4 },
    "MUL-T":    { baseDmg: 11, dmgGrowth: 2.2 },
    "Engineer": { baseDmg: 14, dmgGrowth: 2.8 },
    "Artificer":{ baseDmg: 12, dmgGrowth: 2.4 },
    "Mercenary":{ baseDmg: 12, dmgGrowth: 2.4 },
    "REX":      { baseDmg: 12, dmgGrowth: 2.4 },
    "Loader":   { baseDmg: 12, dmgGrowth: 2.4 },
    "Acrid":    { baseDmg: 15, dmgGrowth: 3.0 },
    "Captain":  { baseDmg: 12, dmgGrowth: 2.4 },
    "Railgunner":{ baseDmg: 12, dmgGrowth: 2.4 },
    "Void Fiend":{ baseDmg: 12, dmgGrowth: 2.4 },
    "Seeker":   { baseDmg: 12, dmgGrowth: 2.4 },
    "Chef":     { baseDmg: 12, dmgGrowth: 2.4 },
    "False Son":{ baseDmg: 15, dmgGrowth: 3.0 }
};

// 2. Item Database with unique proc handling behaviors
const ITEMS = {
    "atg_missile": {
        name: "AtG Missile Mk. 1",
        baseChance: 10,
        stackBehavior: "linear",  // Chance scales by 10% per stack
        procCoeff: 1.0,
        dmgMultBase: 3.0,
        dmgMultStack: 3.0
    },
    "ukulele": {
        name: "Ukulele",
        baseChance: 25,
        stackBehavior: "flat",    // Chance stays 25%, stacks increase targets/radius
        procCoeff: 0.2,
        dmgMultBase: 0.8,
        dmgMultStack: 0.0
    },
    "molten_perforator": {
        name: "Molten Perforator",
        baseChance: 10,
        stackBehavior: "linear",
        procCoeff: 1.0,
        dmgMultBase: 3.0,
        dmgMultStack: 3.0
    },
    "sentient_meat_hook": {
        name: "Sentient Meat Hook",
        baseChance: 20,
        stackBehavior: "hyperbolic", // Dynamic capping formula
        procCoeff: 0.3,
        dmgMultBase: 1.0,
        dmgMultStack: 0.0
    },
    "runic_lens": {
        name: "Runic Lens",
        baseChance: 10,
        stackBehavior: "linear",
        procCoeff: 1.0,
        dmgMultBase: 4.0,
        dmgMultStack: 4.0
    },
    "sticky_bomb": {
        name: "Sticky Bomb",
        baseChance: 5,
        stackBehavior: "linear",
        procCoeff: 0.0, // Bombs detonate later, ending a proc lineage branch
        dmgMultBase: 1.8,
        dmgMultStack: 1.8
    }
};

// 3. Mathematical Helpers for RoR2 mechanics
function getBaseDamage(survivorName, level) {
    const survivor = SURVIVORS[survivorName];
    if (!survivor) return 12.0;
    return survivor.baseDmg + (survivor.dmgGrowth * (level - 1));
}

function getItemChance(itemKey, stacks) {
    const item = ITEMS[itemKey];
    if (!item || stacks <= 0) return 0;
    
    if (item.stackBehavior === "linear") {
        return Math.min(100, item.baseChance * stacks);
    } else if (item.stackBehavior === "hyperbolic") {
        // RoR2 Hyperbolic scaling: 100% * (1 - 1 / (1 + base * stacks))
        return 100 * (1 - 1 / (1 + (item.baseChance / 100) * stacks));
    }
    return item.baseChance; // Flat behavior (like Ukulele)
}
