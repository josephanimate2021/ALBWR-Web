let fileChunks = [];
let exclusionOptions;
let fileName = ''; // Variable to store the name of the original file
const totalChunks = 100; // Variable to store the number of chunks
let presets; // variable to store all of the presets

// shows an element to the user depending on whatever or not the user uploaded the file.
if (new URLSearchParams(window.location.search).get("fileUploaded")) loadSettings(document.getElementById('version').value, s => {
    window.addEventListener("load", e => { // handler for a function where a user is warned about progress on a webpage.
        window.addEventListener("beforeunload", function (e) {
            const confirmationMessage = 'It looks like you have been editing something. If you leave before saving, your changes will be lost.';
            const stuff = (e || window.event);
            stuff.preventDefault();
            stuff.returnValue = confirmationMessage;
            return confirmationMessage;
        });
    })
    const elem = document.getElementById('step02');
    elem.addEventListener("submit", randomizeGame);
    elem.style.display = 'block';
    appendSettings(s);
})
else document.getElementById(`step01`).style.display = 'block';

// Randomizes ALBW
function randomizeGame(evt, deletePresetAfterRandomization = true) {
    document.getElementById('logo').style.display = 'none';
    document.getElementById('options').style.display = 'none';
    evt.submitter.textContent = "Randomizing Game...";
    evt.submitter.setAttribute("disabled", "");
    document.getElementById('randoSettings').style.display = 'none';
    const output = document.getElementById('randoOutput');
    output.style.display = 'block';
    document.getElementById('presets').style.display = 'none';
    document.getElementById('randoVer').style.display = 'none';
    const term = new Terminal({
        convertEol: true,
        rows: 30,
    });
    const fitAddon = new FitAddon.FitAddon();
    term.loadAddon(fitAddon);
    term.open(output);
    fitAddon.fit();
    term.write('Running Randomizer...')
    const formData = new FormData(evt.currentTarget);
    const params = new URLSearchParams();
    
    for (const [key, value] of formData.entries()) params.append(key, value);
    fetch(`/randomizer/${(Math.random()).toString().substring(2)}?${params.toString()}`, {
        method: "POST"
    }).then(res => res.json()).then(d => {
        if (d.isRandomizing) (async () => {
            async function c() {
                const res = await fetch(`/randomizationStatus`);
                const status = await res.text();
                const doneText = "Press Enter to continue...";
                term.clear();
                term.write(status.split(doneText).join(''));
                if (!status.includes(doneText)) await c();
                else {
                    const back2randobtn = document.createElement('button');
                    back2randobtn.textContent = "<- Back To The Randomizer";
                    back2randobtn.addEventListener("click", () => {
                        evt.submitter.textContent = "Randomize Game";
                        evt.submitter.removeAttribute("disabled");
                        output.innerHTML = '';
                        output.style.display = 'none';
                        document.getElementById('presets').style.display = 'block';
                        document.getElementById('randoVer').style.display = 'block';
                        document.getElementById('randoSettings').style.display = 'block';
                        document.getElementById('randomizedGameDownload').remove();
                        document.getElementById('options').style.display = 'block';
                        document.getElementById('logo').style.display = 'none';
                    });
                    back2randobtn.className = "greenBtn";
                    function handleError(e) {
                        evt.submitter.textContent = "Game Randomization Failed";
                        term.write(e);
                        output.appendChild(back2randobtn);
                    }
                    try {
                        term.write('\r\nRetrieving Your Randomized Game...\r\n');
                        const res = await fetch(`/genZipFromRandomizedGame?${new URLSearchParams(d.data).toString()}&deletePreset=${deletePresetAfterRandomization}`, {
                            method: "POST"
                        });
                        if (res.ok) {
                            const blob = await res.blob();
                            if (blob) {
                                evt.submitter.textContent = "Game Randomization Successful";
                                const buttonName = "Download Your Randomized Game"
                                term.write(`Your randomized game was retrieved successfully!\r\nTo download it, click on the "${buttonName}" button below.`);
                                output.insertAdjacentHTML('afterend', `<a class="greenBtn" id="randomizedGameDownload" href="${
                                    URL.createObjectURL(blob)
                                }" download="albw-randomized.zip">${buttonName} -></a>`);
                                output.appendChild(back2randobtn);
                            } else handleError("An unknown error occured while retrieving your game's ZIP file.")
                        } else handleError(`Could not get your randomized game due to an error:\r\n${await res.text()}.\r\nPlease try randomizing your game again.`);
                    } catch (e) {
                        handleError(e.toString());
                    }
                }
            }
            await c();
        })()
    })
}

