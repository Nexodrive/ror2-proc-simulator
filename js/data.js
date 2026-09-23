// js/data.js

// ============================================================
// SURVIVORS
// ============================================================

const SURVIVORS = {
    "Commando": {
        baseDmg: 12,
        dmgGrowth: 2.4
    },

    "Huntress": {
        baseDmg: 12,
        dmgGrowth: 2.4
    },

    "MUL-T": {
        baseDmg: 11,
        dmgGrowth: 2.2
    },

    "Engineer": {
        baseDmg: 14,
        dmgGrowth: 2.8
    },

    "Artificer": {
        baseDmg: 12,
        dmgGrowth: 2.4
    },

    "Mercenary": {
        baseDmg: 12,
        dmgGrowth: 2.4
    },

    "REX": {
        baseDmg: 12,
        dmgGrowth: 2.4
    },

    "Loader": {
        baseDmg: 12,
        dmgGrowth: 2.4
    },

    "Acrid": {
        baseDmg: 15,
        dmgGrowth: 3.0
    },

    "Captain": {
        baseDmg: 12,
        dmgGrowth: 2.4
    },

    "Railgunner": {
        baseDmg: 12,
        dmgGrowth: 2.4
    },

    "Void Fiend": {
        baseDmg: 12,
        dmgGrowth: 2.4
    },

    "Seeker": {
        baseDmg: 12,
        dmgGrowth: 2.4
    },

    "Chef": {
        baseDmg: 12,
        dmgGrowth: 2.4
    },

    "False Son": {
        baseDmg: 15,
        dmgGrowth: 3.0
    }
};


// ============================================================
// ITEMS
// ============================================================

const ITEMS = {

    "atg_missile": {
        name: "AtG Missile Mk. 1",
        shortName: "AtG",

        description: "Chance to fire a missile for 300% damage.",

        color: "#ff9d24",

        maxStacks: 10,

        chance: function(stacks) {
            return 0.10 * stacks;
        },

        damageMultiplier: function(stacks) {
            return 3.00 * stacks;
        },

        procCoefficient: 1.0,

        procMask: true
    },


    "ukulele": {
        name: "Ukulele",
        shortName: "Ukulele",

        description: "Chance to fire chain lightning for 80% damage.",

        color: "#58a6ff",

        maxStacks: 10,

        chance: function(stacks) {
            return 0.25;
        },

        damageMultiplier: function(stacks) {
            return 0.80;
        },

        procCoefficient: 0.2,

        procMask: true
    },


    "molten_perforator": {
        name: "Molten Perforator",
        shortName: "Perforator",

        description: "Chance to fire magma balls for 300% damage.",

        color: "#f85149",

        maxStacks: 10,

        chance: function(stacks) {
            return 0.10 * stacks;
        },

        damageMultiplier: function(stacks) {
            return 3.00 * stacks;
        },

        procCoefficient: 1.0,

        procMask: true
    },


    "sentient_meat_hook": {
        name: "Sentient Meat Hook",
        shortName: "Meat Hook",

        description: "Chance to fire hooks for 100% damage.",

        color: "#bc8cff",

        maxStacks: 10,

        chance: function(stacks) {
            return 0.20 * stacks;
        },

        damageMultiplier: function(stacks) {
            return 1.00;
        },

        procCoefficient: 0.33,

        procMask: true
    },


    "sticky_bomb": {
        name: "Sticky Bomb",
        shortName: "Sticky Bomb",

        description: "Chance to attach a bomb dealing 180% damage.",

        color: "#3fb950",

        maxStacks: 10,

        chance: function(stacks) {
            return 0.05 * stacks;
        },

        damageMultiplier: function(stacks) {
            return 1.80 * stacks;
        },

        procCoefficient: 0,

        procMask: true
    },


    "runic_lens": {
        name: "Runic Lens",
        shortName: "Runic Lens",

        description: "Special proc behavior.",

        color: "#d2a8ff",

        maxStacks: 10,

        chance: function(stacks) {
            return 0;
        },

        damageMultiplier: function(stacks) {
            return 0;
        },

        procCoefficient: 1.0,

        procMask: false,

        special: true
    }
};


// ============================================================
// ITEM ORDER
// ============================================================

const ITEM_ORDER = [
    "atg_missile",
    "ukulele",
    "molten_perforator",
    "sentient_meat_hook",
    "sticky_bomb",
    "runic_lens"
];


// ============================================================
// BASE DAMAGE
// ============================================================

function getBaseDamage(survivorName, level) {

    const survivor = SURVIVORS[survivorName];

    if (!survivor) {
        return 0;
    }

    level = Math.max(1, Number(level) || 1);

    return survivor.baseDmg +
        survivor.dmgGrowth * (level - 1);
}


// ============================================================
// NUMBER FORMATTING
// ============================================================

function formatNumber(value, decimals = 2) {

    if (!Number.isFinite(value)) {
        return "0";
    }

    return value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}


function formatPercent(value, decimals = 1) {

    if (!Number.isFinite(value)) {
        return "0%";
    }

    return (value * 100).toFixed(decimals) + "%";
}


// ============================================================
// INVENTORY HELPERS
// ============================================================

function createEmptyInventory() {

    const inventory = {};

    for (const itemKey of ITEM_ORDER) {
        inventory[itemKey] = 0;
    }

    return inventory;
}


function getInventoryCount(inventory) {

    let total = 0;

    for (const itemKey of Object.keys(inventory)) {

        const stacks = Number(inventory[itemKey]) || 0;

        total += Math.max(0, stacks);
    }

    return total;
}
