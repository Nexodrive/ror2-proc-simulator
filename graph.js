// js/graph.js

// ============================================================
// PROC TREE GRAPH
// ============================================================

let graphState = {

    svg: null,

    rootGroup: null,

    currentRoot: null,

    selectedNodeId: "root",

    offsetX: 0,

    offsetY: 0,

    zoom: 1,

    dragging: false,

    dragStartX: 0,

    dragStartY: 0,

    startOffsetX: 0,

    startOffsetY: 0
};


// ============================================================
// GRAPH CONSTANTS
// ============================================================

const NODE_WIDTH = 190;

const NODE_HEIGHT = 92;

const HORIZONTAL_GAP = 80;

const VERTICAL_GAP = 34;

const MIN_ZOOM = 0.35;

const MAX_ZOOM = 2.5;


// ============================================================
// RENDER TREE
// ============================================================

function renderProcTree(root) {

    if (!root) {
        return;
    }


    graphState.currentRoot =
        root;


    const container =
        document.getElementById(
            "procTree"
        );


    if (!container) {
        return;
    }


    // --------------------------------------------------------
    // Clear previous graph
    // --------------------------------------------------------

    container.innerHTML = "";


    // --------------------------------------------------------
    // Create SVG
    // --------------------------------------------------------

    const svg =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );


    svg.classList.add(
        "proc-svg"
    );


    svg.setAttribute(
        "width",
        "100%"
    );


    svg.setAttribute(
        "height",
        "100%"
    );


    svg.setAttribute(
        "viewBox",
        `0 0 ${container.clientWidth} ${container.clientHeight}`
    );


    // --------------------------------------------------------
    // Main transform group
    // --------------------------------------------------------

    const group =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );


    group.setAttribute(
        "class",
        "proc-graph-group"
    );


    svg.appendChild(group);


    container.appendChild(svg);


    graphState.svg =
        svg;


    graphState.rootGroup =
        group;


    // --------------------------------------------------------
    // Calculate layout
    // --------------------------------------------------------

    const layout =
        calculateLayout(root);


    // --------------------------------------------------------
    // Draw edges first
    // --------------------------------------------------------

    drawEdges(
        group,
        layout
    );


    // --------------------------------------------------------
    // Draw nodes second
    // --------------------------------------------------------

    drawNodes(
        group,
        layout
    );


    // --------------------------------------------------------
    // Center graph
    // --------------------------------------------------------

    resetGraphView();


    // --------------------------------------------------------
    // Mouse controls
    // --------------------------------------------------------

    initializeGraphControls(
        container
    );
}


// ============================================================
// LAYOUT
// ============================================================

function calculateLayout(root) {

    const levels = [];


    // --------------------------------------------------------
    // Group nodes by depth
    // --------------------------------------------------------

    function collect(node) {

        if (!levels[node.depth]) {
            levels[node.depth] = [];
        }


        levels[node.depth].push(
            node
        );


        for (const child of node.children) {

            collect(child);
        }
    }


    collect(root);


    // --------------------------------------------------------
    // Calculate coordinates
    // --------------------------------------------------------

    const positions =
        new Map();


    const maxDepth =
        levels.length;


    for (
        let depth = 0;
        depth < maxDepth;
        depth++
    ) {

        const nodes =
            levels[depth] || [];


        const totalHeight =
            nodes.length * NODE_HEIGHT +
            Math.max(
                0,
                nodes.length - 1
            ) * VERTICAL_GAP;


        const startY =
            -totalHeight / 2;


        nodes.forEach(
            (node, index) => {

                const y =
                    startY +
                    NODE_HEIGHT / 2 +
                    index *
                    (
                        NODE_HEIGHT +
                        VERTICAL_GAP
                    );


                const x =
                    depth *
                    (
                        NODE_WIDTH +
                        HORIZONTAL_GAP
                    );


                positions.set(
                    node.id,
                    {
                        x: x,
                        y: y
                    }
                );
            }
        );
    }


    // --------------------------------------------------------
    // Try to center children around their parents
    // --------------------------------------------------------

    for (
        let depth = maxDepth - 1;
        depth > 0;
        depth--
    ) {

        const nodes =
            levels[depth] || [];


        for (const node of nodes) {

            const parent =
                findParent(
                    root,
                    node.id
                );


            if (!parent) {
                continue;
            }


            const parentPosition =
                positions.get(
                    parent.id
                );


            const nodePosition =
                positions.get(
                    node.id
                );


            if (
                parentPosition &&
                nodePosition
            ) {

                // Keep the generated layout stable,
                // but slightly pull nodes toward their parent.
                nodePosition.y =
                    (
                        nodePosition.y +
                        parentPosition.y
                    ) / 2;
            }
        }
    }


    return {
        positions: positions,
        levels: levels
    };
}


