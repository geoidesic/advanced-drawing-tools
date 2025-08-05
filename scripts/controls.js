import { MODULE_ID } from "./const.js";

Hooks.on("getSceneControlButtons", controls => {
    // Handle both array (v13) and jQuery object (v12) formats
    const controlsArray = Array.isArray(controls) ? controls : (controls.jquery ? controls.toArray() : []);
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
