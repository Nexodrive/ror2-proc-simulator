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

    inventory:
        createEmptyInventory(),

    currentResult: null,

    selectedNode: null

};


// ============================================================
// DOM ELEMENTS
// ============================================================

const survivorSelect =
    document.getElementById(
        "survivorSelect"
    );

const levelInput =
    document.getElementById(
        "levelInput"
    );

const damageInput =
    document.getElementById(
        "damageInput"
    );

const procCoefficientInput =
    document.getElementById(
        "procCoefficientInput"
    );

const luckInput =
    document.getElementById(
        "luckInput"
    );

const itemSelect =
    document.getElementById(
        "itemSelect"
    );

const addItemBtn =
    document.getElementById(
        "addItemBtn"
    );

const inventoryGrid =
    document.getElementById(
        "inventoryGrid"
    );

const inventorySummary =
    document.getElementById(
        "inventorySummary"
    );

const calculateBtn =
    document.getElementById(
        "calculateBtn"
    );

const resetViewBtn =
    document.getElementById(
        "resetViewBtn"
    );

const treeModeBtn =
    document.getElementById(
        "treeModeBtn"
    );

const mathModeBtn =
    document.getElementById(
        "mathModeBtn"
    );

const procTree =
    document.getElementById(
        "procTree"
    );

const mathPanel =
    document.getElementById(
        "mathPanel"
    );

const baseDamageDisplay =
    document.getElementById(
        "baseDamageDisplay"
    );

const expectedDamageDisplay =
    document.getElementById(
        "expectedDamageDisplay"
    );

const totalDamageDisplay =
    document.getElementById(
        "totalDamageDisplay"
    );

const selectedNodeName =
    document.getElementById(
        "selectedNodeName"
    );

const selectedNodeType =
    document.getElementById(
        "selectedNodeType"
    );

const detailDamage =
    document.getElementById(
        "detailDamage"
    );

const detailChance =
    document.getElementById(
        "detailChance"
    );

const detailProcCoefficient =
    document.getElementById(
        "detailProcCoefficient"
    );

const detailExpectedDamage =
    document.getElementById(
        "detailExpectedDamage"
    );

const calculationText =
    document.getElementById(
        "calculationText"
    );

const mathContent =
    document.getElementById(
        "mathContent"
    );


// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeItemDropdown();

        initializeControls();

        updateDamageFromLevel();

        updateInventoryDisplay();

        calculate();

    }
);


// ============================================================
// ITEM DROPDOWN
// ============================================================

function initializeItemDropdown() {

    if (!itemSelect) {

        return;

    }


    itemSelect.innerHTML = "";


    const defaultOption =
        document.createElement(
            "option"
        );


    defaultOption.value =
        "";


    defaultOption.textContent =
        "Select an item...";


    itemSelect.appendChild(
        defaultOption
    );


    // --------------------------------------------------------
    // Create category groups
    // --------------------------------------------------------

    const categories = {};


    for (
        const itemKey of ITEM_ORDER
    ) {

        const item =
            ITEMS[itemKey];


        if (!item) {

            continue;

        }


        const category =
            item.category ||
            "Other";


        if (
            !categories[category]
        ) {

            categories[category] = [];

        }


        categories[category].push(
            itemKey
        );

    }


    // --------------------------------------------------------
    // Category order
    // --------------------------------------------------------

    const categoryOrder = [

        "Common",

        "Uncommon",

        "Legendary",

        "Boss",

        "Lunar",

        "Void",

        "Equipment",

        "Other"

    ];


    for (
        const category of categoryOrder
    ) {

        if (
            !categories[category]
        ) {

            continue;

        }


        const group =
            document.createElement(
                "optgroup"
            );


        group.label =
            category;


        for (
            const itemKey of categories[category]
        ) {

            const item =
                ITEMS[itemKey];


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                itemKey;


            option.textContent =
                item.name;


            group.appendChild(
                option
            );

        }


        itemSelect.appendChild(
            group
        );

    }


    // --------------------------------------------------------
    // Add button
    // --------------------------------------------------------

    if (addItemBtn) {

        addItemBtn.addEventListener(
            "click",
            () => {

                const itemKey =
                    itemSelect.value;


                if (!itemKey) {

                    return;

                }


                addInventoryItem(
                    itemKey
                );


                itemSelect.value =
                    "";

            }
        );

    }

}


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
                    Number(
                        levelInput.value
                    ) || 1
                );

            updateDamageFromLevel();

        }
    );


    damageInput.addEventListener(
        "input",
        () => {

            const value =
                Number(
                    damageInput.value
                );


            if (
                damageInput.value !== "" &&
                Number.isFinite(value)
            ) {

                state.damage =
                    value;

            } else {

                state.damage =
                    null;

            }

        }
    );


    procCoefficientInput.addEventListener(
        "input",
        () => {

            state.procCoefficient =
                Math.max(
                    0,
                    Number(
                        procCoefficientInput.value
                    ) || 0
                );

        }
    );


    luckInput.addEventListener(
        "input",
        () => {

            state.luck =
                Number(
                    luckInput.value
                ) || 0;

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

            setViewMode(
                "tree"
            );

        }
    );


    mathModeBtn.addEventListener(
        "click",
        () => {

            setViewMode(
                "math"
            );

        }
    );

}


// ============================================================
// ADD ITEM
// ============================================================

function addInventoryItem(
    itemKey
) {

    const item =
        ITEMS[itemKey];


    if (!item) {

        return;

    }


    const current =
        state.inventory[itemKey] ||
        0;


    state.inventory[itemKey] =
        Math.min(
            item.maxStacks,
            current + 1
        );


    updateInventoryDisplay();

    calculate();

}


// ============================================================
// REMOVE ITEM
// ============================================================

function removeInventoryItem(
    itemKey
) {

    if (
        state.inventory[itemKey] ===
        undefined
    ) {

        return;

    }


    state.inventory[itemKey] =
        0;


    updateInventoryDisplay();