// ============================================================
// FIND PARENT
// ============================================================

function findParent(
    root,
    childId
) {

    for (const child of root.children) {

        if (child.id === childId) {
            return root;
        }


        const parent =
            findParent(
                child,
                childId
            );


        if (parent) {
            return parent;
        }
    }


    return null;
}


// ============================================================
// DRAW EDGES
// ============================================================

function drawEdges(
    group,
    layout
) {

    const positions =
        layout.positions;


    function walk(node) {

        const parentPosition =
            positions.get(
                node.id
            );


        if (!parentPosition) {
            return;
        }


        for (const child of node.children) {

            const childPosition =
                positions.get(
                    child.id
                );


            if (!childPosition) {
                continue;
            }


            drawEdge(
                group,
                node,
                child,
                parentPosition,
                childPosition
            );


            walk(child);
        }
    }


    walk(graphState.currentRoot);
}


// ============================================================
// SINGLE EDGE
// ============================================================

function drawEdge(
    group,
    parent,
    child,
    parentPosition,
    childPosition
) {

    const path =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );


    path.classList.add(
        "proc-edge"
    );


    path.dataset.source =
        parent.id;


    path.dataset.target =
        child.id;


    // --------------------------------------------------------
    // Start / end points
    // --------------------------------------------------------

    const startX =
        parentPosition.x +
        NODE_WIDTH;


    const startY =
        parentPosition.y;


    const endX =
        childPosition.x;


    const endY =
        childPosition.y;


    // --------------------------------------------------------
    // Curved connection
    // --------------------------------------------------------

    const distance =
        endX - startX;


    const curve =
        Math.max(
            40,
            distance * 0.45
        );


    const pathData =
        `M ${startX} ${startY}
         C ${startX + curve} ${startY},
           ${endX - curve} ${endY},
           ${endX} ${endY}`;


    path.setAttribute(
        "d",
        pathData
    );


    group.appendChild(path);


    // --------------------------------------------------------
    // Chance label
    // --------------------------------------------------------

    const label =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );


    label.classList.add(
        "proc-edge-label"
    );


    label.setAttribute(
        "x",
        startX + distance * 0.5
    );


    label.setAttribute(
        "y",
        startY +
        (endY - startY) * 0.5 -
        7
    );


    label.setAttribute(
        "text-anchor",
        "middle"
    );


    label.textContent =
        formatPercent(
            child.chance
        );


    label.dataset.source =
        parent.id;


    label.dataset.target =
        child.id;


    group.appendChild(label);
}


// ============================================================
// DRAW NODES
// ============================================================

function drawNodes(
    group,
    layout
) {

    const positions =
        layout.positions;


    function walk(node) {

        const position =
            positions.get(
                node.id
            );


        if (!position) {
            return;
        }


        drawNode(
            group,
            node,
            position
        );


        for (const child of node.children) {

            walk(child);
        }
    }


    walk(graphState.currentRoot);
}


// ============================================================
// SINGLE NODE
// ============================================================