// handles an error
function handleError(t = 'Upload failed! Please try again.', e) {
    const progressBar = document.getElementById('progressBar');
    const progressBarInner = document.getElementById('progressBarInner');

    progressBar.style.display = 'none';
    progressBar.classList.remove('progressBarClass');
    progressBar.innerHTML = `<p> ${t} ${e ? e.toString() : ''} </p>`;
    progressBarInner.style.width = `0%`;

    document.getElementById('uploadButtonChunk').removeAttribute("disabled")
    document.getElementById('uploadButtonChunk').innerHTMML = 'Upload';
    console.error(t, e)
}

// when a version selector gets created, this function may sometimes be called.
function versionsChecker(obj) {
    document.getElementById('link2cli').setAttribute("data-execv", obj.value);
    const array = [];
    for (const e of obj.children) {
        e.removeAttribute('selected')
        if (e.value != obj.value) continue;
        e.setAttribute('selected', '')
        for (let i = 0; i < presets.length; i++) {
            const preset = presets[i];
            const infoPlaceholder = {
                presetName: preset.presetName + ` Version ${e.value}`,
                notes: preset.notes || [],
                settings: {}
            }
            if (e.getAttribute('data-versionoptions')) {
                array[i] = infoPlaceholder;
                const info = JSON.parse(e.getAttribute('data-versionoptions'));
                for (const settingCat in preset.settings) array[i].settings[settingCat] = Object.assign({}, preset.settings[settingCat]);
                for (const settingCat in info) {
                    if (
                        !array[i].settings[settingCat] || typeof array[i].settings[settingCat] == "object"
                    ) array[i].settings[settingCat] = Object.assign(array[i].settings[settingCat] || {}, info[settingCat]);
                }
                for (const settingCat in preset.settings) {
                    for (const d in preset.settings[settingCat]) if (
                        typeof array[i].settings[settingCat][d] == "object"
                    ) Object.assign(array[i].settings[settingCat][d], preset.settings[settingCat][d]);
                }
            } 
            if (e.getAttribute('data-versionoptionstoremove')) {
                array[i] = array[i] || infoPlaceholder;
                const info = JSON.parse(e.getAttribute('data-versionoptionstoremove'));
                for (const settingCat in preset.settings) array[i].settings[settingCat] = array[i].settings[settingCat] || Object.assign({}, preset.settings[settingCat])
                for (const option of info) {
                    const [key, value] = option.split(".");
                    if (key && value) {
                        if (array[i].settings[key][value]) delete array[i].settings[key][value]
                    } else if (key) {
                        if (array[i].settings[key]) delete array[i].settings[key]
                    }
                }
            }
        }
    }
    console.log(array);
    appendSettings(array.length == 0 ? presets : array);
}

