/**
 * Draw io plugin.
 */

const pleaseSelectShape = '<p><i>Select a shape.</i></p>';

const attributesName = 'ATTRIBUTES';

const attributes = [
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

const notAtAttributes = [
    'ZONE'
];

const defaultValues = [
    'ZONE'
];

const numberInput = [
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
                <button id="${nodeName}-button" class="property-delete" style="border-radius:50%; border:1px solid rgb(184, 84, 80); color:rgb(184, 84, 80); background-color:rgb(248, 206, 204); ${dontShowDelete ? "visibility: hidden;" : ""}"> x </button>
            </div>
        </div>`
    );
}

// get html template for add new property
const getNewPropertyTemplate = () => {
    return (
        `<div id="custom-property-container" style="width:100%; display:flex; align-items:center; justify-content:flex-start; justify-items:center; align-content:center; margin:5px 0;">
            <style>
                .custom-input[type="text"] {
                    width: 100%;
                    flex: 1;
                    margin: 0 5px;
                    border: 1px solid black;
                    outline: none;
                }

                .custom-input[type="text"]:hover {
                    outline: none;
                }
  
                .custom-input[type="text"]:focus {
                    outline: none;
                }

                #add-custom-button {
                    border-radius: 0;
                    border: 1px solid rgb(215, 155, 0);
                    color: rgb(215, 155, 0);
                    background-color: rgb(255, 242, 204);
                    padding: 5px;
                    margin-left: 5px;
                }
            </style>

            <input id="custom-name-input" class="custom-input" type="text" />

            <input id="custom-value-input" class="custom-input" type="text" />

            <button id="add-custom-button">Add</button>
        </div>`
    );
}

// get html wizzard template
const getWizzardTemplate = (checkboxes) => {
    return (
        `<div id="wizzard-template" style="margin-bottom:5px;">
            <p style="margin-bottom:5px; text-align:center;"><strong>Please select value from attributes</strong></p>
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
            <input id="${nodeName}-checkbox" class="wizzard-checkboxes" type="checkbox" ${isChecked ? "checked disabled" : ""} value="${nodeName}" style="margin-right:7px;" />
            <label>${nodeName}</label>
        </div>`
    );
}

const getMultiSelectWithSearchTemplate = (tags, options, placeholder) => {
    return (
        `<div id="multiselect-container" style="margin-bottom: 10px;">
            <style>
                #multiselect-tags-container {
                    border: 1px solid black;
                    border-bottom: 1px solid white;
                    max-height: 170px;
                    overflow: scroll;
                    overflow-x: hidden;
                    padding: 2px;
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
                    margin-top: 0;
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
    div.style.maxHeight = "400px";
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
     * Parse attributes.
     */
    const parseAttribute = (cell) => {
        var attr = cell.value.attributes.getNamedItem(attributesName.toLowerCase());

        if (attr && attr.nodeValue !== "" && attr.nodeValue !== " ") {
            return attr.nodeValue.toUpperCase().split(',');
        }

        return [];
    }

    /**
    * Convert attributesName from list to string.
    */
    const convertToString = (list) => {
        return list.join(",");
    }

    /**
     * Return common view with events
     */
    const getCommonView = (cell) => {
        var ignored = ['label', 'tooltip', 'placeholders', attributesName.toLowerCase()];
        var label = graph.sanitizeHtml(graph.getLabel(cell));

        // Add header (shape label)
        if (label != null && label.length > 0) {
            div.innerHTML = '<h2>' + label + '</h2>';
        }
        else {
            div.innerHTML = '';
        }

        // Show value stored in attributes
        let attributesList = parseAttribute(cell);
        let tagTemplates = attributesList.filter(x => !notAtAttributes.includes(x))
            .map(x => {
                x = x.toUpperCase();
                return getCustomTagTemplate(x);
            }).join(" ");

        let optionTemplates = attributes.map(x => {
            x = x.toUpperCase();
            return getCustomOptionTemplate(x, attributesList.includes(x));
        }).join(" ");

        let selectTemplate = getMultiSelectWithSearchTemplate(tagTemplates, optionTemplates, attributesList.length === 0 ? 'Please select some attributes' : undefined);
        div.innerHTML += selectTemplate;

        // Show value not stored in attributes
        let propetiesContainer = document.createElement('div');
        propetiesContainer.id = 'other-properties-container'
        propetiesContainer.style.maxHeight = '90px';
        propetiesContainer.style.overflow = "scroll";
        propetiesContainer.style.overflowX = "hidden";

        div.appendChild(propetiesContainer)

        let attrs = cell.value.attributes;

        for (var i = 0; i < attrs.length; i++) {
            if (mxUtils.indexOf(ignored, attrs[i].nodeName) < 0 && attrs[i].nodeValue.length > 0) {
                let nodeName = attrs[i].nodeName.toUpperCase();
                propetiesContainer.innerHTML += getPropertyTemplate(nodeName, attrs[i].nodeValue, numberInput.includes(nodeName) ? 'number' : 'text', defaultValues.includes(nodeName));
            }
        }

        // Add custom properties
        div.innerHTML += getNewPropertyTemplate();

        //Add input event listeners to custom name input 
        let nameInput = document.getElementById("custom-name-input");
        nameInput.addEventListener('input', (event) => {
            let value = event.target.value;

            if (value && value != "" && value.trim() != "") {
                let localNameInput = document.getElementById("custom-name-input");
                localNameInput.style.borderColor = "black";
            }
        });

        //Add click event listeners to add new property button
        let newPropertyAddButton = document.getElementById("add-custom-button");

        newPropertyAddButton.addEventListener('click', () => {
            let newPropertyName = document.getElementById("custom-name-input")?.value;
            let newPropertyValue = document.getElementById("custom-value-input")?.value;

            if (newPropertyName && newPropertyName != "" && newPropertyName.trim() != "") {
                let newAttr = document.createAttribute(newPropertyName);
                newAttr.textContent = newPropertyValue || " ";
                cell.value.attributes.setNamedItem(newAttr);

                //Add new property node to DOM
                let newTemplate = getPropertyTemplate(newPropertyName.toUpperCase(), newPropertyValue, "text", false);
                let container = document.getElementById('other-properties-container');
                container.innerHTML += newTemplate;

                // Cleare inputs
                let localNameInput = document.getElementById("custom-name-input");
                if (localNameInput) {
                    localNameInput.value = "";
                }
                let localValueInput = document.getElementById("custom-value-input");
                if (localValueInput) {
                    localValueInput.value = "";
                }

                //Add change event listeners to input
                let input = document.getElementById(`${newPropertyName.toUpperCase()}-input`);
                input.addEventListener('change', (event) => {
                    let name = event.target.id.split('-')[0].toLowerCase();

                    let newAttr = cell.value.attributes.getNamedItem(name) || cell.value.attributes.getNamedItem(name.toUpperCase());
                    newAttr.nodeValue = event.target.value;
                    cell.value.attributes.setNamedItem(newAttr);

                    this.value = event.target.value
                });

                // Add click event listeners to delete button
                let button = document.getElementById(`${newPropertyName.toUpperCase()}-button`);
                button.addEventListener("click", (event) => {
                    let name = event.target.id.split('-')[0];

                    if (!notAtAttributes.includes(name)) {
                        let newAttr = cell.value.attributes.getNamedItem(attributesName.toLowerCase());
                        let attributesList = parseAttribute(cell);

                        if (attributesList.includes(name)) {
                            attributesList = attributesList.filter(x => x.toUpperCase() != name.toUpperCase());

                            newAttr.nodeValue = convertToString(attributesList);
                            cell.value.attributes.setNamedItem(newAttr);
                        }
                        else {
                            cell.value.attributes.removeNamedItem(name.toLowerCase());
                        }
                    }
                    else {
                        cell.value.attributes.removeNamedItem(name.toLowerCase());
                    }

                    let otherContainerLocal = document.getElementById('other-properties-container');
                    let newPropertyContainer = document.getElementById(`${name}-container`);
                    otherContainerLocal.removeChild(newPropertyContainer);
                });
            }
            else {
                let localNameInput = document.getElementById("custom-name-input");
                if (localNameInput) {
                    localNameInput.style.borderColor = "red";
                }
            }
        });

        //Add change event listeners to inputs
        let inputs = document.getElementsByClassName('property-input');

        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('change', (event) => {
                let name = event.target.id.split('-')[0].toLowerCase();

                let newAttr = cell.value.attributes.getNamedItem(name) || cell.value.attributes.getNamedItem(name.toUpperCase());
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

                if (!notAtAttributes.includes(name)) {
                    let newAttr = cell.value.attributes.getNamedItem(attributesName.toLowerCase());
                    let attributesList = parseAttribute(cell);

                    if (attributesList.includes(name)) {
                        attributesList = attributesList.filter(x => x.toUpperCase() != name.toUpperCase());

                        newAttr.nodeValue = convertToString(attributesList);
                        cell.value.attributes.setNamedItem(newAttr);
                    }
                    else {
                        cell.value.attributes.removeNamedItem(name.toLowerCase());
                    }
                }
                else {
                    cell.value.attributes.removeNamedItem(name.toLowerCase());
                }

                let otherContainerLocal = document.getElementById('other-properties-container');
                let newPropertyContainer = document.getElementById(`${name}-container`);
                otherContainerLocal.removeChild(newPropertyContainer);
            });
        }

        // Add focus event listeners to multiselect input
        let multiSelectInput = document.getElementById('multiselect-search-input');
        multiSelectInput.addEventListener("focus", () => {
            let optionsContainer = document.getElementById("multiselect-options-container");
            optionsContainer.style.display = 'block';
        });

        // Add blur event listeners to multiselect input
        multiSelectInput.addEventListener("blur", (event) => {
            let optionsContainer = document.getElementById("multiselect-options-container");

            if (!event.relatedTarget || !event.relatedTarget.className || (event.relatedTarget && event.relatedTarget.className && !event.relatedTarget.className.includes('option'))) {
                optionsContainer.style.display = 'none';
            }
        });

        // Add keypress event listeners to multiselect input
        multiSelectInput.addEventListener("input", (event) => {
            let value = event.target.value;

            let attributesList = parseAttribute(cell);
            let filteredValue = attributes.filter(x => x.toUpperCase().includes(value.toUpperCase()))
            let optionTemplates = filteredValue.map(x => {
                x = x.toUpperCase();
                return getCustomOptionTemplate(x, attributesList.includes(x));
            }).join(" ");

            var container = document.getElementById("multiselect-options-container");

            if (filteredValue.length > 0) {
                container.innerHTML = optionTemplates;
            }
            else {
                container.innerHTML = `<p>Can not find any value which contains '${value}'</p>`;
            }

            // Add change event listeners to select checkboxes
            let selectCheckboxes = document.getElementsByClassName('select-option-checkbox');

            for (let i = 0; i < selectCheckboxes.length; i++) {
                selectCheckboxes[i].addEventListener("change", (event) => {
                    let name = event.target.value;

                    if (event.target.checked) {
                        let tagContainer = document.getElementById("multiselect-tags-container");
                        let tagTemplate = getCustomTagTemplate(name);
                        tagContainer.innerHTML += tagTemplate;

                        let attributesList = parseAttribute(cell);
                        attributesList.push(name);

                        let newAttr = cell.value.attributes.getNamedItem(attributesName.toLowerCase());
                        newAttr.nodeValue = convertToString(attributesList);
                        cell.value.attributes.setNamedItem(newAttr);

                        // Add click event listeners to tag delete buttons
                        let tagDeleteButtons = document.getElementsByClassName("multiselect-delete-button");
                        for (let i = 0; i < tagDeleteButtons.length; i++) {
                            tagDeleteButtons[i].addEventListener("click", (event) => {
                                let name = event.target.id.split('-')[0];
                                let attributesList = parseAttribute(cell);

                                attributesList = attributesList.filter(x => x.toUpperCase() != name.toUpperCase());

                                let newAttr = cell.value.attributes.getNamedItem(attributesName.toLowerCase());
                                newAttr.nodeValue = convertToString(attributesList);
                                cell.value.attributes.setNamedItem(newAttr);

                                let containe = document.getElementById("multiselect-tags-container");
                                let tagContainer = document.getElementById(`${name}-tag-container`);
                                containe.removeChild(tagContainer);

                                let checkBoxLocal = document.getElementById(`${name}-select-checkbox`);
                                checkBoxLocal.checked = false;
                            });
                        }
                    }
                    else {
                        let attributesList = parseAttribute(cell);

                        attributesList = attributesList.filter(x => x.toUpperCase() != name.toUpperCase());

                        let newAttr = cell.value.attributes.getNamedItem(attributesName.toLowerCase());
                        newAttr.nodeValue = convertToString(attributesList);
                        cell.value.attributes.setNamedItem(newAttr);

                        let containe = document.getElementById("multiselect-tags-container");
                        let tagContainer = document.getElementById(`${name}-tag-container`);
                        containe.removeChild(tagContainer);
                    }
                });
            }
        });

        // Add click event listeners to tag delete buttons
        let tagDeleteButtons = document.getElementsByClassName("multiselect-delete-button");
        for (let i = 0; i < tagDeleteButtons.length; i++) {
            tagDeleteButtons[i].addEventListener("click", (event) => {
                let name = event.target.id.split('-')[0];
                let attributesList = parseAttribute(cell);

                attributesList = attributesList.filter(x => x.toUpperCase() != name.toUpperCase());

                let newAttr = cell.value.attributes.getNamedItem(attributesName.toLowerCase());
                newAttr.nodeValue = convertToString(attributesList);
                cell.value.attributes.setNamedItem(newAttr);

                let containe = document.getElementById("multiselect-tags-container");
                let tagContainer = document.getElementById(`${name}-tag-container`);
                containe.removeChild(tagContainer);

                let checkBoxLocal = document.getElementById(`${name}-select-checkbox`);
                checkBoxLocal.checked = false;
            });
        }

        // Add change event listeners to select checkboxes
        let selectCheckboxes = document.getElementsByClassName('select-option-checkbox');

        for (let i = 0; i < selectCheckboxes.length; i++) {
            selectCheckboxes[i].addEventListener("change", (event) => {
                let name = event.target.value;

                if (event.target.checked) {
                    let tagContainer = document.getElementById("multiselect-tags-container");
                    let tagTemplate = getCustomTagTemplate(name);
                    tagContainer.innerHTML += tagTemplate;

                    let attributesList = parseAttribute(cell);
                    attributesList.push(name);

                    let newAttr = cell.value.attributes.getNamedItem(attributesName.toLowerCase());
                    newAttr.nodeValue = convertToString(attributesList);
                    cell.value.attributes.setNamedItem(newAttr);

                    // Add click event listeners to tag delete buttons
                    let tagDeleteButtons = document.getElementsByClassName("multiselect-delete-button");
                    for (let i = 0; i < tagDeleteButtons.length; i++) {
                        tagDeleteButtons[i].addEventListener("click", (event) => {
                            let name = event.target.id.split('-')[0];
                            let attributesList = parseAttribute(cell);

                            attributesList = attributesList.filter(x => x.toUpperCase() != name.toUpperCase());

                            let newAttr = cell.value.attributes.getNamedItem(attributesName.toLowerCase());
                            newAttr.nodeValue = convertToString(attributesList);
                            cell.value.attributes.setNamedItem(newAttr);

                            let containe = document.getElementById("multiselect-tags-container");
                            let tagContainer = document.getElementById(`${name}-tag-container`);
                            containe.removeChild(tagContainer);

                            let checkBoxLocal = document.getElementById(`${name}-select-checkbox`);
                            checkBoxLocal.checked = false;
                        });
                    }
                }
                else {
                    let attributesList = parseAttribute(cell);

                    attributesList = attributesList.filter(x => x.toUpperCase() != name.toUpperCase());

                    let newAttr = cell.value.attributes.getNamedItem(attributesName.toLowerCase());
                    newAttr.nodeValue = convertToString(attributesList);
                    cell.value.attributes.setNamedItem(newAttr);

                    let containe = document.getElementById("multiselect-tags-container");
                    let tagContainer = document.getElementById(`${name}-tag-container`);
                    containe.removeChild(tagContainer);
                }
            });
        }
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
                getCommonView(cell);
            }
            else {
                div.innerHTML = '<h2>' + (cell.value || '') + '</h2>';

                // Show wizzard if cell.value.attributes is empty
                let checkboxTemplates = attributes.map(x => {
                    let name = x.toUpperCase();
                    return getCheckBoxTemplate(name, defaultValues.includes(name));
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
                                    nodeNames = [...nodeNames, nodeValue];
                                }
                            }
                        }

                        for (let item of notAtAttributes) {
                            let newAttr = document.createAttribute(item);
                            newAttr.textContent = numberInput.includes(item) ? 0 : item;
                            cell.value.attributes.setNamedItem(newAttr);
                        }

                        let newAttr = document.createAttribute(attributesName);
                        newAttr.textContent = convertToString(nodeNames);
                        cell.value.attributes.setNamedItem(newAttr);

                        getCommonView(cell);
                    });
                }
            }
        }
    };

    /**
     * Creates the textfield for the given property.
     */
    const createTextField = (graph, form, cell, attributesName) => {
        var input = form.addText(attributesName.nodeName + ':', attributesName.nodeValue);

        var applyHandler = function () {
            var newValue = input.value || '';
            var oldValue = cell.getAttribute(attributesName.nodeName, '');

            if (newValue != oldValue) {
                graph.getModel().beginUpdate();

                try {
                    var edit = new mxCellAttributeChange(
                        cell, attributesName.nodeName,
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