function drawNode(
    group,
    node,
    position
) {

    const nodeGroup =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );


    nodeGroup.classList.add(
        "proc-node"
    );


    nodeGroup.dataset.nodeId =
        node.id;


    nodeGroup.setAttribute(
        "transform",
        `translate(${position.x}, ${position.y - NODE_HEIGHT / 2})`
    );


    // --------------------------------------------------------
    // Background
    // --------------------------------------------------------

    const rect =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );


    rect.setAttribute(
        "width",
        NODE_WIDTH
    );


    rect.setAttribute(
        "height",
        NODE_HEIGHT
    );


    rect.setAttribute(
        "rx",
        7
    );


    rect.setAttribute(
        "ry",
        7
    );


    nodeGroup.appendChild(
        rect
    );


    // --------------------------------------------------------
    // Color accent
    // --------------------------------------------------------

    const accent =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );


    accent.setAttribute(
        "x",
        0
    );


    accent.setAttribute(
        "y",
        0
    );


    accent.setAttribute(
        "width",
        4
    );


    accent.setAttribute(
        "height",
        NODE_HEIGHT
    );


    accent.setAttribute(
        "rx",
        3
    );


    if (node.type === "root") {

        accent.setAttribute(
            "fill",
            "#ff9d24"
        );

    } else {

        const item =
            ITEMS[node.itemKey];


        accent.setAttribute(
            "fill",
            item
                ? item.color
                : "#ff9d24"
        );
    }


    nodeGroup.appendChild(
        accent
    );


    // --------------------------------------------------------
    // Node title
    // --------------------------------------------------------

    const title =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );


    title.classList.add(
        "proc-node-title"
    );


    title.setAttribute(
        "x",
        16
    );


    title.setAttribute(
        "y",
        25
    );


    title.textContent =
        node.shortName ||
        node.name;


    nodeGroup.appendChild(
        title
    );


    // --------------------------------------------------------
    // Node subtitle
    // --------------------------------------------------------

    const subtitle =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );


    subtitle.classList.add(
        "proc-node-subtitle"
    );


    subtitle.setAttribute(
        "x",
        16
    );


    subtitle.setAttribute(
        "y",
        44
    );


    if (node.type === "root") {

        subtitle.textContent =
            "Initial attack";

    } else {

        subtitle.textContent =
            `${node.stacks} ${
                node.stacks === 1
                    ? "stack"
                    : "stacks"
            }`;
    }


    nodeGroup.appendChild(
        subtitle
    );


    // --------------------------------------------------------
    // Damage
    // --------------------------------------------------------

    const damage =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );


    damage.classList.add(
        "proc-node-value"
    );


    damage.setAttribute(
        "x",
        16
    );


    damage.setAttribute(
        "y",
        68
    );


    damage.textContent =
        `${formatNumber(node.damage)} dmg`;


    nodeGroup.appendChild(
        damage
    );


    // --------------------------------------------------------
    // Chance
    // --------------------------------------------------------

    if (node.type !== "root") {

        const chance =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
            );


        chance.classList.add(
            "proc-node-subtitle"
        );


        chance.setAttribute(
            "x",
            NODE_WIDTH - 12
        );


        chance.setAttribute(
            "y",
            25
        );


        chance.setAttribute(
            "text-anchor",
            "end"
        );


        chance.textContent =
            formatPercent(
                node.chance
            );


        nodeGroup.appendChild(
            chance
        );
    }


    // --------------------------------------------------------
    // Click handler
    // --------------------------------------------------------

    nodeGroup.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();


            handleGraphNodeClick(
                node.id
            );
        }
    );


    group.appendChild(
        nodeGroup
    );
}


// ============================================================
// HIGHLIGHT SELECTED NODE
// ============================================================

function highlightProcNode(
    nodeId
) {

    graphState.selectedNodeId =
        nodeId;


    if (!graphState.rootGroup) {
        return;
    }


    const nodes =
        graphState.rootGroup.querySelectorAll(
            ".proc-node"
        );


    const edges =
        graphState.rootGroup.querySelectorAll(
            ".proc-edge"
        );


    const labels =
        graphState.rootGroup.querySelectorAll(
            ".proc-edge-label"
        );


    // --------------------------------------------------------
    // Clear previous state
    // --------------------------------------------------------

    nodes.forEach(
        node => {

            node.classList.remove(
                "selected"
            );

            node.classList.remove(
                "dimmed"
            );
        }
    );


    edges.forEach(
        edge => {

            edge.classList.remove(
                "highlighted"
            );
        }
    );


    // --------------------------------------------------------
    // Find selected node
    // --------------------------------------------------------

    const selected =
        graphState.rootGroup.querySelector(
            `.proc-node[data-node-id="${CSS.escape(nodeId)}"]`
        );


    if (selected) {

        selected.classList.add(
            "selected"
        );
    }


    // --------------------------------------------------------
    // Highlight incoming edge
    // --------------------------------------------------------

    edges.forEach(
        edge => {

            if (
                edge.dataset.target ===
                nodeId
            ) {

                edge.classList.add(
                    "highlighted"
                );
            }
        }
    );


    labels.forEach(
        label => {

            if (
                label.dataset.target ===
                nodeId
            ) {

                label.style.fill =
                    "#ff9d24";
            } else {

                label.style.fill =
                    "";
            }
        }
    );
}


// ============================================================
// GRAPH CONTROLS
// ============================================================

