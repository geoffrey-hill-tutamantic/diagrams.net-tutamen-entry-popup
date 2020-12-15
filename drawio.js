/**
 * Draw io plugin.
 */

const pleaseSelectShape = '<p><i>Select a shape.</i></p>';

const attribute = 'ATTRIBUTES';

const allProperties = [
    // default
    'ZONE',
    // other
    'ELEMENT',
    'PROCESS',
    'DATAFLOW',
    // AUTHN
    'AUTHN.METHOD',
    'AUTHN.METHOD.OTP',
    'AUTHN.METHOD.CERTIFICATE',
    'AUTHN.METHOD.CHALLENGERESPONSE',
    'AUTHN.METHOD.HMACCHALLENGERESPONSE',
    'AUTHN.METHOD.BIOMETRIC',
    'AUTHN.METHOD.COOKIE',
    'AUTHN.TOKEN',
    'AUTHN.TOKEN.SAML',
    'AUTHN.TOKEN.OAUTH2',
    'AUTHN.TOKEN.OPENIDCONNECT',
    'AUTHN.PROTOCOL',
    'AUTHN.PROTOCOL.EAP',
    'AUTHN.PROTOCOL.KERBEROS',
    // AUTHZ
    'AUTHZ.METHOD',
    'AUTHZ.METHOD.ABAC',
    'AUTHZ.METHOD.RBAC',
    'AUTHZ.TOKEN',
    'AUTHZ.TOKEN.SAML',
    'AUTHZ.TOKEN.XACML',
    'AUTHZ.TOKEN.OAUTH2',
    'AUTHZ.PROTOCOL',
    // CONFIG
    'CONFIG',
    // CRYPTO
    'CRYPTO.INTERFACE',
    'CRYPTO.INTERFACE.PKCS11',
    'CRYPTO.INTERFACE.KMIP',
    'CRYPTO.PROTOCOL',
    'CRYPTO.PROTOCOL.SSL',
    'CRYPTO.PROTOCOL.TLS',
    'CRYPTO.PROTOCOL.WSTRUST',
    'CRYPTO.PROTOCOL.WSSECURITY',
    // SENSITIVEDATA
    'SENSITIVEDATA',
    // VALIDATION
    'VALIDATION.CONSTRAIN',
    'VALIDATION.CONSTRAIN.WHITELIST',
    'VALIDATION.REJECT',
    'VALIDATION.REJECT.BLACKLIST',
    'VALIDATION.SANITIZE',
    'VALIDATION.SANITIZE.ENCODING',
    // SESSION
    'SESSION',
    // EXCEPTION
    'EXCEPTION',
    // AUDITING
    'AUDITING'
];

const defaultCheckedValue = [
    'ZONE'
];

const numberInput = [
    'ZONE'
];

const notAtAtAttribute = [
    'ZONE'
];

// get html template for one property 
const getPropertyTemplate = (nodeName, nodeValue, inputType, dontShowDelete) => {
    return (
        `<div id="${nodeName}-container" style="display:flex; margin-bottom:10px; align-items:center; justify-items:center; margin-right:10px;">
            <div style="width:50%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                <label>${nodeName}: </label>
            </div>
            <div id="${nodeName}-input-container" style="width:100%; margin-right:5px; padding-right:5px;">
                <input id="${nodeName}-input" class="property-input" value="${nodeValue}" type="${inputType}" style="width: 100%; border:1px solid black;" />
            </div>
            <div id="${nodeName}-button-container" style="margin-left:5px;">          
                <button id="${nodeName}-button" class="property-delete" style="border-radius:50%; border:1px solid rgb(184, 84, 80); color:rgb(184, 84, 80); background-color:rgb(248, 206, 204); ${dontShowDelete ? "display: none;" : ""}"> x </button>
            </div>
        </div>`
    );
}

