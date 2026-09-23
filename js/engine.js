// js/engine.js

// ============================================================
// PROC ENGINE
// ============================================================

// Maximum number of recursive generations.
// This prevents accidental infinite proc chains.
const MAX_PROC_DEPTH = 8;


// ============================================================
// LUCK
// ============================================================

// Returns the probability of at least one successful roll
// when a proc has multiple attempts.
//
// Example:
// 10% chance with 0 Luck  -> 10%
// 10% chance with 1 Luck  -> 19%
// 10% chance with 2 Luck  -> 27.1%
//
// Positive Luck gives additional rolls.
// Negative Luck reduces the effective chance.
function getLuckAdjustedChance(chance, luck) {

    chance = Math.max(0, Math.min(1, chance));

    luck = Number(luck) || 0;

    if (luck === 0) {
        return chance;
    }

    if (luck > 0) {

        let attempts = Math.floor(luck) + 1;

        return 1 - Math.pow(
            1 - chance,
            attempts
        );
    }

    // Negative Luck is handled as a reduction in probability.
    // This keeps the calculator stable for negative values.
    const multiplier = 1 + (luck / 100);

    return Math.max(
        0,
        Math.min(1, chance * multiplier)
    );
}


// ============================================================
// PROC CHANCE
// ============================================================

function getProcChance(
    itemKey,
    stacks,
    procCoefficient = 1,
    luck = 0
) {

    const item = ITEMS[itemKey];

    if (!item) {
        return 0;
    }

    if (stacks <= 0) {
        return 0;
    }

    if (item.special) {
        return 0;
    }

    let rawChance = item.chance(stacks);

    rawChance *= procCoefficient;

    rawChance = Math.max(
        0,
        Math.min(1, rawChance)
    );

    return getLuckAdjustedChance(
        rawChance,
        luck
    );
}


// ============================================================
// ITEM DAMAGE
// ============================================================

function getProcDamage(
    itemKey,
    stacks,
    sourceDamage
) {

    const item = ITEMS[itemKey];

    if (!item) {
        return 0;
    }

    if (stacks <= 0) {
        return 0;
    }

    const multiplier = item.damageMultiplier(stacks);

    return sourceDamage * multiplier;
}


// ============================================================
// NODE CREATION
// ============================================================

function createRootNode(damage) {

    return {
        id: "root",

        type: "root",

        itemKey: null,

        name: "Initial Attack",

        shortName: "Attack",

        depth: 0,

        damage: damage,

        expectedDamage: damage,

        chance: 1,

        procCoefficient: 1,

        sourceDamage: damage,

        children: []
    };
}


function createProcNode(
    itemKey,
    stacks,
    sourceDamage,
    chance,
    procDamage,
    depth,
    parentId
) {

    const item = ITEMS[itemKey];

    return {

        id:
            parentId +
            "-" +
            itemKey +
            "-" +
            depth,

        type: "proc",

        itemKey: itemKey,

        name: item.name,

        shortName: item.shortName,

        depth: depth,

        stacks: stacks,

        damage: procDamage,

        expectedDamage: procDamage * chance,

        chance: chance,

        procCoefficient: item.procCoefficient,

        sourceDamage: sourceDamage,

        children: []
    };
}


// ============================================================
// PROC TREE GENERATION
// ============================================================

function buildProcTree(options) {

    const {

        survivor = "Commando",

        level = 1,

        damage = null,

        procCoefficient = 1,

        luck = 0,

        inventory = {}

    } = options || {};


    // --------------------------------------------------------
    // Determine starting damage
    // --------------------------------------------------------

    let baseDamage;

    if (damage === null || damage === undefined) {

        baseDamage = getBaseDamage(
            survivor,
            level
        );

    } else {

        baseDamage = Number(damage) || 0;
    }


    // --------------------------------------------------------
    // Create root
    // --------------------------------------------------------

    const root = createRootNode(
        baseDamage
    );


    // --------------------------------------------------------
    // Build recursive tree
    // --------------------------------------------------------

    buildChildren(
        root,
        inventory,
        procCoefficient,
        luck,
        0,
        new Set()
    );


    // --------------------------------------------------------
    // Calculate totals
    // --------------------------------------------------------

    const totals = calculateTreeTotals(
        root
    );


    return {

        root: root,

        baseDamage: baseDamage,

        expectedProcDamage: totals.procDamage,

        totalExpectedDamage: totals.totalDamage,

        nodeCount: totals.nodeCount,

        maxDepth: totals.maxDepth
    };
}


