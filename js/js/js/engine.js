// js/engine.js

function rollWithLuck(rawChance, clovers) {
    let prob = rawChance / 100;
    // Clovers grant 'n' extra attempts to trigger a successful true state
    for (let r = 0; r <= clovers; r++) {
        if (Math.random() < prob) return true;
    }
    return false;
}

function simulateSingleHit(procCoeff, currentDmg, inventory, clovers, chainHistory = new Set()) {
    let branchDamage = 0;
    let localTreeNode = {};
    const hasRunicLens = (inventory["runic_lens"] || 0) > 0;

    for (const [itemKey, stacks] of Object.entries(inventory)) {
        if (stacks <= 0 || !ITEMS[itemKey]) continue;

        // CRITICAL GAME RULE: Prevent an item from looping onto itself
        // unless overridden by holding a active Runic Lens stack
        if (chainHistory.has(itemKey) && !hasRunicLens) {
            continue;
        }

        const item = ITEMS[itemKey];
        const baseItemChance = getItemChance(itemKey, stacks);
        const actualChance = baseItemChance * procCoeff;

        if (rollWithLuck(actualChance, clovers)) {
            // RoR2 TOTAL DAMAGE scaling formula
            const itemDmg = currentDmg * (item.dmgMultBase + (item.dmgMultStack * (stacks - 1)));
            branchDamage += itemDmg;

            // Clone the history array to lock down this branch's unique execution path
            let nextHistory = new Set(chainHistory);
            nextHistory.add(itemKey);

            // RECURSIVE CHAIN EVENT
            const subResult = simulateSingleHit(item.procCoeff, itemDmg, inventory, clovers, nextHistory);
            
            branchDamage += subResult.damage;
            localTreeNode[item.name] = subResult.tree;
        }
    }

    return { damage: branchDamage, tree: localTreeNode };
}