// //get html template for add new property
// const getNewPropertyTemplate = (options, showDelete) => {
//     return (
//         `<div id="new-property-container" style="display:flex; align-items:center; justify-items:center;">
//             <div style="margin-right:5px;">
//                 <select id="new-select" style="width:100%">
//                     ${options}
//                 </select>
//             </div>
//             <div style="margin-left:5px;">
//                 <button id="add-button" style="border-radius:0; border:1px solid rgb(215, 155, 0); color:rgb(215, 155, 0); background-color:rgb(255, 242, 204); padding:5px;">Add</button>
//             </div>
//         </div>`
//     );
// }

// get html wizzard template
const getWizzardTemplate = (checkboxes) => {
    return (
        `<div id="wizzard-template" style="margin-bottom:5px;">
            <div style="margin-bottom:5px;">
                ${checkboxes}
            </div>
            <div style="margin-bottom:5px; text-align:center;">
                <button id="apply-button" style="border-radius:0; border:1px solid rgb(215, 155, 0); color:rgb(215, 155, 0); background-color:rgb(255, 242, 204); padding:5px;">Apply</button>
            </div>
        </div>`
    );
}

// get html checkbox template
const getCheckBoxTemplate = (nodeName, isChecked) => {
    return (
        `<div style="padding-bottom: 5px; padding-top: 5px; display:flex; align-items:center;">
            <input id="${nodeName}-checkbox" class="wizzard-checkboxes" type="checkbox" ${isChecked ? "checked" : ""} value="${nodeName}" style="margin-right:7px;" />
            <label>${nodeName}</label>
        </div>`
    );
}

const getMultiSelectWithSearchTemplate = (tags, options, placeholder) => {
    return (
        `<div id="multiselect-container">
            <style>
                #multiselect-tags-container {
                    border: 1px solid black;
                    border-bottom: 1px solid white;
                    max-height: 200px;
                    overflow: scroll;
                    overflow-x: hidden;
                    padding: 3px;
                }
  
                #multiselect-dropdown-container {
                    position: relative;
                }

                /* Tags */
                .multiselect-tag-container {
                    display: flex;
                    justify-content: space-between;
                    border: 1px solid rgb(215, 155, 0);
                    border-radius: 5px;
                    background-color: rgb(255, 242, 204);
                    padding: 5px;
                    margin: 4px 5px;
                    word-break: break-all;
                }
  
                .multiselect-delete-button-container {
                    align-self: center;
                }
  
                .multiselect-delete-button {
                    color: rgb(184, 84, 80);
                    border: none;
                    background: none;
                    font-weight: bold;
                }
  
                /* Search */
                #multiselect-search-container {
                    border: 1px solid black;
                    border-top: none;
                }
  
                #multiselect-search-input {
                    width: 100%;
                    width: -webkit-fill-available;
                    border: none;
                    margin: 4px 5px;
                }
  
                #multiselect-search-input:hover {
                    outline: none;
                }
  
                #multiselect-search-input:focus {
                    outline: none;
                }
  
                /* Options */
                #multiselect-options-container {
                    width: fit-content;
                    padding: 5px;
                    border: 1px solid black;
                    margin-top: -5px;
                    margin-left: 3px;
                    max-height: 180px;
                    overflow: scroll;
                    overflow-x: hidden;
                    background-color: white;
                    font-size: 13px;
                    position: fixed; 
                    z-index: 3;
                    display: none;
                }
  
                .multiselect-option-container {
                    display: flex;
                }

                .select-checkbox {
                    margin-right: 7px;
                }

                .multiselect-option-label {
                    display: block;
                }
            </style>

            <div id="multiselect-tags-container">
                ${tags}
            </div>
  
            <div id="multiselect-dropdown-container">
                <div id="multiselect-search-container">
                    <input id="multiselect-search-input" placeholder="${placeholder || 'Please input search text'}" value="" />
                </div>
  
                <div id="multiselect-options-container">
                    ${options}
                </div>
            </div>
        </div>`
    );
}

