// js/app.js

// ============================================================
// APPLICATION STATE
// ============================================================

const state = {

    survivor: "Commando",

    level: 1,

    damage: null,

    procCoefficient: 1,

    luck: 0,

    inventory: createEmptyInventory(),

    currentResult: null,

    selectedNode: null

};


// ============================================================
// DOM ELEMENTS
// ============================================================

const survivorSelect =
    document.getElementById("survivorSelect");

const levelInput =
    document.getElementById("levelInput");

const damageInput =
    document.getElementById("damageInput");

const procCoefficientInput =
    document.getElementById("procCoefficientInput");

const luckInput =
    document.getElementById("luckInput");

const inventoryGrid =
    document.getElementById("inventoryGrid");

const inventorySummary =
    document.getElementById("inventorySummary");

const calculateBtn =
    document.getElementById("calculateBtn");

const resetViewBtn =
    document.getElementById("resetViewBtn");

const treeModeBtn =
    document.getElementById("treeModeBtn");

const mathModeBtn =
    document.getElementById("mathModeBtn");

const procTree =
    document.getElementById("procTree");

const mathPanel =
    document.getElementById("mathPanel");

const baseDamageDisplay =
    document.getElementById("baseDamageDisplay");

const expectedDamageDisplay =
    document.getElementById("expectedDamageDisplay");

const totalDamageDisplay =
    document.getElementById("totalDamageDisplay");

const selectedNodeName =
    document.getElementById("selectedNodeName");

const selectedNodeType =
    document.getElementById("selectedNodeType");

const detailDamage =
    document.getElementById("detailDamage");

const detailChance =
    document.getElementById("detailChance");

const detailProcCoefficient =
    document.getElementById("detailProcCoefficient");

const detailExpectedDamage =
    document.getElementById("detailExpectedDamage");

const calculationText =
    document.getElementById("calculationText");

const mathContent =
    document.getElementById("mathContent");


// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    initializeInventory();

    initializeControls();

    updateDamageFromLevel();

    updateInventoryDisplay();

    selectRootNode();

    calculate();

});


// ============================================================
// CONTROLS
// ============================================================

function initializeControls() {

    survivorSelect.addEventListener(
        "change",
        () => {

            state.survivor =
                survivorSelect.value;

            updateDamageFromLevel();

            calculate();
        }
    );


    levelInput.addEventListener(
        "input",
        () => {

            state.level =
                Math.max(
                    1,
                    Number(levelInput.value) || 1
                );

            updateDamageFromLevel();
        }
    );


    damageInput.addEventListener(
        "input",
        () => {

            const value =
                Number(damageInput.value);

            if (
                damageInput.value !== "" &&
                Number.isFinite(value)
            ) {

                state.damage = value;

            } else {

                state.damage = null;
            }
        }
    );


    procCoefficientInput.addEventListener(
        "input",
        () => {

            state.procCoefficient =
                Math.max(
                    0,
                    Number(procCoefficientInput.value) || 0
                );
        }
    );


    luckInput.addEventListener(
        "input",
        () => {

            state.luck =
                Number(luckInput.value) || 0;
        }
    );


    calculateBtn.addEventListener(
        "click",
        calculate
    );


    resetViewBtn.addEventListener(
        "click",
        resetView
    );


    treeModeBtn.addEventListener(
        "click",
        () => {

            setViewMode("tree");
        }
    );


    mathModeBtn.addEventListener(
        "click",
        () => {

            setViewMode("math");
        }
    );
}


// ============================================================
// INVENTORY
// ============================================================

function initializeInventory() {

    inventoryGrid.innerHTML = "";


    for (const itemKey of ITEM_ORDER) {

        const item =
            ITEMS[itemKey];


        const card =
            document.createElement("div");

        card.className =
            "item-card";


        const name =
            document.createElement("span");

        name.className =
            "item-name";

        name.textContent =
            item.name;


        const minus =
            document.createElement("button");

        minus.className =
            "item-btn";

        minus.type =
            "button";

        minus.textContent =
            "−";


        const count =
            document.createElement("span");

        count.className =
            "item-count";

        count.id =
            `count-${itemKey}`;


        const plus =
            document.createElement("button");

        plus.className =
            "item-btn";

        plus.type =
            "button";

        plus.textContent =
            "+";


        minus.addEventListener(
            "click",
            () => {

                changeItemStacks(
                    itemKey,
                    -1
                );
            }
        );


        plus.addEventListener(
            "click",
            () => {

                changeItemStacks(
                    itemKey,
                    1
                );
            }
        );


        card.appendChild(name);

        card.appendChild(minus);

        card.appendChild(count);

        card.appendChild(plus);

        inventoryGrid.appendChild(card);
    }
}