// ============================================================
// RECURSIVE CHILD GENERATION
// ============================================================

function buildChildren(
    parentNode,
    inventory,
    incomingProcCoefficient,
    luck,
    depth,
    history
) {

    if (depth >= MAX_PROC_DEPTH) {
        return;
    }


    for (const itemKey of ITEM_ORDER) {

        const stacks = Number(
            inventory[itemKey] || 0
        );


        // No item in inventory.
        if (stacks <= 0) {
            continue;
        }


        const item = ITEMS[itemKey];

        if (!item) {
            continue;
        }


        // Special items are handled separately later.
        if (item.special) {
            continue;
        }


        // ----------------------------------------------------
        // Proc masks / chain protection
        // ----------------------------------------------------

        if (history.has(itemKey)) {
            continue;
        }


        // ----------------------------------------------------
        // Calculate chance
        // ----------------------------------------------------

        const chance = getProcChance(
            itemKey,
            stacks,
            incomingProcCoefficient,
            luck
        );


        if (chance <= 0) {
            continue;
        }


        // ----------------------------------------------------
        // Calculate damage
        // ----------------------------------------------------

        const procDamage = getProcDamage(
            itemKey,
            stacks,
            parentNode.damage
        );


        if (procDamage <= 0) {
            continue;
        }


        // ----------------------------------------------------
        // Create node
        // ----------------------------------------------------

        const childNode = createProcNode(
            itemKey,
            stacks,
            parentNode.damage,
            chance,
            procDamage,
            depth + 1,
            parentNode.id
        );


        // ----------------------------------------------------
        // Add child to tree
        // ----------------------------------------------------

        parentNode.children.push(
            childNode
        );


        // ----------------------------------------------------
        // Continue the proc chain
        // ----------------------------------------------------

        const nextHistory = new Set(
            history
        );

        nextHistory.add(
            itemKey
        );


        // Items with a zero proc coefficient
        // terminate the chain.
        if (item.procCoefficient <= 0) {
            continue;
        }


        buildChildren(
            childNode,
            inventory,
            item.procCoefficient,
            luck,
            depth + 1,
            nextHistory
        );
    }
}


// ============================================================
// TREE TOTALS
// ============================================================

function calculateTreeTotals(root) {

    let procDamage = 0;

    let totalDamage = 0;

    let nodeCount = 0;

    let maxDepth = 0;


    function walk(node, probability) {

        nodeCount++;

        maxDepth = Math.max(
            maxDepth,
            node.depth
        );


        // Root attack always happens.
        if (node.type === "root") {

            totalDamage += node.damage;

        } else {

            const expectedDamage =
                node.damage *
                probability;

            procDamage += expectedDamage;

            totalDamage += expectedDamage;
        }


        for (const child of node.children) {

            const childProbability =
                probability *
                child.chance;


            walk(
                child,
                childProbability
            );
        }
    }


    walk(root, 1);


    return {
        procDamage: procDamage,
        totalDamage: totalDamage,
        nodeCount: nodeCount,
        maxDepth: maxDepth
    };
}


// ============================================================
// FLATTEN TREE
// ============================================================

// Converts the nested tree into a simple array.
// graph.js will use this when creating visual nodes.

function flattenProcTree(root) {

    const nodes = [];
    const edges = [];


    function walk(node) {

        nodes.push(node);


        for (const child of node.children) {

            edges.push({
                source: node.id,
                target: child.id
            });


            walk(child);
        }
    }


    walk(root);


    return {
        nodes: nodes,
        edges: edges
    };
}


// ============================================================
// FIND NODE
// ============================================================

function findProcNode(
    root,
    nodeId
) {

    if (root.id === nodeId) {
        return root;
    }


    for (const child of root.children) {

        const result = findProcNode(
            child,
            nodeId
        );


        if (result) {
            return result;
        }
    }


    return null;
}


// ============================================================
// TREE SUMMARY
// ============================================================

function getTreeSummary(result) {

    if (!result) {

        return {
            baseDamage: 0,
            expectedProcDamage: 0,
            totalExpectedDamage: 0,
            nodeCount: 0,
            maxDepth: 0
        };
    }


    return {

        baseDamage:
            result.baseDamage,

        expectedProcDamage:
            result.expectedProcDamage,

        totalExpectedDamage:
            result.totalExpectedDamage,

        nodeCount:
            result.nodeCount,

        maxDepth:
            result.maxDepth
    };
}
