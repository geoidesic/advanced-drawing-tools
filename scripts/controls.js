import { MODULE_ID } from "./const.js";

Hooks.on("getSceneControlButtons", controls => {
    console.log(`${MODULE_ID}: getSceneControlButtons hook called`);
    console.log(`${MODULE_ID}: controls type:`, typeof controls);
    console.log(`${MODULE_ID}: controls is array:`, Array.isArray(controls));
    console.log(`${MODULE_ID}: controls has jquery:`, !!(controls && controls.jquery));
    console.log(`${MODULE_ID}: controls has find method:`, !!(controls && typeof controls.find === 'function'));
    console.log(`${MODULE_ID}: controls:`, controls);
    
    // Handle different formats of controls parameter
    let drawingsControl;
    
    try {
        if (Array.isArray(controls)) {
            // v13: controls is a regular array
            console.log(`${MODULE_ID}: Processing as array`);
            drawingsControl = controls.find(c => c && c.name === "drawings");
        } else if (controls && controls.jquery) {
            // v12: controls is a jQuery object - need to convert to array first
            console.log(`${MODULE_ID}: Processing as jQuery object`);
            const controlsArray = controls.toArray();
            drawingsControl = controlsArray.find(c => c && c.name === "drawings");
        } else if (controls && controls.length !== undefined) {
            // Try to treat as array-like object
            console.log(`${MODULE_ID}: Processing as array-like object`);
            const controlsArray = Array.from(controls);
            drawingsControl = controlsArray.find(c => c && c.name === "drawings");
        } else {
            console.error(`${MODULE_ID}: Unknown controls format, skipping hook`);
            return;
        }
    } catch (error) {
        console.error(`${MODULE_ID}: Error processing controls:`, error);
        return;
    }

    if (!drawingsControl) {
        console.warn(`${MODULE_ID}: Could not find drawings control`);
        return;
    }

    if (!drawingsControl.tools || !Array.isArray(drawingsControl.tools)) {
        console.warn(`${MODULE_ID}: Drawings control has no tools array`);
        return;
    }

    try {
        const clearIndex = drawingsControl.tools.findIndex(t => t && t.name === "clear");
        if (clearIndex === -1) {
            console.warn(`${MODULE_ID}: Could not find clear tool to insert before`);
            drawingsControl.tools.push({
                name: `${MODULE_ID}.snap`,
                title: "CONTROLS.WallSnap",
                icon: "fas fa-plus",
                toggle: true,
                active: canvas.drawings?._forceSnap || false,
                onClick: toggled => canvas.drawings._forceSnap = toggled
            });
        } else {
            drawingsControl.tools.splice(clearIndex, 0, {
                name: `${MODULE_ID}.snap`,
                title: "CONTROLS.WallSnap",
                icon: "fas fa-plus",
                toggle: true,
                active: canvas.drawings?._forceSnap || false,
                onClick: toggled => canvas.drawings._forceSnap = toggled
            });
        }
        console.log(`${MODULE_ID}: Successfully added snap tool`);
    } catch (error) {
        console.error(`${MODULE_ID}: Error adding snap tool:`, error);
    }
});