// loads randomizer settings
function loadSettings(id, callback) {
    const cliLink = document.getElementById('link2cli');
    cliLink.style.display = 'block';
    cliLink.setAttribute("data-v", id);
    document.getElementById('noVerboseDiv').style.display = 'none';
    const settings = document.getElementById('randoSettings');
    settings.innerHTML = '';
    let typeInTitle = '', type;
    function versionsCreator(d, v) { // create a div element containing the versions selector
        if (!document.getElementById('versionSelect')) {
            const div = document.createElement('div');
            presets = v;
            div.insertAdjacentHTML("beforeend", `<h3>${typeInTitle} Executable Version</h3>`);
            div.insertAdjacentHTML("beforeend", `<p>The version that will be used to randomize your game with the ${type} randomizer.</p>`);
            div.id = "versionSelect";
            div.insertAdjacentHTML("beforeend", `<select name="execVersion" onchange="versionsChecker(this)">${(() => {
                let html = ''
                const keys = Object.keys(d);
                for (let i = 0; i < keys.length; i++) { // adds in the version options
                    const key = keys[i];
                    if (i == 0) cliLink.setAttribute("data-execv", key);
                    html += `<option value="${key}" title="${d[key].desc || ''}${d[key].warn ? `\r\nWARNING: ${d[key].warn}` : ''}"${d[key].addOptions ? ` data-versionoptions='${JSON.stringify(d[key].addOptions)}'` : ''}${d[key].removeOptions ? ` data-versionoptionstoremove='${JSON.stringify(d[key].removeOptions)}'` : ''}>${d[key].versionName}</option>`;
                }
                return html;
            })()}`);
            div.insertAdjacentHTML("beforeend", `</select><hr>`);
            settings.appendChild(div);
        }
        callback(v);
    }
    fetch(`/settings/stable/${id}`).then(res => res.json()).then(d => {
        switch (id) { // loads executable versions for specific randomizer versions
            case "z17v3": if (!typeInTitle) typeInTitle = 'Z17 Randomizer v3'; 
            case "z17r": if (!typeInTitle) typeInTitle = 'Z17 Randomizer Beta'; 
            case "z17-rando": if (!typeInTitle) typeInTitle = 'Z17 Randomizer (Old)'; 
            case "z17-local": {
                if (!typeInTitle) typeInTitle = 'Z17 Randomizer (Older)'; 
                if (!type) type = 'z17'; 
                if (id == "z17-local") cliLink.style.display = 'none';
            } case "albw": {
                if (!typeInTitle) typeInTitle = 'ALBW Randomizer';
                if (!type) type = 'albw';
                if (type != "z17") {
                    document.getElementById('noVerboseDiv').style.display = 'block';
                    cliLink.style.display = 'none';
                }
                fetch(`/execVersions/stable/${id}`).then(res => res.json()).then(v => versionsCreator(v, d));
                break;
            } default: callback(d)
        }
    });
}

// creates one uppercase letter in the beginning of the text
function captializeBegLetterInWord(word) {
    return word.charAt(0).toUpperCase() + word.substring(1);
}

// converts a string to a boolean
const stringToBoolean = (stringValue) => {
    if (typeof stringValue == "boolean") return stringValue;
    else switch(stringValue?.toLowerCase()?.trim()) {
        case "true": 
        case "yes": 
        case "1": 
          return true;

        case "false": 
        case "no": 
        case "0": 
        case null: 
        case undefined:
          return false;

        default: 
          return JSON.parse(stringValue);
    }
}

// Appends the options to a select element without the use of an array
function appendOptionsWithoutArray(object, prevSetting = '', val) {
    console.log(val)
    let option = '';
    for (const setting in object) {
        if (typeof object[setting] == "object") {
            if (Array.isArray(object[setting])) option += object[setting].map(v => `<option value="${prevSetting}${setting}->${v}"${
                v == val ? ' selected' : ''
            }>${setting} ${v}</option>`).join('')
            else if (!object[setting].comment && !object[setting].isChoice) option += `<optgroup label="${setting}">${appendOptionsWithoutArray(object[setting], (prevSetting ? (prevSetting + '@' + setting) : setting) + '@', val)}</optgroup>`
            else option += `<option value="${setting}"${object[setting].comment ? ` title="${object[setting].comment}"` : ''}${
                setting == val ? ` selected` : ''
            }>${setting}</option>`;
        }
    }
    return option;
}

// generates a random number for a select box based off of it's id or name
function genRandomNumber(type, attrVal, max) {
    const num = Math.floor(Math.random() * (Number(max) + 1));
    switch (type) {
        case "id": {
            document.getElementById(attrVal).value = num;
            break;
        } case "name": {
            for (const tag of document.getElementsByTagName('input')) if (tag.name == attrVal) tag.value = num
            break;
        }
    }
}

// digs thorugh some JSON code to find the user's request info from a value
function findJsonInfoFrom(json, val, isAttr = false) {
    if (json[val]) return json[val]
    else {
        let info;
        for (const key in json) {
            if (isAttr) {
                if (json[key].hasOwnProperty(val)) info = json[key][val];
                else if (key == val) info = json[key];
            } else if (json[key] == val) info = json[key];
            else info = findJsonInfoFrom(json[key], val, isAttr)
        }
        return info
    }
}