function initializeGraphControls(
    container
) {

    // Prevent duplicate listeners.
    if (
        container.dataset.controlsReady ===
        "true"
    ) {
        return;
    }


    container.dataset.controlsReady =
        "true";


    // --------------------------------------------------------
    // Mouse down
    // --------------------------------------------------------

    container.addEventListener(
        "mousedown",
        (event) => {

            if (
                event.button !== 0
            ) {
                return;
            }


            // Don't start panning when clicking a node.
            if (
                event.target.closest(
                    ".proc-node"
                )
            ) {
                return;
            }


            graphState.dragging =
                true;


            graphState.dragStartX =
                event.clientX;


            graphState.dragStartY =
                event.clientY;


            graphState.startOffsetX =
                graphState.offsetX;


            graphState.startOffsetY =
                graphState.offsetY;
        }
    );


    // --------------------------------------------------------
    // Mouse move
    // --------------------------------------------------------

    container.addEventListener(
        "mousemove",
        (event) => {

            if (!graphState.dragging) {
                return;
            }


            const dx =
                event.clientX -
                graphState.dragStartX;


            const dy =
                event.clientY -
                graphState.dragStartY;


            graphState.offsetX =
                graphState.startOffsetX +
                dx;


            graphState.offsetY =
                graphState.startOffsetY +
                dy;


            updateGraphTransform();
        }
    );


    // --------------------------------------------------------
    // Mouse up
    // --------------------------------------------------------

    window.addEventListener(
        "mouseup",
        () => {

            graphState.dragging =
                false;
        }
    );


    // --------------------------------------------------------
    // Mouse wheel zoom
    // --------------------------------------------------------

    container.addEventListener(
        "wheel",
        (event) => {

            event.preventDefault();


            const direction =
                event.deltaY < 0
                    ? 1
                    : -1;


            const zoomFactor =
                direction > 0
                    ? 1.1
                    : 0.9;


            const oldZoom =
                graphState.zoom;


            const newZoom =
                Math.max(
                    MIN_ZOOM,
                    Math.min(
                        MAX_ZOOM,
                        oldZoom *
                        zoomFactor
                    )
                );


            if (
                newZoom ===
                oldZoom
            ) {
                return;
            }


            // Zoom toward mouse cursor.
            const rect =
                container.getBoundingClientRect();


            const mouseX =
                event.clientX -
                rect.left;


            const mouseY =
                event.clientY -
                rect.top;


            const centerX =
                rect.width / 2;


            const centerY =
                rect.height / 2;


            graphState.offsetX =
                mouseX -
                (
                    mouseX -
                    centerX -
                    graphState.offsetX
                ) *
                (
                    newZoom /
                    oldZoom
                ) -
                centerX;


            graphState.offsetY =
                mouseY -
                (
                    mouseY -
                    centerY -
                    graphState.offsetY
                ) *
                (
                    newZoom /
                    oldZoom
                ) -
                centerY;


            graphState.zoom =
                newZoom;


            updateGraphTransform();
        },
        {
            passive: false
        }
    );


    // --------------------------------------------------------
    // Double click resets view
    // --------------------------------------------------------

    container.addEventListener(
        "dblclick",
        (event) => {

            if (
                event.target.closest(
                    ".proc-node"
                )
            ) {
                return;
            }


            resetGraphView();
        }
    );
}


// ============================================================
// UPDATE GRAPH TRANSFORM
// ============================================================

function updateGraphTransform() {

    if (
        !graphState.rootGroup ||
        !graphState.svg
    ) {
        return;
    }


    const width =
        graphState.svg.clientWidth;


    const height =
        graphState.svg.clientHeight;


    const x =
        width / 2 +
        graphState.offsetX;


    const y =
        height / 2 +
        graphState.offsetY;


    graphState.rootGroup.setAttribute(
        "transform",
        `translate(${x}, ${y}) scale(${graphState.zoom})`
    );
}


// ============================================================
// RESET GRAPH VIEW
// ============================================================

function resetGraphView() {

    graphState.zoom =
        0.8;


    graphState.offsetX =
        0;


    graphState.offsetY =
        0;


    updateGraphTransform();
}


// ============================================================
// WINDOW RESIZE
// ============================================================

window.addEventListener(
    "resize",
    () => {

        if (!graphState.svg) {
            return;
        }


        const container =
            document.getElementById(
                "procTree"
            );


        if (!container) {
            return;
        }


        graphState.svg.setAttribute(
            "viewBox",
            `0 0 ${container.clientWidth} ${container.clientHeight}`
        );


        updateGraphTransform();
    }
);
