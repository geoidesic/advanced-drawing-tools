import { MODULE_ID } from "./const.js";

Hooks.on("getSceneControlButtons", controls => {
    console.log(`${MODULE_ID}: getSceneControlButtons hook called with:`, typeof controls, Array.isArray(controls), controls);
    
    // Handle both array (v13) and jQuery object (v12) formats
    let controlsArray;
    if (Array.isArray(controls)) {
        controlsArray = controls;
    } else if (controls && controls.jquery) {
        controlsArray = controls.toArray();
    } else if (controls && typeof controls.find === 'function') {
        // Fallback for other array-like objects
        controlsArray = Array.from(controls);
    } else {
        console.error(`${MODULE_ID}: Unknown controls format:`, controls);
        return;
    }
    
    const drawingsControl = controlsArray.find(c => c.name === "drawings");

    drawingsControl?.tools.splice(drawingsControl.tools.findIndex(t => t.name === "clear"), 0, {
        name: `${MODULE_ID}.snap`,
        title: "CONTROLS.WallSnap",
        icon: "fas fa-plus",
        toggle: true,
        active: canvas.drawings?._forceSnap || false,
        onClick: toggled => canvas.drawings._forceSnap = toggled
    });
});