// opens a collapsible
function toggleCollapsible(coll) {
    coll.classList.toggle("active");
    const content = coll.nextElementSibling;
    if (content.style.display === "block") content.style.display = "none";
    else content.style.display = "block";
}

// loads randomizer settings based off of a user's selected preset.
function randomizerSettings(d, clearSettingsHTML = false) {
    if (clearSettingsHTML) document.getElementById('randoSettings').innerHTML = document.getElementById('versionSelect')?.outerHTML || '';
    const booleans = [true, false];
    for (const setting in d.settings) {
        if (typeof d.settings[setting] != "object") continue;
        let html = '';
        switch (setting) {
            case "exclude": {
                html += `<h3>${setting.split("_").map(captializeBegLetterInWord).join(" ")}</h3>`;
                appendRandoSettings(setting, d.settings, true);
                break;
            } default: {
                html += `<h3>${captializeBegLetterInWord(setting)}</h3>${d.settings[setting].comment ? `<p>${d.settings[setting].comment}</p>` : ''}<hr>`;
                for (const setting2 in d.settings[setting]) if (setting2 != "comment") appendRandoSettings(setting2, d.settings[setting]);
                break;
            }
        }
        function appendRandoSettings(setting2, json, noSetting2 = false) {
            const info = json[setting2];
            if (setting2 != setting) html += `<h4>${setting2.split("_").map(captializeBegLetterInWord).join(" ")}</h4>`;
            if (info.comment && !noSetting2) html += `<p>${info.comment}</p>`;
            function createSelectBox(n, elemId, val) {
                let select = ''
                const name = `settings[${setting}]${!noSetting2 ? `[${setting2}]` : ''}${n && typeof n == "number" ? `[${n - 1}]` : ''}`;
                if (info.rangeNumOptionsTo) select += `<input type="button" value="Generate Random Number" onclick="genRandomNumber('${
                    elemId ? 'id' : 'name'
                }', '${elemId ? `${elemId}.${n - 1}` : name}', '${info.rangeNumOptionsTo}')"/><input type="number" name="${name}" min="0" value="${info.defaultValue}" max="${info.rangeNumOptionsTo}"/>`;
                else {
                    select += `<select name="settings[${setting}]${
                        !noSetting2 ? `[${setting2}]` : ''
                    }${
                        n && typeof n == "number" ? `[${n - 1}]` : ''
                    }"${elemId && n ? ` id="${elemId}.${n - 1}"` : ''}>`;
                    if (info.useBooleanOptions) select += booleans.map(boolean => `<option value="${boolean}"${
                        boolean == stringToBoolean(info.defaultValue) ? ' selected' : ''
                    }>${boolean}</option>`).join("");
                    else if (info.allOptions) {
                        if (Array.isArray(info.allOptions)) select += info.allOptions.map(option => `<option value="${option}"${
                            option == info.defaultValue ? ' selected' : ''
                        }>${option}</option>`).join("");
                        else select += appendOptionsWithoutArray(info.allOptions, '', val);
                    }
                    select += `</select>`;
                }
                select += '<br>';
                return select;
            }
            function createCheckmarks(info2, p) {
                let html = '';
                for (const l in info2) {
                    if (typeof info2[l] == "object") {
                        html += `<input onclick="toggleCollapsible(this)" class="collapsible" type="button" value="${l}">`
                        html += `<div class="collapsibleContent">${createCheckmarks(info2[l], `${p || ''}.${l}`)}</div>`;
                    } else if (typeof info.defaultValue == "object") {
                        if (Array.isArray(info.defaultValue)) {
                            const defaultValue = info.defaultValue.find(i => i == l);
                            html += `<input${defaultValue ? ' checked=""' : ''} id="${l.split(' ').join('').split("'").join('')}" type="checkbox" name="settings[${setting}]${
                                !noSetting2 ? `[${setting2}]` : ''
                            }[${l}]"/>`
                            html += `<label for="${l.split(' ').join('').split("'").join('')}">${l}</label><br><br>`;
                        } else {
                            const [_, cat1, cat2] = p.split(".")
                            const defaultValueProp = info.defaultValue[cat1];
                            const defaultValue = defaultValueProp ? defaultValueProp[cat2]?.find(i => i == l) : '';
                            const keys = Object.keys(info.allOptions[cat1][cat2]);
                            for (let i = 0; i < keys.length; i++) html += `<input${defaultValue ? ' checked=""' : ''} id="${keys[i].split(' ').join('').split("'").join('')}${i}" type="checkbox" name="settings[${setting}]${
                                !noSetting2 ? `[${setting2}]` : ''
                            }[${setting}.${cat1}][${cat2}][${i}][${keys[i]}]"/><label for="${keys[i].split(' ').join('').split("'").join('')}${i}">${keys[i]}</label><br><br>`;
                            break;
                        }
                    }
                }
                return html;
            }
            if (!info.useCheckmarks) html += createSelectBox() + '<hr>';
            else {
                if (info.comment) html += `<p>${info.comment}</p>`;
                html += createCheckmarks(info.allOptions) + '<hr>';
            }
        }
        document.getElementById('randoSettings').insertAdjacentHTML('beforeend', html)
    }
    document.getElementById('randoSettings').style.display = 'block';
}

