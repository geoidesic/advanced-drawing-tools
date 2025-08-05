import { MODULE_ID } from "./const.js";

Hooks.on("getSceneControlButtons", controls => {
    console.log(`${MODULE_ID}: getSceneControlButtons hook called`);
    console.log(`${MODULE_ID}: controls type:`, typeof controls);
    console.log(`${MODULE_ID}: controls keys:`, controls && Object.keys(controls));
    console.log(`${MODULE_ID}: controls:`, controls);

    // The API expects controls to be Record<string, SceneControl>
    let drawingsControl;
    try {
        // Access the drawings control directly from the controls object
        if (controls && typeof controls === "object" && controls.drawings) {
            drawingsControl = controls.drawings;
        } else {
            console.warn(`${MODULE_ID}: Could not find drawings control in controls object`);
            return;
        }
    } catch (error) {
        console.error(`${MODULE_ID}: Error processing controls:`, error);
        return;
    }

    // The tools property is also Record<string, SceneControlTool>, not an array
    if (!drawingsControl.tools || typeof drawingsControl.tools !== "object") {
        console.warn(`${MODULE_ID}: Drawings control has no tools object`);
        return;
    }

    try {
        // Add the snap tool to the tools object
        const snapTool = {
            name: "snap",
            title: "CONTROLS.WallSnap",
            icon: "fas fa-plus",
            toggle: true,
            active: canvas.drawings?._forceSnap || false,
            onClick: toggled => canvas.drawings._forceSnap = toggled,
            visible: true
        };
        
        // Simply add the tool to the tools object using the tool name as the key
        drawingsControl.tools.snap = snapTool;
        console.log(`${MODULE_ID}: Successfully added snap tool`);
    } catch (error) {
        console.error(`${MODULE_ID}: Error adding snap tool:`, error);
    }
});
