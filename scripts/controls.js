import { MODULE_ID } from "./const.js";

Hooks.on("getSceneControlButtons", controls => {
    console.log(`${MODULE_ID}: getSceneControlButtons hook called`);
    console.log(`${MODULE_ID}: controls type:`, typeof controls);
    console.log(`${MODULE_ID}: controls is array:`, Array.isArray(controls));
    console.log(`${MODULE_ID}: controls has jquery:`, !!(controls && controls.jquery));
    console.log(`${MODULE_ID}: controls has find method:`, !!(controls && typeof controls.find === 'function'));
    console.log(`${MODULE_ID}: controls has length:`, controls && controls.length);
    console.log(`${MODULE_ID}: controls constructor:`, controls && controls.constructor && controls.constructor.name);
    console.log(`${MODULE_ID}: controls keys:`, controls && Object.keys(controls));
    console.log(`${MODULE_ID}: controls:`, controls);
    
    // Handle different formats of controls parameter
    let drawingsControl;
    
    try {
        // First, let's try to convert whatever we have into a workable array
        let controlsArray = [];
        
        if (Array.isArray(controls)) {
            console.log(`${MODULE_ID}: Processing as array`);
            controlsArray = controls;
        } else if (controls && controls.jquery) {
            console.log(`${MODULE_ID}: Processing as jQuery object`);
            controlsArray = controls.toArray();
        } else if (controls && typeof controls.length === 'number' && controls.length > 0) {
            console.log(`${MODULE_ID}: Processing as array-like object with length ${controls.length}`);
            // Try multiple methods to convert to array
            try {
                controlsArray = Array.from(controls);
            } catch (e1) {
                try {
                    controlsArray = [...controls];
                } catch (e2) {
                    try {
                        controlsArray = Array.prototype.slice.call(controls);
                    } catch (e3) {
                        console.log(`${MODULE_ID}: All array conversion methods failed, trying manual iteration`);
                        for (let i = 0; i < controls.length; i++) {
                            if (controls[i] !== undefined) {
                                controlsArray.push(controls[i]);
                            }
                        }
                    }
                }
            }
        } else if (controls && typeof controls === 'object') {
            console.log(`${MODULE_ID}: Processing as generic object, trying to extract array-like properties`);
            // Maybe it's an object with numeric keys?
            const keys = Object.keys(controls);
            const numericKeys = keys.filter(k => !isNaN(k)).sort((a, b) => a - b);
            if (numericKeys.length > 0) {
                controlsArray = numericKeys.map(k => controls[k]);
            }
        }
        
        console.log(`${MODULE_ID}: Converted to array with length:`, controlsArray.length);
        console.log(`${MODULE_ID}: controlsArray:`, controlsArray);
        
        if (controlsArray.length === 0) {
            console.error(`${MODULE_ID}: No controls found after conversion, skipping hook`);
            return;
        }
        
        // Now look for the drawings control
        drawingsControl = controlsArray.find(c => c && c.name === "drawings");
        
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
