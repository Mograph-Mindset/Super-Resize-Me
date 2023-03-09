/* 		
        Super Resize Me!.jsx
        Batch resize your After Effects projects.
        Inspired by "Recursive Scale Comp" by Michael Gochoco (2010)

        By: Mograph Mindset & Nate Lovell
            Version 1.0
        January 2023

        1.0         Initial release. Responsive UI, robust error checking, saves user settings in Prefs. Works with locked layers, 2D, 3D, Camera Layers, Default AE Camera, and layers with scale keyframes.
        1.1         Fixed non-recursive
*/

{
    // including json
    "object" != typeof JSON && (JSON = {}), function () { "use strict"; var rx_one = /^[\],:{}\s]*$/, rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, rx_four = /(?:^|:|,)(?:\s*\[)+/g, rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta, rep; function f(t) { return t < 10 ? "0" + t : t } function this_value() { return this.valueOf() } function quote(t) { return rx_escapable.lastIndex = 0, rx_escapable.test(t) ? '"' + t.replace(rx_escapable, function (t) { var e = meta[t]; return "string" == typeof e ? e : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4) }) + '"' : '"' + t + '"' } function str(t, e) { var r, n, o, u, f, a = gap, i = e[t]; switch (i && "object" == typeof i && "function" == typeof i.toJSON && (i = i.toJSON(t)), "function" == typeof rep && (i = rep.call(e, t, i)), typeof i) { case "string": return quote(i); case "number": return isFinite(i) ? String(i) : "null"; case "boolean": case "null": return String(i); case "object": if (!i) return "null"; if (gap += indent, f = [], "[object Array]" === Object.prototype.toString.apply(i)) { for (u = i.length, r = 0; r < u; r += 1)f[r] = str(r, i) || "null"; return o = 0 === f.length ? "[]" : gap ? "[\n" + gap + f.join(",\n" + gap) + "\n" + a + "]" : "[" + f.join(",") + "]", gap = a, o } if (rep && "object" == typeof rep) for (u = rep.length, r = 0; r < u; r += 1)"string" == typeof rep[r] && (o = str(n = rep[r], i)) && f.push(quote(n) + (gap ? ": " : ":") + o); else for (n in i) Object.prototype.hasOwnProperty.call(i, n) && (o = str(n, i)) && f.push(quote(n) + (gap ? ": " : ":") + o); return o = 0 === f.length ? "{}" : gap ? "{\n" + gap + f.join(",\n" + gap) + "\n" + a + "}" : "{" + f.join(",") + "}", gap = a, o } } "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function () { return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null }, Boolean.prototype.toJSON = this_value, Number.prototype.toJSON = this_value, String.prototype.toJSON = this_value), "function" != typeof JSON.stringify && (meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, JSON.stringify = function (t, e, r) { var n; if (indent = gap = "", "number" == typeof r) for (n = 0; n < r; n += 1)indent += " "; else "string" == typeof r && (indent = r); if ((rep = e) && "function" != typeof e && ("object" != typeof e || "number" != typeof e.length)) throw new Error("JSON.stringify"); return str("", { "": t }) }), "function" != typeof JSON.parse && (JSON.parse = function (text, reviver) { var j; function walk(t, e) { var r, n, o = t[e]; if (o && "object" == typeof o) for (r in o) Object.prototype.hasOwnProperty.call(o, r) && (void 0 !== (n = walk(o, r)) ? o[r] = n : delete o[r]); return reviver.call(t, e, o) } if (text = String(text), rx_dangerous.lastIndex = 0, rx_dangerous.test(text) && (text = text.replace(rx_dangerous, function (t) { return "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4) })), rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({ "": j }, "") : j; throw new SyntaxError("JSON.parse") }) }();

    // initialisation to check if user can write to files
    if (!(isSecurityPrefSet())) {
        alert("This script requires access to write files.\n" +
            "Go to Edit > Preferences > Scripting & Expressions\n" +
            "and enable the checkbox for:\n\n" +
            "\"Allow Scripts to Write Files and Access Network\"\n");

        if (parseFloat(app.version) > 16) {
            // Open Prefs > Scripting & Expressions in CC 2019 and above
            app.executeCommand(3131);
        } else {
            // Open Prefs > General in CC 2018 and below
            app.executeCommand(2359);
        }
    }

    var initObj = {};
    initObj = { "ddSelection": "0", "value": "1.0", "recursiveValue": true };

    if (!app.preferences.havePref("Settings_Super Resize Me!", "ddSelection")) {
        app.preferences.savePrefAsString("Settings_Super Resize Me!", "ddSelection", initObj["ddSelection"]);
        app.preferences.savePrefAsString("Settings_Super Resize Me!", "value", initObj["value"]);
        app.preferences.savePrefAsString("Settings_Super Resize Me!", "recursiveValue", initObj["recursiveValue"]);
        app.preferences.saveToDisk();
        app.preferences.reload();

    } else {
        initObj = { "ddSelection": app.preferences.getPrefAsString("Settings_Super Resize Me!", "ddSelection"), "value": app.preferences.getPrefAsString("Settings_Super Resize Me!", "value"), "recursiveValue": app.preferences.getPrefAsString("Settings_Super Resize Me!", "recursiveValue") };
    }

    var compsDone = [];
    var lockedLayers = [];
    var scalingFactor = 1.0;

    var widthInput = null;
    var heightInput = null;
    var scaleFactorText = null;

    var proj = app.project;

    var compWidth = 4;
    var compHeight = 4;

    var outputWidth = 4;
    var outputHeight = 4;

    var appVersion = parseFloat(app.version);

    //
    // CREATE UI:

    // Progress Bar
    function buildProgressBarUI(windowTitle, windowWidth, windowHeight) {  //windowWidth and windowWidth are optional and are there to compensate for a lot of text if using the progressText feature
        if (windowWidth == null) windowWidth = 300;
        if (windowHeight == null) windowHeight = 20;

        var dlg = new Window("palette", windowTitle, undefined, { resizeable: false });
        var res =
            "group { \
            orientation:'column', alignment:['left','top'], alignChildren:['fill','fill'],  \
               progress: Group { \
                    alignment:['fill','top'], alignChildren:['fill','top'], \
                    val: Progressbar {  }, \
                }, \
                text: Group { \
                    text: StaticText { preferredSize: ["+ windowWidth + "," + windowHeight + "], alignment:['left','top'], properties:{multiline:true} }, \
               } \
            };";

        dlg.grp = dlg.add(res);

        dlg.center();

        return dlg;
    }

    function updateProgBar(progBarUIObj, barValue, barMaxValue, progressText) {  //progressText is optional.  Use it if you want to display updating text under the progress bar

        var progBar = progBarUIObj.grp.progress.val;
        var progText = progBarUIObj.grp.text.text;

        if (progressText == null) progressText = "";

        progBar.maxvalue = barMaxValue;
        progBar.value = (barValue == 0) ? 0.01 : barValue;
        progText.text = progressText;

        if (appVersion >= 9) progBar.window.update();  // This call refreshes the UI and fixes the Mac CS3 bug, but works in CS4 and above only.
    }

    // Main UI + Scaling Action
    function myScript(thisObj) {
        function myScript_buildUI(thisObj) {
            var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Super Resize Me!", undefined, { resizeable: true });

            //Flex Width
            myPanel.alignChildren = ["fill", "fill"];
            myPanel.preferredSize = [150, 100];
            myPanel.margins = [9, 5, 10, 10];

            res = "group{orientation:'column',\
               titleText: StaticText{text:'Scale Composition using:'},\
               dd: DropDownList{},\
               editText: EditText{text:'1.0'},\
               recursiveCheckbox: Checkbox{text:'Recursive'},\
               scaleButton: Button{text:'Scale'},\
               }";

            myPanel.grp = myPanel.add(res);
            myPanel.grp.alignChildren = "fill";

            // Dropdown Defaults
            myPanel.grp.dd.selection = 0;

            // Add the 3 types of scale options
            var ddArray = ["Scale Factor", "Comp Width", "Comp Height"];
            var items = [];
            for (var i = 0; i < ddArray.length; i++) {
                items.push(myPanel.grp.dd.add("item", ddArray[i]));
            }

            // changing sizing and defaults of UI items
            myPanel.grp.dd.selection = parseInt(initObj["ddSelection"]);
            myPanel.grp.dd.size = [undefined, 20];
            myPanel.grp.editText.text = initObj["value"];
            myPanel.grp.editText.size = [undefined, 20];
            myPanel.grp.recursiveCheckbox.alignment = "left";
            myPanel.grp.recursiveCheckbox.value = JSON.parse(initObj["recursiveValue"]);
            myPanel.grp.scaleButton.size = [undefined, 20];

            // When we click on the Scale button
            myPanel.grp.scaleButton.onClick = function () {

                var failure = false;
                var comp = app.project.activeItem;
                var recursiveBool = myPanel.grp.recursiveCheckbox.value;

                // First, check that the user input an actual number for scaling
                if (validateNumber(myPanel.grp.editText.text) == false) {
                    alert("You input \"" + myPanel.grp.editText.text + "\". Please try again with a number.")
                    return false;
                }

                // Then check that there is an active Composition 
                if (app.project.activeItem == null || !(app.project.activeItem instanceof CompItem)) {
                    alert("Please select a composition");
                    return false;
                }

                // remember the active settings for next time
                app.preferences.savePrefAsString("Settings_Super Resize Me!", "ddSelection", myPanel.grp.dd.selection.index.toString());
                app.preferences.savePrefAsString("Settings_Super Resize Me!", "value", myPanel.grp.editText.text);
                app.preferences.savePrefAsString("Settings_Super Resize Me!", "recursiveValue", myPanel.grp.recursiveCheckbox.value);
                app.preferences.saveToDisk();

                // adjust scaling factor based on the dropdown selection the user made
                switch (myPanel.grp.dd.selection.index) {
                    case 0:
                        scalingFactor = parseFloat(myPanel.grp.editText.text);
                        break;
                    case 1:
                        scalingFactor = parseFloat(myPanel.grp.editText.text) / app.project.activeItem.width;
                        if (parseFloat(myPanel.grp.editText.text) < 4) {
                            failure = true;
                        }
                        break;
                    case 2:
                        scalingFactor = parseFloat(myPanel.grp.editText.text) / app.project.activeItem.height;
                        if (parseFloat(myPanel.grp.editText.text) < 4) {
                            failure = true;
                        }
                        break;
                }

                if (failure) {
                    alert("The minimum Composition dimensions are 4x4 pixels. The desired Composition size of " + Math.floor(comp.width * scalingFactor) + "x" + Math.floor(comp.height * scalingFactor) + " is smaller than After Effects limits. Try again with a higher number.", "");
                    return false;
                } else {
                    //Entered Max Comp Size
                    if (comp.width * scalingFactor > 30000 || comp.height * scalingFactor > 30000) {
                        alert("The maximum Composition Dimensions are 30,000x30,000 pixels. The desired Composition size of " + Math.floor(comp.width * scalingFactor) + "x" + Math.floor(comp.height * scalingFactor) + " exceeds After Effects limits. Try again with a lower number.", "");
                        return false;
                    }
                    // Entered Minimum Comp Size
                    if (comp.width * scalingFactor < 4 || comp.height * scalingFactor < 4) {
                        alert("The minimum Composition dimensions are 4x4 pixels. The desired Composition size of " + Math.floor(comp.width * scalingFactor) + "x" + Math.floor(comp.height * scalingFactor) + " is smaller than After Effects limits. Try again with a higher number.", "");
                        return false;
                    }

                    app.beginUndoGroup("Super Resize Me!");

                    processedComps = [];
                    compsDone = [];

                    if (recursiveBool == true) {
                        recursiveScaleCompWithProgress(comp);
                    } else {
                        nonRecursiveScaleComp(comp)
                    }

                    relockAllComps();

                    lockedLayers = [];

                    app.endUndoGroup();
                }
            }

            myPanel.layout.layout(true);

            myPanel.onResizing = myPanel.onResize = function () {
                myPanel.layout.resize();

                // Auto-Resizing the Dropdown Menu Items
                myPanel.grp.dd.itemSize = [myPanel.grp.dd.size.width - 26, myPanel.grp.dd.size.height];
            }

            return myPanel;
        }

        var myScriptPal = myScript_buildUI(thisObj);

        if (myScriptPal != null && myScriptPal instanceof Window) {
            myScriptPal.center();
            myScriptPal.show();
        }
    }

    myScript(this);

    // FUNCTIONS
    // 
    // security check to make sure scripting can write to rememberMe.json file
    function isSecurityPrefSet() {
        try {
            var securitySetting = app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY");
            return (securitySetting == 1);
        } catch (err) {
            alert("Error in isSecurityPrefSet function\n" + err.toString());
        }
    }

    // Non-recursive and no progress bar
    function nonRecursiveScaleComp(theComp) {

        // Create the Null to use for scaling
        var origin = theComp.layers.addNull();
        origin.threeDLayer = true;
        origin.position.setValue([0, 0, 0]);

        // Set new comp width and height.
        var newWidth = Math.floor(theComp.width * scalingFactor);
        var newHeight = Math.floor(theComp.height * scalingFactor);
        theComp.width = newWidth < 4 ? 4 : newWidth;
        theComp.height = newHeight < 4 ? 4 : newHeight;

        // Unlock all the layers for processing
        unlockAllLayers(theComp);

        // If the comp has no Camera Layers + Default Cam is used
        scaleDefaultCameras(theComp, scalingFactor);

        // Scale Camera Layer Zooms
        scaleAllCameraZooms(theComp, scalingFactor);

        // Set null3DLayer as parent of all layers that don't have parents.  
        makeParentLayerOfAllUnparented(theComp, origin);

        // Set the scale of the origin layer proportionately.
        origin.scale.setValue(origin.scale.value * scalingFactor);

        // Delete the origin layer  with dejumping enabled.
        origin.remove();
    }

    // Processing the Starting Comp (Recursive)
    function recursiveScaleCompWithProgress(theComp) {

        // Create the Progress Bar
        var progBarUI = buildProgressBarUI("Progress", 300, 40);
        progBarUI.show();

        // Create the Null to use for scaling
        var origin = theComp.layers.addNull();
        origin.threeDLayer = true;
        origin.position.setValue([0, 0, 0]);

        // Set new comp width and height.
        var newWidth = Math.floor(theComp.width * scalingFactor);
        var newHeight = Math.floor(theComp.height * scalingFactor);
        theComp.width = newWidth < 4 ? 4 : newWidth;
        theComp.height = newHeight < 4 ? 4 : newHeight;

        // Unlock all the layers for processing
        unlockAllLayers(theComp);

        // If the comp has no Camera Layers + Default Cam is used
        scaleDefaultCameras(theComp, scalingFactor);

        // Scale Camera Layer Zooms
        scaleAllCameraZooms(theComp, scalingFactor);

        // Process all the layers
        for (var i = 1; i <= theComp.numLayers; i++) {
            var iLayer = theComp.layer(i);
            updateProgBar(progBarUI, i - 1, theComp.numLayers, "Processing " + iLayer.name);

            if (iLayer != origin && iLayer.transform.enabled && iLayer.transform.active) {
                if (iLayer.source instanceof CompItem) {
                    // check to make sure this precomp has not been processed
                    var isAlreadyDone = false;

                    for (var m = 0; m < compsDone.length; m++)
                        if (iLayer.source == compsDone[m])
                            isAlreadyDone = true;

                    // if precomp has not been processed yet, then do it
                    if (!isAlreadyDone) {
                        recursiveScaleComp(iLayer.source);
                        compsDone[compsDone.length] = iLayer.source;
                    }

                    //fix the children of this comp
                    for (var j = 1; j <= theComp.numLayers; j++) {
                        var jLayer = theComp.layer(j);
                        if (jLayer.parent == iLayer && !(jLayer.hasAudio && !jLayer.hasVideo)) {
                            try {
                                if (jLayer.position.numKeys > 0)
                                    for (var k = 1; k <= jLayer.position.numKeys; k++)
                                        jLayer.position.setValueAtKey(k, jLayer.position.keyValue(k) * scalingFactor);
                                else
                                    jLayer.position.setValue(jLayer.position.value * scalingFactor);

                                if (jLayer.scale.numKeys > 0)
                                    for (var k = 1; k <= jLayer.scale.numKeys; k++)
                                        jLayer.scale.setValueAtKey(k, jLayer.scale.keyValue(k) * scalingFactor);
                                else
                                    jLayer.scale.setValue(jLayer.scale.value * scalingFactor);
                            }
                            catch (err) { }
                        }
                    }

                    if (iLayer.scale.numKeys > 0)
                        for (var k = 1; k <= iLayer.scale.numKeys; k++)
                            iLayer.scale.setValueAtKey(k, iLayer.scale.keyValue(k) / scalingFactor);
                    else
                        iLayer.scale.setValue(iLayer.scale.value / scalingFactor);
                }

                if (!(iLayer.hasAudio && !iLayer.hasVideo) && (iLayer.parent == null)) iLayer.parent = origin;
            }
            /*             if (iLayer instanceof CameraLayer) {
                            if (iLayer.zoom.numKeys == 0)
                                iLayer.zoom.setValue(iLayer.zoom.value * scalingFactor);
                            else
                                for (var j = 1; j <= iLayer.zoom.numKeys; j++)
                                    iLayer.zoom.setValueAtKey(j, iLayer.zoom.keyValue(j) * scalingFactor);
                        } */

        }

        // Set the scale of the origin layer proportionately.
        origin.scale.setValue(origin.scale.value * scalingFactor);

        // Delete the origin layer  with dejumping enabled.
        origin.remove();

        updateProgBar(progBarUI, 1, 1, "Processing"); // momentary display of completion

        // Show the Progress Bar to break out of the update() drawing loop
        // And then close the Progress Bar
        progBarUI.show();
        progBarUI.close();

    }

    //Processing the child comps (Recursive)
    function recursiveScaleComp(theComp) {
        var origin = theComp.layers.addNull();
        origin.threeDLayer = true;
        origin.position.setValue([0, 0, 0]);

        // Set new comp width and height.
        var newWidth = Math.floor(theComp.width * scalingFactor);
        var newHeight = Math.floor(theComp.height * scalingFactor);
        theComp.width = newWidth < 4 ? 4 : newWidth;
        theComp.height = newHeight < 4 ? 4 : newHeight;

        // If the comp has no Camera Layers + Default Cam is used       
        scaleDefaultCameras(theComp, scalingFactor)

        // Unlock all layers for processing
        unlockAllLayers(theComp);

        // Process all the layers
        for (var i = 1; i <= theComp.numLayers; i++) {
            var iLayer = theComp.layer(i);

            if (iLayer != origin && iLayer.transform.enabled && iLayer.transform.active) {
                if (iLayer.source instanceof CompItem) {
                    // check to make sure this comp has not been processed
                    var isAlreadyDone = false;

                    for (var m = 0; m < compsDone.length; m++)
                        if (iLayer.source == compsDone[m])
                            isAlreadyDone = true;

                    // if not processed yet then do it
                    if (!isAlreadyDone) {
                        recursiveScaleComp(iLayer.source);
                        compsDone[compsDone.length] = iLayer.source;
                    }

                    //fix the children of this comp
                    for (var j = 1; j <= theComp.numLayers; j++) {
                        var jLayer = theComp.layer(j);
                        if (jLayer.parent == iLayer && !(jLayer.hasAudio && !jLayer.hasVideo)) {
                            try {
                                if (jLayer.position.numKeys > 0)
                                    for (var k = 1; k <= jLayer.position.numKeys; k++)
                                        jLayer.position.setValueAtKey(k, jLayer.position.keyValue(k) * scalingFactor);
                                else
                                    jLayer.position.setValue(jLayer.position.value * scalingFactor);

                                if (jLayer.scale.numKeys > 0)
                                    for (var k = 1; k <= jLayer.scale.numKeys; k++)
                                        jLayer.scale.setValueAtKey(k, jLayer.scale.keyValue(k) * scalingFactor);
                                else
                                    jLayer.scale.setValue(jLayer.scale.value * scalingFactor);
                            }
                            catch (err) { }
                        }
                    }

                    if (iLayer.scale.numKeys > 0)
                        for (var k = 1; k <= iLayer.scale.numKeys; k++)
                            iLayer.scale.setValueAtKey(k, iLayer.scale.keyValue(k) / scalingFactor);
                    else
                        iLayer.scale.setValue(iLayer.scale.value / scalingFactor);
                }
                else if ((appVersion < 9) && !iLayer.position.isModified && !(iLayer.hasAudio && !iLayer.hasVideo) && !iLayer.position.elided) 		// under certain circumstances in CS3 the position value is not filled when a project is just opened (nested layer unmodified position value)
                    iLayer.position.setValue(iLayer.position.value);						// this validates the position

                if (!(iLayer.hasAudio && !iLayer.hasVideo) && (iLayer.parent == null)) iLayer.parent = origin;
            }

            if (iLayer instanceof CameraLayer) {
                if (iLayer.zoom.numKeys == 0)
                    iLayer.zoom.setValue(iLayer.zoom.value * scalingFactor);
                else
                    for (var j = 1; j <= iLayer.zoom.numKeys; j++)
                        iLayer.zoom.setValueAtKey(j, iLayer.zoom.keyValue(j) * scalingFactor);
            }

        }

        // Set the scale of the origin layer proportionately.
        origin.scale.setValue(origin.scale.value * scalingFactor);

        // Delete the origin layer  with dejumping enabled.
        origin.remove();
    }

    // Sets newParent as the parent of all layers in theComp that don't have parents.
    // This includes 2D/3D lights, camera, av, text, etc.
    function makeParentLayerOfAllUnparented(theComp, newParent) {
        for (var i = 1; i <= theComp.numLayers; i++) {
            var iLayer = theComp.layer(i);
            if (iLayer != newParent && iLayer.parent == null) {
                iLayer.parent = newParent;
            }
        }
    }

    // Check if comp contains camera layers
    function compContainsCamera(theComp) {
        // Check comp for camera layers
        for (var i = 1; i <= theComp.numLayers; i++) {
            var thisLayer = theComp.layer(i);

            if (thisLayer instanceof CameraLayer) {
                return true;
            }
        }
    }

    // Scale the invisible "Default" 3D Camera
    function scaleDefaultCameras(theComp, scalingFactor) {

        // If any layers are 3D
        if (theComp.activeCamera) {

            // If we have no camera layers
            if (!compContainsCamera(theComp)) {

                // If the Default camera is being used
                if (theComp.activeCamera.name == "Default") {
                    cam = theComp.activeCamera;

                    var ogPointOfInterest = cam.property("ADBE Transform Group").property("ADBE Anchor Point").value;
                    var ogPosition = cam.property("ADBE Transform Group").property("ADBE Position").value;

                    try {
                        cam.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([ogPointOfInterest[0] * scalingFactor, ogPointOfInterest[1] * scalingFactor, ogPointOfInterest[2] * scalingFactor]);
                    } catch (e) {
                    }
                    try {
                        cam.property("ADBE Transform Group").property("ADBE Position").setValue([ogPosition[0] * scalingFactor, ogPosition[1] * scalingFactor, ogPosition[2] * scalingFactor]);
                    } catch (e) {
                    }
                    try {
                        cam.property("ADBE Camera Options Group").property("ADBE Camera Zoom").setValue(cam.property("ADBE Camera Options Group").property("ADBE Camera Zoom").value * scalingFactor);
                    } catch (e) {
                    }
                    try {
                        cam.property("ADBE Camera Options Group").property("ADBE Camera Focus Distance").setValue(cam.property("ADBE Camera Options Group").property("ADBE Camera Focus Distance").value * scalingFactor);
                    } catch (e) {
                    }
                }
            }
        }
    }

    // Scales the zoom factor of every camera by the given scale_factor.
    // Handles both single values and multiple keyframe values.
    function scaleAllCameraZooms(theComp, scalingFactor) {
        for (var i = 1; i <= theComp.numLayers; i++) {
            var iLayer = theComp.layer(i);
            if (iLayer.matchName == "ADBE Camera Layer") {
                var curZoom = iLayer.zoom;
                if (curZoom.numKeys == 0) {
                    curZoom.setValue(curZoom.value * scalingFactor);
                } else {
                    for (var j = 1; j <= curZoom.numKeys; j++) {
                        curZoom.setValueAtKey(j, curZoom.keyValue(j) * scalingFactor);
                    }
                }
            }
        }
    }

    // Unlocking / Relocking
    function unlockAllLayers(theComp) {
        for (var i = 1; i <= theComp.numLayers; i++) {
            var thisLayer = theComp.layer(i);

            if (thisLayer.locked) {
                thisLayer.locked = false;
                lockedLayers.push(thisLayer);
            }
        }
    }
    function relockAllComps() {
        for (var l = 0; l < lockedLayers.length; l++) {
            lockedLayers[l].locked = true;
        }

        lockedLayers = [];
    }

    // Number validation
    function validateNumber(number) {
        return !isNaN(parseFloat(number) && isFinite(number));
    }
}
