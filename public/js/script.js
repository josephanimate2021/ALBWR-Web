let fileChunks = [];
let exclusionOptions;
let fileName = ''; // Variable to store the name of the original file
const totalChunks = 100; // Variable to store the number of chunks

// shows an element to the uuser depending on whatever or not the user uploaded the file.
if (localStorage.uploadedFileId) loadSettings(document.getElementById('version').value, s => {
    const elem = document.getElementById('step02');
    elem.addEventListener("submit", randomizeGame);
    elem.style.display = 'block';
    appendSettings(s);
})
else document.getElementById(`step01`).style.display = 'block';

// Randomizes ALBW
function randomizeGame(evt) {
    evt.submitter.textContent = "Randomizing Game...";
    evt.submitter.setAttribute("disabled", "");
    const formData = new FormData(evt.currentTarget);
    const params = new URLSearchParams();
    
    for (const [key, value] of formData.entries()) params.append(key, value);
    fetch(`/randomize?${params.toString()}`, {
        method: "POST"
    }).then(res => res.json()).then(d => {

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

// loads randomizer settings
function loadSettings(id, callback) {
    fetch(`/settings?v=${id}`).then(res => res.json()).then(callback);
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

// checks the select element to ensure that options the user added are not overlapping with each other to prevent breaking the randomizer
function check4SameExcludeOptions(o) {
    const dom = [];
    for (const tag of document.getElementsByTagName('select')) {
        if (!tag.name.startsWith("settings[exclu")) continue;
        dom.push(tag);
    }
    console.log(dom)
}

// loads randomizer settings based off of a user's selected preset.
function randomizerSettings(d) {
    document.getElementById('randoSettings').innerHTML = '';
    const booleans = [true, false];
    for (const setting in d.settings) {
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
            if (info.comment) html += `<p>${info.comment}</p>`;
            function createSelectBox(n, elemId, val) {
                let select = ''
                const name = `settings[${setting}]${!noSetting2 ? `[${setting2}]` : ''}${n && typeof n == "number" ? `[${n - 1}]` : ''}`;
                if (info.rangeNumOptionsTo) select += `<input type="button" value="Generate Random Number" onclick="genRandomNumber('${
                    elemId ? 'id' : 'name'
                }', '${elemId ? `${elemId}.${n - 1}` : name}', '${info.rangeNumOptionsTo}')"/><input type="number" name="${name}" min="0" value="${info.defaultValue}" max="${info.rangeNumOptionsTo}"/>`;
                else {
                    select += `<select${setting2 == "exclude" || setting2 == "exclusions" ? ' onchange="excludeOptionSelected(this)"' : ''} name="settings[${setting}]${
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
            if (!info.userCanAddNewLines) html += createSelectBox() + '<hr>';
            else {
                let n = 1;
                const optionId = `myOptions.${setting}${!noSetting2 ? `.${setting2}` : ''}`;
                html += `<div id="${optionId}">${
                    (() => {
                        let html = '';
                        if (info.defaultValue) {
                            function append(j) {
                                for (var I = 0; I < j.length; I++) html += createSelectBox(I + 1, optionId, j[I]);
                            }
                            switch (typeof info.defaultValue) {
                                case "object": {
                                    if (Array.isArray(info.defaultValue)) append(info.defaultValue);
                                    else {
                                        function c(k) {
                                            for (const i in k) {
                                                if (Array.isArray(k[i])) append(k[i])
                                                else c(k[i]);
                                            }
                                        }
                                        c(info.defaultValue);
                                    }
                                }
                            }
                        }
                        return html;
                    })()
                }</div><hr>`
                const newOptionBtn = document.createElement('input');
                newOptionBtn.type = "button";
                newOptionBtn.value = 'Add New Option';
                newOptionBtn.style.float = "left";
                newOptionBtn.addEventListener("click", function(e) {
                    document.getElementById(optionId).insertAdjacentHTML('beforeend', createSelectBox(n++, optionId));
                    check4SameExcludeOptions(info.allOptions);
                });
                document.getElementById('randoSettings').appendChild(newOptionBtn);
                const removeOptionBtn = document.createElement('input');
                removeOptionBtn.type = "button";
                removeOptionBtn.value = 'Remove Option';
                removeOptionBtn.style.float = "right";
                removeOptionBtn.addEventListener("click", function() {
                    const elem = document.getElementById(optionId + `.${(n--) - 2}`);
                    const elem2 = elem.nextSibling;
                    if (elem && elem2) {
                        elem2.remove();
                        elem.remove();
                    }
                });
                document.getElementById('randoSettings').appendChild(removeOptionBtn);
            }
        }
        document.getElementById('randoSettings').insertAdjacentHTML('beforeend', html)
    }
}

// converts the JSON contents from settings to HTML
function appendSettings(s) {
    // Loads the presets
    function listener(evt) {
        randomizerSettings(s[evt.target.value])
    }
    document.getElementById('presets').style.display = 'none';
    document.getElementById('presetsSelection').innerHTML = '';
    document.getElementById('presetsSelection').removeEventListener("change", listener);
    document.getElementById('presetsSelection').addEventListener("change", listener);
    for (var i = 0; i < s.length; i++) {
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
async function uploadChunks() {
    console.log('Uploading chunks...');

    const id = (Math.random()).toString().substring(2);
    const ext = fileName.substring(fileName.lastIndexOf("."));

    // Create an array to hold all the upload promises
    const uploadPromises = [];

    for (let i = 0; i < totalChunks; i++) {
        const formData = new FormData();
        formData.append('file', fileChunks[i], `${i+1}-.-.`+id+ext);
        formData.append('filename',id+ext);
        formData.append('totalChunks', totalChunks);
        formData.append('chunkNumber', i + 1);

        // Send the chunk upload request asynchronously and store the promise
        const uploadPromise = uploadChunk(formData,i+1);

        uploadPromise.then(() => {
            var percentage = ((i + 1) / totalChunks) * 101;
            if(percentage===101){
                percentage=100;
            }
            setBar(percentage); // Call setBar function with the percentage
        });

        uploadPromises.push(uploadPromise);
    }

    // Wait for all upload promises to resolve
    await Promise.all(uploadPromises);
    console.log('All chunks uploaded successfully.');

    fetch(`/combine?filename=${encodeURIComponent(id+ext)}`)
        .then(response => {
            if (!response.ok) return handleError();
            return response.text(); // The response from server(in texts)
        })
        .then(data => {
            // The data from the server
            console.log(`The final response from server: ${data}`);
            localStorage.setItem("uploadedFileId", id);
            setBar(101);
        })
        .catch(error => {
            // Display errors when failed to get response from the server
            handleError('Fetch error:', error);
        });

    
}

// Uploads a single file chunk to the server using the provided form data and progress of the file upload.
async function uploadChunk(formData,progress) {
    try {
        const response = await fetch('/documents', {
            method: 'POST',
            body: formData
        });
        const result = await response.text();
        console.log(`Client Response: The file ${progress} sent to server!`);
        console.log('Server response:', result); // Log the response from the server
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