// converts the JSON contents from settings to HTML
function appendSettings(s) {
    // Loads the presets
    function listener(evt) {
        randomizerSettings(s[evt.target.value], true)
    }
    document.getElementById('presets').style.display = 'none';
    document.getElementById('presetsSelection').innerHTML = '';
    document.getElementById('presetsSelection').removeEventListener("change", listener);
    document.getElementById('presetsSelection').addEventListener("change", listener);
    for (let i = 0; i < s.length; i++) {
        document.getElementById('presetsSelection').insertAdjacentHTML('afterbegin', `<option value="${i}">${s[i].presetName}</option>`);
        if (i == 0) listener({
            target: {
                value: i
            }
        });
    }
    // shows user presets after they have been appended
    document.getElementById('presets').style.display = 'block';
}

// The file input event handler
function handleFileSelect(event) {
    const file = event.target.files[0];
    const fileSize = file.size;

    fileChunks = [];
    fileName = file.name; // Store the name of the original file

    console.log(`File selected: ${fileName}`);
    console.log(`Total file size: ${fileSize} bytes`);
    console.log(`Number of chunks: ${totalChunks}`);

    const chunkSize = Math.ceil(fileSize / totalChunks);

    let start = 0;

    for (let i = 0; i < totalChunks; i++) {
        const chunk = file.slice(start, start + chunkSize);
        fileChunks.push(chunk);
        start += chunkSize;
    }
}

// Function to check if a file was uploaded
function isFileUploaded() {
    return fileInput.files.length == 1;
}

// Uploads the file chunks to the server
function uploadChunks() {
    console.log('Uploading chunks...');
    document.getElementById('logo').style.display = 'none';
    const socket = new WebSocket(`${window.location.protocol.startsWith("https") ? 'wss' : 'ws'}://${window.location.host}/uploadFile`);
    let start = 0;
    socket.addEventListener("message", result => {
        if (result.data == "ok") {
            if (start < totalChunks) {
                console.log('Server response:', result.data);
                socket.send(fileChunks[start]);
                start++;
                setBar(start);
            } else {
                console.log('All chunks uploaded successfully.');
                console.log(`The final response from server: ${result.data}`);
                setBar(101);
            }
        }
    })
}

// Uploads a single file chunk to the server using the provided form data and progress of the file upload.
async function uploadChunk(formData,socket) {
    try {
        socket.send(formData);
    } catch (error) {
        handleError('Error uploading file chunk:', error);
    }
}

// Detect if file was chosen and send to server, if no then show 'file was chosen'
document.getElementById('uploadButtonChunk').addEventListener('click', function(event) {
        // Check if a file was uploaded
    if (isFileUploaded()) {
        setBar(0);
        event.target.setAttribute("disabled", "");
        event.target.innerHTML = 'Uploading File...';
        uploadChunks();
    } else {
        // Do some other actions or show an error message
        handleError('No file was chosen!.');
    }

});

// When file is loaded then quickly save the changes
fileInput.addEventListener('change', handleFileSelect);