// ============================================================
// CHANGE ITEM STACKS
// ============================================================

function changeItemStacks(
    itemKey,
    amount
) {

    const item =
        ITEMS[itemKey];


    if (!item) {
        return;
    }


    const current =
        state.inventory[itemKey] || 0;


    const next =
        current + amount;


    state.inventory[itemKey] =
        Math.max(
            0,
            Math.min(
                item.maxStacks,
                next
            )
        );


    updateInventoryDisplay();

    calculate();
}


// ============================================================
// INVENTORY DISPLAY
// ============================================================

function updateInventoryDisplay() {

    for (const itemKey of ITEM_ORDER) {

        const count =
            document.getElementById(
                `count-${itemKey}`
            );


        if (count) {

            count.textContent =
                state.inventory[itemKey];
        }
    }


    const totalStacks =
        getInventoryCount(
            state.inventory
        );


    inventorySummary.textContent =
        `${totalStacks} ${
            totalStacks === 1
                ? "stack"
                : "stacks"
        }`;
}


// ============================================================
// DAMAGE
// ============================================================

function updateDamageFromLevel() {

    const damage =
        getBaseDamage(
            state.survivor,
            state.level
        );


    damageInput.value =
        damage.toFixed(2);
}


function getStartingDamage() {

    const manualDamage =
        Number(damageInput.value);


    if (
        damageInput.value !== "" &&
        Number.isFinite(manualDamage)
    ) {

        return manualDamage;
    }


    return getBaseDamage(
        state.survivor,
        state.level
    );
}


// ============================================================
// CALCULATE
// ============================================================

function calculate() {

    state.survivor =
        survivorSelect.value;


    state.level =
        Math.max(
            1,
            Number(levelInput.value) || 1
        );


    state.procCoefficient =
        Math.max(
            0,
            Number(procCoefficientInput.value) || 0
        );


    state.luck =
        Number(luckInput.value) || 0;


    state.damage =
        getStartingDamage();


    // --------------------------------------------------------
    // Run the proc engine
    // --------------------------------------------------------

    state.currentResult =
        buildProcTree({

            survivor:
                state.survivor,

            level:
                state.level,

            damage:
                state.damage,

            procCoefficient:
                state.procCoefficient,

            luck:
                state.luck,

            inventory:
                state.inventory
        });


    // --------------------------------------------------------
    // Update statistics
    // --------------------------------------------------------

    updateStatistics();


    // --------------------------------------------------------
    // Update details
    // --------------------------------------------------------

    selectRootNode();


    // --------------------------------------------------------
    // Render graph
    // --------------------------------------------------------

    if (
        typeof renderProcTree ===
        "function"
    ) {

        renderProcTree(
            state.currentResult.root
        );
    }


    // --------------------------------------------------------
    // Render math
    // --------------------------------------------------------

    renderMath(
        state.currentResult
    );
}


// ============================================================
// STATISTICS
// ============================================================

function updateStatistics() {

    if (!state.currentResult) {
        return;
    }


    const result =
        state.currentResult;


    baseDamageDisplay.textContent =
        formatNumber(
            result.baseDamage
        );


    expectedDamageDisplay.textContent =
        formatNumber(
            result.expectedProcDamage
        );


    totalDamageDisplay.textContent =
        formatNumber(
            result.totalExpectedDamage
        );
}


// ============================================================
// NODE SELECTION
// ============================================================

function selectRootNode() {

    if (
        !state.currentResult ||
        !state.currentResult.root
    ) {

        return;
    }


    selectNode(
        state.currentResult.root
    );
}


