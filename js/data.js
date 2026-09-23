// js/data.js

// ============================================================
// RISK OF RAIN 2 ITEM DATABASE
// ============================================================
//
// rarity values:
//
// common     = White
// uncommon   = Green
// legendary  = Red
// boss       = Yellow
// lunar      = Blue
// void       = Purple
// equipment  = Orange
// aspect     = Elite/Aspect
// untiered   = Special
//
// ============================================================


// ============================================================
// RARITY COLORS
// ============================================================

const RARITY_COLORS = {

    common: "#ffffff",

    uncommon: "#5acb62",

    legendary: "#d74646",

    boss: "#d7a93d",

    lunar: "#5b9cff",

    void: "#a65cff",

    equipment: "#e88932",

    aspect: "#e88932",

    untiered: "#a0a0a0"

};


// ============================================================
// ITEM DATABASE
// ============================================================
//
// IMPORTANT:
// proc = true means this item can participate in the
// proc calculator.
//
// proc = false means it is still selectable in the item
// database but does not create a proc branch.
//
// ============================================================

const ITEMS = {

    // ========================================================
    // COMMON
    // ========================================================

    "tougher_times": {
        name: "Tougher Times",
        rarity: "common",
        proc: false
    },

    "lens_makers_glasses": {
        name: "Lens-Maker's Glasses",
        rarity: "common",
        proc: false
    },

    "soldiers_syringe": {
        name: "Soldier's Syringe",
        rarity: "common",
        proc: false
    },

    "armor_piercing_rounds": {
        name: "Armor-Piercing Rounds",
        rarity: "common",
        proc: false
    },

    "backup_magazine": {
        name: "Backup Magazine",
        rarity: "common",
        proc: false
    },

    "bison_steak": {
        name: "Bison Steak",
        rarity: "common",
        proc: false
    },

    "bundle_of_fireworks": {
        name: "Bundle of Fireworks",
        rarity: "common",
        proc: true
    },

    "bustling_fungus": {
        name: "Bustling Fungus",
        rarity: "common",
        proc: false
    },

    "crowbar": {
        name: "Crowbar",
        rarity: "common",
        proc: false
    },

    "energy_drink": {
        name: "Energy Drink",
        rarity: "common",
        proc: false
    },

    "focus_crystal": {
        name: "Focus Crystal",
        rarity: "common",
        proc: false
    },

    "gasoline": {
        name: "Gasoline",
        rarity: "common",
        proc: true
    },

    "monster_tooth": {
        name: "Monster Tooth",
        rarity: "common",
        proc: false
    },

    "mocha": {
        name: "Mocha",
        rarity: "common",
        proc: false
    },

    "pauls_goat_hoof": {
        name: "Paul's Goat Hoof",
        rarity: "common",
        proc: false
    },

    "personal_shield_generator": {
        name: "Personal Shield Generator",
        rarity: "common",
        proc: false
    },

    "repulsion_armor_plate": {
        name: "Repulsion Armor Plate",
        rarity: "common",
        proc: false
    },

    "roll_of_pennies": {
        name: "Roll of Pennies",
        rarity: "common",
        proc: false
    },

    "stealthkit": {
        name: "Old War Stealthkit",
        rarity: "common",
        proc: false
    },

    "sticky_bomb": {
        name: "Sticky Bomb",
        rarity: "common",
        proc: true,
        baseChance: 5,
        procCoefficient: 0,
        damage: 180,
        stackDamage: 180,
        chainBehavior: "stop"
    },

    "stun_grenade": {
        name: "Stun Grenade",
        rarity: "common",
        proc: false
    },

    "tri_tip_dagger": {
        name: "Tri-Tip Dagger",
        rarity: "common",
        proc: true,
        baseChance: 10,
        procCoefficient: 0.5,
        damage: 240,
        stackDamage: 240,
        chainBehavior: "normal"
    },

    "warbanner": {
        name: "Warbanner",
        rarity: "common",
        proc: false
    },

    "oddly_shaped_opal": {
        name: "Oddly-shaped Opal",
        rarity: "common",
        proc: false
    },

    "driftwood": {
        name: "Driftwood",
        rarity: "common",
        proc: false
    },


    // ========================================================
    // UNCOMMON
    // ========================================================

    "atg_missile": {
        name: "AtG Missile Mk. 1",
        rarity: "uncommon",
        proc: true,

        baseChance: 10,

        procCoefficient: 1.0,

        damage: 300,

        stackDamage: 300,

        chainBehavior: "normal"
    },

    "ukulele": {
        name: "Ukulele",
        rarity: "uncommon",
        proc: true,

        baseChance: 25,

        procCoefficient: 0.2,

        damage: 80,

        stackDamage: 0,

        chainBehavior: "normal"
    },

    "will_o_the_wisp": {
        name: "Will-o'-the-wisp",
        rarity: "uncommon",
        proc: true,

        baseChance: 100,

        procCoefficient: 0,

        damage: 350,

        stackDamage: 350,

        chainBehavior: "stop"
    },

    "gasoline_green": {
        name: "Gasoline",
        rarity: "uncommon",
        proc: true,

        baseChance: 100,

        procCoefficient: 0,

        damage: 150,

        stackDamage: 75,

        chainBehavior: "stop"
    },

    "harvesters_scythe": {
        name: "Harvester's Scythe",
        rarity: "uncommon",
        proc: false
    },

    "harvesters_scythe_old": {
        name: "Harvester's Scythe",
        rarity: "uncommon",
        proc: false
    },

    "infusion": {
        name: "Infusion",
        rarity: "uncommon",
        proc: false
    },

    "kjaro_band": {
        name: "Kjaro's Band",
        rarity: "uncommon",
        proc: true,

        baseChance: 8,

        procCoefficient: 1.0,

        damage: 300,

        stackDamage: 300,

        chainBehavior: "normal"
    },

    "runald_band": {
        name: "Runald's Band",
        rarity: "uncommon",
        proc: true,

        baseChance: 8,

        procCoefficient: 1.0,

        damage: 400,

        stackDamage: 400,

        chainBehavior: "normal"
    },

    "chronobauble": {
        name: "Chronobauble",
        rarity: "uncommon",
        proc: false
    },

    "death_mark": {
        name: "Death Mark",
        rarity: "uncommon",
        proc: false
    },

    "fuel_cell": {
        name: "Fuel Cell",
        rarity: "uncommon",
        proc: false
    },

    "predatory_instincts": {
        name: "Predatory Instincts",
        rarity: "uncommon",
        proc: false
    },

    "razorwire": {
        name: "Razorwire",
        rarity: "uncommon",
        proc: true,

        baseChance: 100,

        procCoefficient: 0.5,

        damage: 160,

        stackDamage: 160,

        chainBehavior: "normal"
    },

    "red_whip": {
        name: "Red Whip",
        rarity: "uncommon",
        proc: false
    },

    "rose_buckler": {
        name: "Rose Buckler",
        rarity: "uncommon",
        proc: false
    },

    "shipping_request_form": {
        name: "Shipping Request Form",
        rarity: "uncommon",
        proc: false
    },

    "shatterspleen": {
        name: "Shatterspleen",
        rarity: "uncommon",
        proc: true,

        baseChance: 100,

        procCoefficient: 0,

        damage: 240,

        stackDamage: 240,

        chainBehavior: "stop"
    },

    "bandolier": {
        name: "Bandolier",
        rarity: "uncommon",
        proc: false
    },

    "berzerkers_pauldrons": {
        name: "Berzerker's Pauldron",
        rarity: "uncommon",
        proc: false
    },

    "hopoo_feather": {
        name: "Hopoo Feather",
        rarity: "uncommon",
        proc: false
    },

    "h3ad_5t_v2": {
        name: "H3AD-5T v2",
        rarity: "uncommon",
        proc: true,

        baseChance: 100,

        procCoefficient: 0,

        damage: 1000,

        stackDamage: 1000,

        chainBehavior: "stop"
    },


    // ========================================================
    // LEGENDARY
    // ========================================================

    "57_leaf_clover": {
        name: "57 Leaf Clover",
        rarity: "legendary",
        proc: false
    },

    "aegis": {
        name: "Aegis",
        rarity: "legendary",
        proc: false
    },

    "alien_head": {
        name: "Alien Head",
        rarity: "legendary",
        proc: false
    },

    "brainstalks": {
        name: "Brainstalks",
        rarity: "legendary",
        proc: false
    },

    "ceremonial_dagger": {
        name: "Ceremonial Dagger",
        rarity: "legendary",
        proc: true,

        baseChance: 100,

        procCoefficient: 0,

        damage: 150,

        stackDamage: 150,

        chainBehavior: "stop"
    },

    "charged_perforator": {
        name: "Charged Perforator",
        rarity: "legendary",
        proc: true,

        baseChance: 10,

        procCoefficient: 1.0,

        damage: 300,

        stackDamage: 300,

        chainBehavior: "normal"
    },

    "clover": {
        name: "57 Leaf Clover",
        rarity: "legendary",
        proc: false
    },

    "defensive_microbots": {
        name: "Defensive Microbots",
        rarity: "legendary",
        proc: false
    },

    "dio_best_friend": {
        name: "Dio's Best Friend",
        rarity: "legendary",
        proc: false
    },

    "laser_scope": {
        name: "Laser Scope",
        rarity: "legendary",
        proc: false
    },

    "resonance_disc": {
        name: "Resonance Disc",
        rarity: "legendary",
        proc: true,

        baseChance: 100,

        procCoefficient: 0,

        damage: 300,

        stackDamage: 300,

        chainBehavior: "stop"
    },

    "sentient_meat_hook": {
        name: "Sentient Meat Hook",
        rarity: "legendary",
        proc: true,

        baseChance: 20,

        procCoefficient: 0.3,

        damage: 100,

        stackDamage: 0,

        chainBehavior: "normal"
    },

    "shattering_justice": {
        name: "Shattering Justice",
        rarity: "legendary",
        proc: false
    },

    "symbiotic_scorpion": {
        name: "Symbiotic Scorpion",
        rarity: "legendary",
        proc: false
    },

    "trophy_hunters_tricorn": {
        name: "Trophy Hunter's Tricorn",
        rarity: "legendary",
        proc: false
    },

    "wake_of_vultures": {
        name: "Wake of Vultures",
        rarity: "legendary",
        proc: false
    },


    // ========================================================
    // LUNAR
    // ========================================================

    "beads_of_fealty": {
        name: "Beads of Fealty",
        rarity: "lunar",
        proc: false
    },

    "brittle_crown": {
        name: "Brittle Crown",
        rarity: "lunar",
        proc: false
    },

    "corpsebloom": {
        name: "Corpsebloom",
        rarity: "lunar",
        proc: false
    },

    "egocentrism": {
        name: "Egocentrism",
        rarity: "lunar",
        proc: false
    },

    "focused_convergence": {
        name: "Focused Convergence",
        rarity: "lunar",
        proc: false
    },

    "gesture_of_the_drowned": {
        name: "Gesture of the Drowned",
        rarity: "lunar",
        proc: false
    },

    "hooks_of_heresy": {
        name: "Hooks of Heresy",
        rarity: "lunar",
        proc: false
    },

    "light_flux_pauldrons": {
        name: "Light Flux Pauldron",
        rarity: "lunar",
        proc: false
    },

    "mercurial_rachis": {
        name: "Mercurial Rachis",
        rarity: "lunar",
        proc: false
    },

    "purity": {
        name: "Purity",
        rarity: "lunar",
        proc: false
    },

    "shaped_glass": {
        name: "Shaped Glass",
        rarity: "lunar",
        proc: false
    },

    "stone_flux_pauldron": {
        name: "Stone Flux Pauldron",
        rarity: "lunar",
        proc: false
    },

    "transcendence": {
        name: "Transcendence",
        rarity: "lunar",
        proc: false
    },


    // ========================================================
    // VOID
    // ========================================================

    "benthic_bloom": {
        name: "Benthic Bloom",
        rarity: "void",
        proc: false
    },

    "corrupt_57_leaf_clover": {
        name: "Benthic Bloom",
        rarity: "void",
        proc: false
    },

    "encrusted_key": {
        name: "Encrusted Key",
        rarity: "void",
        proc: false
    },

    "lost_seers_lenses": {
        name: "Lost Seer's Lenses",
        rarity: "void",
        proc: true,

        baseChance: 0.5,

        procCoefficient: 0,

        damage: 0,

        stackDamage: 0,

        chainBehavior: "stop"
    },

    "needletick": {
        name: "Needletick",
        rarity: "void",
        proc: true,

        baseChance: 10,

        procCoefficient: 0.5,

        damage: 400,

        stackDamage: 400,

        chainBehavior: "normal"
    },

    "plasma_shrimp": {
        name: "Plasma Shrimp",
        rarity: "void",
        proc: true,

        baseChance: 100,

        procCoefficient: 0.2,

        damage: 40,

        stackDamage: 40,

        chainBehavior: "normal"
    },

    "polylute": {
        name: "Polylute",
        rarity: "void",
        proc: true,

        baseChance: 25,

        procCoefficient: 0.2,

        damage: 60,

        stackDamage: 60,

        chainBehavior: "normal"
    },

    "safer_spaces": {
        name: "Safer Spaces",
        rarity: "void",
        proc: false
    },

    "singularity_band": {
        name: "Singularity Band",
        rarity: "void",
        proc: true,

        baseChance: 4,

        procCoefficient: 1.0,

        damage: 1000,

        stackDamage: 1000,

        chainBehavior: "normal"
    },

    "tentabauble": {
        name: "Tentabauble",
        rarity: "void",
        proc: false
    },

    "void_fiend_item": {
        name: "Void Fiend's Corrupted Item",
        rarity: "void",
        proc: false
    },

    "void_sentinel": {
        name: "Voidsent Flame",
        rarity: "void",
        proc: true,

        baseChance: 100,

        procCoefficient: 0,

        damage: 260,

        stackDamage: 260,

        chainBehavior: "stop"
    },

    "weeping_fungus": {
        name: "Weeping Fungus",
        rarity: "void",
        proc: false
    },


    // ========================================================
    // BOSS / PLANET
    // ========================================================

    "halcyon_seed": {
        name: "Halcyon Seed",
        rarity: "boss",
        proc: false
    },

    "happiest_mask": {
        name: "Happiest Mask",
        rarity: "boss",
        proc: false
    },

    "little_disciple": {
        name: "Little Disciple",
        rarity: "boss",
        proc: true,

        baseChance: 100,

        procCoefficient: 0,

        damage: 100,

        stackDamage: 100,

        chainBehavior: "stop"
    },

    "molten_perforator": {
        name: "Molten Perforator",
        rarity: "boss",
        proc: true,

        baseChance: 10,

        procCoefficient: 0.7,

        damage: 300,

        stackDamage: 300,

        chainBehavior: "normal"
    },

    "queen_gland": {
        name: "Queen's Gland",
        rarity: "boss",
        proc: false
    },

    "shatterspleen_boss": {
        name: "Shatterspleen",
        rarity: "boss",
        proc: true,

        baseChance: 100,

        procCoefficient: 0,

        damage: 240,

        stackDamage: 240,

        chainBehavior: "stop"
    },

    "titanic_knurl": {
        name: "Titanic Knurl",
        rarity: "boss",
        proc: false
    },


    // ========================================================
    // SPECIAL / WORLD UNIQUE
    // ========================================================

    "irradiant_pearl": {
        name: "Irradiant Pearl",
        rarity: "untiered",
        proc: false
    },

    "pearl": {
        name: "Pearl",
        rarity: "untiered",
        proc: false
    },

    "item_scrap_white": {
        name: "Item Scrap, White",
        rarity: "untiered",
        proc: false
    },

    "item_scrap_green": {
        name: "Item Scrap, Green",
        rarity: "untiered",
        proc: false
    },

    "item_scrap_red": {
        name: "Item Scrap, Red",
        rarity: "untiered",
        proc: false
    },

    "item_scrap_yellow": {
        name: "Item Scrap, Yellow",
        rarity: "untiered",
        proc: false
    },


    // ========================================================
    // DLC / ADDITIONAL ITEMS
    // ========================================================

    "bottled_chaos": {
        name: "Bottled Chaos",
        rarity: "void",
        proc: false
    },

    "eulogy_zero": {
        name: "Eulogy Zero",
        rarity: "lunar",
        proc: false
    },

    "executive_card": {
        name: "Executive Card",
        rarity: "lunar",
        proc: false
    },

    "shurikens": {
        name: "Shuriken",
        rarity: "uncommon",
        proc: true,

        baseChance: 100,

        procCoefficient: 0,

        damage: 400,

        stackDamage: 100,

        chainBehavior: "stop"
    },

    "pluripotent_larva": {
        name: "Pluripotent Larva",
        rarity: "void",
        proc: false
    },

    "encased_cerebellum": {
        name: "Encased Cerebellum",
        rarity: "boss",
        proc: false
    },

    "spare_drone_parts": {
        name: "Spare Drone Parts",
        rarity: "legendary",
        proc: true,

        baseChance: 10,

        procCoefficient: 1,

        damage: 150,

        stackDamage: 150,

        chainBehavior: "normal"
    },

    "symbiotic_scorpion_dlc": {
        name: "Symbiotic Scorpion",
        rarity: "legendary",
        proc: false
    },

    "void_cradle_item": {
        name: "Void Item",
        rarity: "void",
        proc: false
    },


    // ========================================================
    // SEEKERS OF THE STORM
    // ========================================================

    "warped_echo": {
        name: "Warped Echo",
        rarity: "uncommon",
        proc: false
    },

    "unstable_transmitter": {
        name: "Unstable Transmitter",
        rarity: "legendary",
        proc: false
    },

    "growth_nectar": {
        name: "Growth Nectar",
        rarity: "uncommon",
        proc: false
    },

    "luminous_shot": {
        name: "Luminous Shot",
        rarity: "uncommon",
        proc: true,

        baseChance: 100,

        procCoefficient: 0,

        damage: 100,

        stackDamage: 100,

        chainBehavior: "stop"
    },

    "prayer_beads": {
        name: "Prayer Beads",
        rarity: "uncommon",
        proc: false
    },

    "breaching_fin": {
        name: "Breaching Fin",
        rarity: "uncommon",
        proc: false
    },


    // ========================================================
    // ALLOYED COLLECTIVE
    // ========================================================

    "collectors_compulsion": {
        name: "Collector's Compulsion",
        rarity: "uncommon",
        proc: false
    },

    "faraday_spur": {
        name: "Faraday Spur",
        rarity: "legendary",
        proc: true,

        baseChance: 10,

        procCoefficient: 1,

        damage: 300,

        stackDamage: 300,

        chainBehavior: "normal"
    },

    "box_of_dynamite": {
        name: "Box of Dynamite",
        rarity: "common",
        proc: true,

        baseChance: 100,

        procCoefficient: 0,

        damage: 100,

        stackDamage: 100,

        chainBehavior: "stop"
    },

    "neutronium_weight": {
        name: "Neutronium Weight",
        rarity: "uncommon",
        proc: false
    },

    "substandard_duplicator": {
        name: "Substandard Duplicator",
        rarity: "uncommon",
        proc: false
    },

    "seared_steak": {
        name: "Seared Steak",
        rarity: "untiered",
        proc: false
    },

    "ultimate_meal": {
        name: "Ultimate Meal",
        rarity: "untiered",
        proc: false
    }

};


// ============================================================
// EQUIPMENT
// ============================================================
//
// Equipment is separate from passive items.
//
// ============================================================

const EQUIPMENT = {

    "foreign_fruit": {
        name: "Foreign Fruit",
        rarity: "equipment"
    },

    "blast_shower": {
        name: "Blast Shower",
        rarity: "equipment"
    },

    "back_up": {
        name: "The Back-up",
        rarity: "equipment"
    },

    "bfg": {
        name: "Preon Accumulator",
        rarity: "equipment"
    },

    "crudely_drawn_buddy": {
        name: "Crudely Drawn Buddy",
        rarity: "equipment"
    },

    "crowdfunder": {
        name: "Crowdfunder",
        rarity: "equipment"