const getCustomOptionTemplate = (value, isSelected) => {
    return (
        `<div class="multiselect-option-container">
            <input type="checkbox" class="select-option-checkbox" id="${value}-select-checkbox" value="${value}" ${isSelected ? "checked" : ""}/>
            <label class="multiselect-option-label">${value}</label>
        </div>`
    );
}

const getCustomTagTemplate = (value) => {
    return (
        `<div id="${value}-tag-container" class="multiselect-tag-container">
            ${value}
            <div class="multiselect-delete-button-container">
                <button id="${value}-tag-delete" class="multiselect-delete-button">X</button>
            </div>
        </div>`
    );
}

Draw.loadPlugin(function (ui) {

    var div = document.createElement('div');
    div.id = 'main-container';
    div.style.background = (uiTheme == 'dark') ? '#2a2a2a' : '#ffffff';
    div.style.border = '1px solid gray';
    div.style.position = 'absolute';
    div.style.padding = '10px';
    div.style.paddingTop = '5px';
    div.style.width = '25%';
    div.style.minWidth = '200px';
    div.style.top = '40px';
    div.style.right = '20px';
    div.style.maxHeight = "330px";
    div.style.overflow = "scroll";
    div.style.overflowX = "hidden";

    var graph = ui.editor.graph;

    // Made for chromeless mode
    if (!ui.editor.isChromelessView()) {
        div.style.top = '100px';
        div.style.right = '260px';
    }

    div.innerHTML = pleaseSelectShape;
    document.body.appendChild(div);

    // Highlights current cell
    var highlight = new mxCellHighlight(graph, '#00ff00', 8);

    /**
     * Create Node from HTML string.
     */
    const createElementFromHTML = (template) => {
        var temp = document.createElement('div');
        temp.innerHTML = template;
        return temp.firstChild;
    }

    /**
     * Parse attributes.
     */
    const parseAttribute = (cell) => {
        var attr = cell.value.attributes.getNamedItem(attribute.toLowerCase());

        if (attr && attr.nodeValue !== "" && attr.nodeValue !== " ") {
            return attr.nodeValue.toUpperCase().split(',');
        }

        return [];
    }

    /**
    * Convert attribute from list to string.
    */
    const convertToString = (list) => {
        return list.join(",");
    }

    /**
     * Updates the properties panel
     */
    const cellClicked = (cell) => {
        // Forces focusout in IE
        graph.container.focus();

        // Gets the selection cell
        if (cell == null) {
            // if cell is not selected set innerHTML to pleaseSelectShape
            highlight.highlight(null);
            div.innerHTML = pleaseSelectShape;
        }
        else {
            var attrs = (cell.value != null) ? cell.value.attributes : null;
            highlight.highlight(graph.view.getState(cell));

            if (attrs != null) {
                var ignored = ['label', 'tooltip', 'placeholders', attribute.toLowerCase()];
                var label = graph.sanitizeHtml(graph.getLabel(cell));

                // Add header (shape label)
                if (label != null && label.length > 0) {
                    div.innerHTML = '<h2>' + label + '</h2>';
                }
                else {
                    div.innerHTML = '';
                }

                // Show value not stored in attributes
                for (var i = 0; i < attrs.length; i++) {
                    if (mxUtils.indexOf(ignored, attrs[i].nodeName) < 0 && attrs[i].nodeValue.length > 0) {
                        let nodeName = attrs[i].nodeName.toUpperCase();
                        if (allProperties.includes(nodeName)) {
                            div.innerHTML += getPropertyTemplate(nodeName, attrs[i].nodeValue, numberInput.includes(nodeName) ? 'number' : 'text', defaultCheckedValue.includes(nodeName));
                        }
                        else {
                            div.innerHTML +=
                                `<div>
                                    <p>
                                        <strong>${graph.sanitizeHtml(nodeName)}</strong>: ${graph.sanitizeHtml(attrs[i].nodeValue)}
                                    </p>
                                </div>`;
                        }
                    }
                }

                // Show value stored in attributes
                let attributesList = parseAttribute(cell);
                let tagTemplates = attributesList.filter(x => !notAtAtAttribute.includes(x))
                    .map(x => {
                        x = x.toUpperCase();
                        return getCustomTagTemplate(x);
                    }).join(" ");

                let optionTemplates = allProperties.filter(x => !notAtAtAttribute.includes(x))
                    .map(x => {
                        x = x.toUpperCase();
                        return getCustomOptionTemplate(x, attributesList.includes(x));
                    }).join(" ");

                let selectTemplate = getMultiSelectWithSearchTemplate(tagTemplates, optionTemplates, attributesList.length === 0 ? 'Please select some attributes' : undefined);

                div.innerHTML += selectTemplate;

                //Add change event listeners to inputs
                let inputs = document.getElementsByClassName('property-input');

                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].addEventListener('change', (event) => {
                        let name = event.target.id.split('-')[0].toLowerCase();

                        let newAttr = cell.value.attributes.getNamedItem(name);
                        newAttr.nodeValue = event.target.value;
                        cell.value.attributes.setNamedItem(newAttr);

                        this.value = event.target.value
                    });
                }

                // Add click event listeners to delete buttons
                let buttons = document.getElementsByClassName('property-delete');

                for (let i = 0; i < buttons.length; i++) {
                    buttons[i].addEventListener("click", (event) => {
                        let name = event.target.id.split('-')[0];

                        if (!notAtAtAttribute.includes(name)) {
                            let newAttr = cell.value.attributes.getNamedItem(attribute.toLowerCase());
                            let attributesList = parseAttribute(cell);

                            attributesList = attributesList.filter(x => x.toUpperCase() != name.toUpperCase());

                            newAttr.nodeValue = convertToString(attributesList);
                            cell.value.attributes.setNamedItem(newAttr);
                        }
                        else {
                            cell.value.attributes.removeNamedItem(name.toLowerCase());
                        }

                        let newMainContainerLocal = document.getElementById('main-container');
                        let newPropertyContainer = document.getElementById(`${name}-container`);
                        newMainContainerLocal.removeChild(newPropertyContainer);
                    });
                }

                // Add focus event listeners to multiselect input
                let multiSelectInput = document.getElementById('multiselect-search-input');
                multiSelectInput.addEventListener("focus", () => {
                    let tagContainer = document.getElementById("multiselect-options-container");
                    tagContainer.style.display = 'block';
                });

                // Add blur event listeners to multiselect input
                multiSelectInput.addEventListener("blur", (event) => {
                    let tagContainer = document.getElementById("multiselect-options-container");

                    if (!event.relatedTarget || !event.relatedTarget.className || (event.relatedTarget && event.relatedTarget.className && !event.relatedTarget.className.includes('option'))) {
                        tagContainer.style.display = 'none';
                    }
                });

                // Add change event listeners to multiselect input
                multiSelectInput.addEventListener("change", () => {
                    // TODO: Search
                });

                // Add click event listeners to tag delete buttons
                let tagDeleteButtons = document.getElementsByClassName("multiselect-delete-button");
                for (let i = 0; i < tagDeleteButtons.length; i++) {
                    tagDeleteButtons[i].addEventListener("click", (event) => {
                        let name = event.target.id.split('-')[0];
                        let attributesList = parseAttribute(cell);

                        attributesList = attributesList.filter(x => x.toUpperCase() != name.toUpperCase());

                        let newAttr = cell.value.attributes.getNamedItem(attribute.toLowerCase());
                        newAttr.nodeValue = convertToString(attributesList);
                        cell.value.attributes.setNamedItem(newAttr);

                        let containe = document.getElementById("multiselect-tags-container");
                        let tagContainer = document.getElementById(`${name}-tag-container`);
                        containe.removeChild(tagContainer);
                    });
                }

                // Add change event listeners to select checkboxes
                let selectCheckboxes = document.getElementsByClassName('select-option-checkbox');

                for (let i = 0; i < selectCheckboxes.length; i++) {
                    selectCheckboxes[i].addEventListener("change", (event) => {
                        let name = event.target.value;

                        let tagContainer = document.getElementById("multiselect-tags-container");
                        let tagTemplate = getCustomTagTemplate(name);
                        tagContainer.innerHTML = tagTemplate + tagContainer.innerHTML;

                        let attributesList = parseAttribute(cell);
                        attributesList.push(name);

                        let newAttr = cell.value.attributes.getNamedItem(attribute.toLowerCase());
                        newAttr.nodeValue = convertToString(attributesList);
                        cell.value.attributes.setNamedItem(newAttr);
                    });
                }
            }
            else {
                div.innerHTML = '<h2>' + (cell.value || '') + '</h2>';

                // Show wizzard if cell.value.attributes is empty
                let checkboxTemplates = allProperties.map(x => {
                    let name = x.toUpperCase();
                    return getCheckBoxTemplate(name, defaultCheckedValue.includes(name));
                });

                let wizzardTemplate = getWizzardTemplate(checkboxTemplates.join(" "));
                div.innerHTML += wizzardTemplate;

                // Add click event listener to apply button
                let applyButton = document.getElementById("apply-button");

                if (applyButton) {
                    applyButton.addEventListener("click", (event) => {

                        if (!mxUtils.isNode(cell.value)) {
                            // Create node
                            var doc = mxUtils.createXmlDocument();
                            var obj = doc.createElement('object');
                            obj.setAttribute('label', cell.value || '');

                            // Updates the value of the cell (undoable)
                            graph.getModel().setValue(cell, obj);
                        }

                        let checkboxes = document.getElementsByClassName("wizzard-checkboxes");
                        let nodeNames = [];
                        if (checkboxes) {
                            for (let item of checkboxes) {
                                if (item.checked) {
                                    let nodeValue = item.value.toUpperCase();
                                    if (notAtAtAttribute.includes(nodeValue)) {
                                        let newAttr = document.createAttribute(nodeValue);
                                        newAttr.textContent = numberInput.includes(nodeValue) ? 0 : nodeValue;
                                        cell.value.attributes.setNamedItem(newAttr);
                                    }
                                    else {
                                        nodeNames = [...nodeNames, nodeValue];
                                    }
                                }
                            }
                        }

                        let newAttr = document.createAttribute(attribute);
                        newAttr.textContent = convertToString(nodeNames);
                        cell.value.attributes.setNamedItem(newAttr);
                    });
                }
            }
        }
    };

    /**
     * Creates the textfield for the given property.
     */
    const createTextField = (graph, form, cell, attribute) => {
        var input = form.addText(attribute.nodeName + ':', attribute.nodeValue);

        var applyHandler = function () {
            var newValue = input.value || '';
            var oldValue = cell.getAttribute(attribute.nodeName, '');

            if (newValue != oldValue) {
                graph.getModel().beginUpdate();

                try {
                    var edit = new mxCellAttributeChange(
                        cell, attribute.nodeName,
                        newValue);
                    graph.getModel().execute(edit);
                    graph.updateCellSize(cell);
                }
                finally {
                    graph.getModel().endUpdate();
                }
            }
        };

        mxEvent.addListener(input, 'keypress', function (evt) {
            // Needs to take shift into account for textareas
            if (evt.keyCode == /*enter*/13 &&
                !mxEvent.isShiftDown(evt)) {
                input.blur();
            }
        });

        if (mxClient.IS_IE) {
            mxEvent.addListener(input, 'focusout', applyHandler);
        }
        else {
            // Note: Known problem is the blurring of fields in
            // Firefox by changing the selection, in which case
            // no event is fired in FF and the change is lost.
            // As a workaround you should use a local variable
            // that stores the focused field and invoke blur
            // explicitely where we do the graph.focus above.
            mxEvent.addListener(input, 'blur', applyHandler);
        }
    };

    graph.click = (me) => {
        // Async required to enable hyperlinks in labels
        window.setTimeout(function () {
            cellClicked(me.getCell());
        }, 0);
    };
});