function selectNode(node) {

    state.selectedNode =
        node;


    if (!node) {
        return;
    }


    // --------------------------------------------------------
    // Name
    // --------------------------------------------------------

    selectedNodeName.textContent =
        node.name;


    // --------------------------------------------------------
    // Type
    // --------------------------------------------------------

    if (node.type === "root") {

        selectedNodeType.textContent =
            "BASE HIT";

    } else {

        selectedNodeType.textContent =
            "PROC";
    }


    // --------------------------------------------------------
    // Damage
    // --------------------------------------------------------

    detailDamage.textContent =
        formatNumber(
            node.damage
        );


    // --------------------------------------------------------
    // Chance
    // --------------------------------------------------------

    if (node.type === "root") {

        detailChance.textContent =
            "100%";

    } else {

        detailChance.textContent =
            formatPercent(
                node.chance
            );
    }


    // --------------------------------------------------------
    // Proc coefficient
    // --------------------------------------------------------

    detailProcCoefficient.textContent =
        Number(
            node.procCoefficient
        ).toFixed(2);


    // --------------------------------------------------------
    // Expected damage
    // --------------------------------------------------------

    if (node.type === "root") {

        detailExpectedDamage.textContent =
            formatNumber(
                node.damage
            );

    } else {

        detailExpectedDamage.textContent =
            formatNumber(
                node.expectedDamage
            );
    }


    // --------------------------------------------------------
    // Calculation text
    // --------------------------------------------------------

    if (node.type === "root") {

        calculationText.textContent =
            `${state.survivor} attack → ${formatNumber(node.damage)} damage`;

    } else {

        const chance =
            formatPercent(
                node.chance
            );


        calculationText.textContent =
            `${formatNumber(node.sourceDamage)} × ` +
            `${getItemMultiplierText(node)} × ` +
            `${chance} = ` +
            `${formatNumber(node.expectedDamage)} expected damage`;
    }


    // --------------------------------------------------------
    // Tell graph to highlight this node
    // --------------------------------------------------------

    if (
        typeof highlightProcNode ===
        "function"
    ) {

        highlightProcNode(
            node.id
        );
    }
}


// ============================================================
// ITEM MULTIPLIER DISPLAY
// ============================================================

function getItemMultiplierText(node) {

    const item =
        ITEMS[node.itemKey];


    if (!item) {
        return "0";
    }


    const stacks =
        node.stacks || 1;


    const multiplier =
        item.damageMultiplier(
            stacks
        );


    return `${multiplier.toFixed(2)}×`;
}


// ============================================================
// GRAPH SELECTION CALLBACK
// ============================================================

// graph.js calls this when the user clicks a node.

function handleGraphNodeClick(nodeId) {

    if (!state.currentResult) {
        return;
    }


    const node =
        findProcNode(
            state.currentResult.root,
            nodeId
        );


    if (node) {

        selectNode(node);
    }
}


// ============================================================
// MATH VIEW
// ============================================================

function renderMath(result) {

    if (!result) {

        mathContent.innerHTML =
            `<p class="muted">
                Calculate a proc chain to see the mathematical breakdown.
            </p>`;

        return;
    }


    const flattened =
        flattenProcTree(
            result.root
        );


    if (flattened.nodes.length <= 1) {

        mathContent.innerHTML =
            `<p class="muted">
                No proc items are currently active.
            </p>`;

        return;
    }


    mathContent.innerHTML = "";


    for (
        const node of flattened.nodes
    ) {

        if (node.type === "root") {
            continue;
        }


        const entry =
            document.createElement("div");

        entry.className =
            "math-entry";


        const title =
            document.createElement("div");

        title.className =
            "math-entry-title";

        title.textContent =
            node.name;


        const formula =
            document.createElement("code");


        const chance =
            formatPercent(
                node.chance
            );


        const multiplier =
            getItemMultiplierText(
                node
            );


        formula.textContent =
            `${formatNumber(node.sourceDamage)} × ` +
            `${multiplier} × ` +
            `${chance} = ` +
            `${formatNumber(node.expectedDamage)} expected damage`;


        entry.appendChild(title);

        entry.appendChild(formula);

        mathContent.appendChild(entry);
    }
}


// ============================================================
// VIEW MODE
// ============================================================

function setViewMode(mode) {

    if (mode === "tree") {

        treeModeBtn.classList.add(
            "active"
        );

        mathModeBtn.classList.remove(
            "active"
        );

        mathPanel.classList.add(
            "hidden"
        );

        return;
    }


    if (mode === "math") {

        mathModeBtn.classList.add(
            "active"
        );

        treeModeBtn.classList.remove(
            "active"
        );

        mathPanel.classList.remove(
            "hidden"
        );
    }
}


// ============================================================
// RESET
// ============================================================

function resetView() {

    state.inventory =
        createEmptyInventory();


    levelInput.value =
        1;


    survivorSelect.value =
        "Commando";


    state.survivor =
        "Commando";


    state.level =
        1;


    state.damage =
        null;


    damageInput.value =
        getBaseDamage(
            "Commando",
            1
        ).toFixed(2);


    procCoefficientInput.value =
        1;


    luckInput.value =
        0;


    state.procCoefficient =
        1;


    state.luck =
        0;


    updateInventoryDisplay();


    calculate();


    if (
        typeof resetGraphView ===
        "function"
    ) {

        resetGraphView();
    }
}
