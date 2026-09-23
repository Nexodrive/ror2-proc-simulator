// js/engine.js


// ============================================================
// PROC ENGINE
// ============================================================

const MAX_PROC_DEPTH = 8;


// ============================================================
// LUCK
// ============================================================

function getLuckAdjustedChance(
    chance,
    luck
) {

    chance =
        Math.max(
            0,
            Math.min(
                1,
                chance
            )
        );


    luck =
        Number(luck) || 0;


    if (luck === 0) {

        return chance;

    }


    if (luck > 0) {

        const attempts =
            Math.floor(luck) + 1;


        return (
            1 -
            Math.pow(
                1 - chance,
                attempts
            )
        );

    }


    const multiplier =
        1 + luck / 100;


    return Math.max(
        0,
        Math.min(
            1,
            chance * multiplier
        )
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

    const item =
        ITEMS[itemKey];


    if (!item) {

        return 0;

    }


    if (stacks <= 0) {

        return 0;

    }


    if (item.special) {

        return 0;

    }


    let rawChance =
        item.chance(
            stacks
        );


    rawChance *=
        procCoefficient;


    rawChance =
        Math.max(
            0,
            Math.min(
                1,
                rawChance
            )
        );


    return getLuckAdjustedChance(
        rawChance,
        luck
    );

}


// ============================================================
// PROC DAMAGE
// ============================================================

function getProcDamage(
    itemKey,
    stacks,
    sourceDamage
) {

    const item =
        ITEMS[itemKey];


    if (!item) {

        return 0;

    }


    if (stacks <= 0) {

        return 0;

    }


    const multiplier =
        item.damageMultiplier(
            stacks
        );


    return (
        sourceDamage *
        multiplier
    );

}


// ============================================================
// ROOT NODE
// ============================================================

function createRootNode(
    damage
) {

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

        stacks: 1,

        children: []

    };

}


// ============================================================
// PROC NODE
// ============================================================

function createProcNode(
    itemKey,
    stacks,
    sourceDamage,
    chance,
    procDamage,
    depth,
    parentId
) {

    const item =
        ITEMS[itemKey];


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

        expectedDamage:
            procDamage *
            chance,

        chance: chance,

        procCoefficient:
            item.procCoefficient,

        sourceDamage:
            sourceDamage,

        children: []

    };

}


// ============================================================
// BUILD TREE
// ============================================================

function buildProcTree(
    options
) {

    const {

        survivor = "Commando",

        level = 1,

        damage = null,

        procCoefficient = 1,

        luck = 0,

        inventory = {}

    } = options || {};


    let baseDamage;


    if (
        damage === null ||
        damage === undefined
    ) {

        baseDamage =
            getBaseDamage(
                survivor,
                level
            );

    } else {

        baseDamage =
            Number(damage) || 0;

    }


    const root =
        createRootNode(
            baseDamage
        );


    buildChildren(
        root,
        inventory,
        procCoefficient,
        luck,
        0,
        new Set()
    );


    const totals =
        calculateTreeTotals(
            root
        );


    return {

        root: root,

        baseDamage:
            baseDamage,

        expectedProcDamage:
            totals.procDamage,

        totalExpectedDamage:
            totals.totalDamage,

        nodeCount:
            totals.nodeCount,

        maxDepth:
            totals.maxDepth

    };

}


// ============================================================
// BUILD CHILDREN
// ============================================================

function buildChildren(
    parentNode,
    inventory,
    incomingProcCoefficient,
    luck,
    depth,
    history
) {

    if (
        depth >=
        MAX_PROC_DEPTH
    ) {

        return;

    }


    for (
        const itemKey of ITEM_ORDER
    ) {

        const stacks =
            Number(
                inventory[itemKey] || 0
            );


        if (stacks <= 0) {

            continue;

        }


        const item =
            ITEMS[itemKey];


        if (!item) {

            continue;

        }


        if (item.special) {

            continue;

        }


        if (
            history.has(itemKey)
        ) {

            continue;

        }


        const chance =
            getProcChance(
                itemKey,
                stacks,
                incomingProcCoefficient,
                luck
            );


        if (chance <= 0) {

            continue;

        }


        const procDamage =
            getProcDamage(
                itemKey,
                stacks,
                parentNode.damage
            );


        if (procDamage <= 0) {

            continue;

        }


        const childNode =
            createProcNode(
                itemKey,
                stacks,
                parentNode.damage,
                chance,
                procDamage,
                depth + 1,
                parentNode.id
            );


        parentNode.children.push(
            childNode
        );


        const nextHistory =
            new Set(
                history
            );


        nextHistory.add(
            itemKey
        );


        if (
            item.procCoefficient <= 0
        ) {

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

function calculateTreeTotals(
    root
) {

    let procDamage = 0;

    let totalDamage = 0;

    let nodeCount = 0;

    let maxDepth = 0;


    function walk(
        node,
        probability
    ) {

        nodeCount++;


        maxDepth =
            Math.max(
                maxDepth,
                node.depth
            );


        if (
            node.type === "root"
        ) {

            totalDamage +=
                node.damage;

        } else {

            const expectedDamage =
                node.damage *
                probability;


            procDamage +=
                expectedDamage;


            totalDamage +=
                expectedDamage;

        }


        for (
            const child of node.children
        ) {

            const childProbability =
                probability *
                child.chance;


            walk(
                child,
                childProbability
            );

        }

    }


    walk(
        root,
        1
    );


    return {

        procDamage:
            procDamage,

        totalDamage:
            totalDamage,

        nodeCount:
            nodeCount,

        maxDepth:
            maxDepth

    };

}


// ============================================================
// FLATTEN TREE
// ============================================================

function flattenProcTree(
    root
) {

    const nodes = [];

    const edges = [];


    function walk(
        node
    ) {

        nodes.push(
            node
        );


        for (
            const child of node.children
        ) {

            edges.push({

                source:
                    node.id,

                target:
                    child.id

            });


            walk(
                child
            );

        }

    }


    walk(
        root
    );


    return {

        nodes:
            nodes,

        edges:
            edges

    };

}


// ============================================================
// FIND NODE
// ============================================================

function findProcNode(
    root,
    nodeId
) {

    if (
        root.id === nodeId
    ) {

        return root;

    }


    for (
        const child of root.children
    ) {

        const result =
            findProcNode(
                child,
                nodeId
            );


        if (result) {

            return result;

        }

    }


    return null;

}
