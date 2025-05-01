// modules
import { WebContainer } from '@webcontainer/api';
import jQuery from 'jquery';
import { Terminal } from '@xterm/xterm';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { FitAddon } from '@xterm/addon-fit';
import JSZip from 'jszip';

// run the randomizer on form submit.
jQuery("#settings-form").submit(async e => {
    const versionDropdown = jQuery("#versionDropdown");
    jQuery("#versionDropdown").attr("disabled", "");
    jQuery("#presetDropdown").attr("disabled", "");
    const settingsForm = jQuery("#settings-form");
    settingsForm.hide();
    const settings = parseForm(settingsForm);
    console.log(settings)
    const versionVal = versionDropdown.val();
    jQuery("#statusText").text("Generating!");
    jQuery("#waiting-screen").show();
    const fitAddon = new FitAddon();
    const terminal = new Terminal();
    terminal.open(document.getElementById('resultField'));
    terminal.loadAddon(new WebLinksAddon());
    terminal.loadAddon(fitAddon);
    fitAddon.fit();
    window.addEventListener('resize', () => {
        fitAddon.fit();
    });
    const instance = await WebContainer.boot();
    const builds = await (await fetch(`/builds/versions.json`)).json();
    await instance.mount(builds[versionVal].directory);
    instance.fs.writeFile('./presets/form.json', JSON.stringify(settings));
    instance.fs.writeFile('./package.json', JSON.stringify({
        name: "z17-randomizer",
        version: versionVal.substring(1),
        description: "A Link Between Worlds Randomizer",
        type: "module",
        scripts: {
          randomize: "node randomize.js"
        }
    }))
    instance.fs.writeFile('./randomize.js', await (await fetch('/randomizerBackend.js')).text());
    terminal.write('Uploading The ALBW Rom To The Randomizer...\r\n')
    const reader = new FileReader();
    reader.onloadend = async function(e) {
        terminal.write('Successfully uploaded the ALBW rom! Running The Randomizer...\r\n');
        const arrayBuffer = e.target.result;
        const buffer = new Uint8Array(arrayBuffer);
        const buffer2 = new Uint8Array(await (await fetch(`/builds/${versionVal}/albw-randomizer`)).arrayBuffer());
        const config = JSON.parse(await instance.fs.readFile('./config.json', 'utf8'));
        instance.fs.writeFile(`./${config.rom}`, buffer);
        instance.fs.writeFile('./albw-randomizer', buffer2);
        executeRandomizer(terminal, instance, settings)
    };
    reader.readAsArrayBuffer(document.getElementById('rom').files[0]);
})

/**
 * Runs the generated randomizer file
 * @param {Terminal} terminal
 * @param {WebContainer} webcontainerInstance
 */
async function executeRandomizer(terminal, webcontainerInstance, settings, requiresInput = false) {
    const command = ['run', 'randomize'];
    if (settings.seed != undefined) command.push(settings.seed);
    const shellProcess = await webcontainerInstance.spawn('npm', command, {
        terminal: {
            cols: terminal.cols,
            rows: terminal.rows,
        },
    });

    shellProcess.output.pipeTo(
        new WritableStream({
            write(data) {
                terminal.write(data);
            },
        })
    );

    if (requiresInput) {
        const input = shellProcess.input.getWriter();
        terminal.onData((data) => {
            input.write(data);
        });
    }
}

/**
 * Converts form info into an actual JSON
 * @param {HTMLFormElement} f 
 * @returns {JSON} 
 */
function parseForm(f) {
    const json = Object.fromEntries(new URLSearchParams(f.serialize()));
    const newInfo = {};
    for (const i in json) {
        const parsedNumValue = parseInt(json[i]);
        const startVal = i.split("[")[0];
        if (i.endsWith("]") && i.startsWith(startVal + "[")) {
            const k = i.split("][").join(">").split("]").join(">").split("[").join(">").split(">");
            k.splice(k.length - 1, 1);
            k.splice(k.findIndex(i => i == startVal), 1);
            newInfo[startVal] ||= {};
            if (k.length > 1) {
                newInfo[startVal][k[0]] ||= {};
                function c(g = 1) {
                    const info = {};
                    info[k[g]] = g < k.length - 1 ? c(g + 1) : isNaN(parsedNumValue) ? parseBoolean(json[i]) : parsedNumValue;
                    return info;
                }
                Object.assign(newInfo[startVal][k[0]], c());
            } else newInfo[startVal][k[0]] = isNaN(parsedNumValue) ? parseBoolean(json[i]) : parsedNumValue;
        } else newInfo[i] = json[i]
    }
    return newInfo;
}

/**
 * Checks a given string for a boolean and then returns the value as a boolean if present.
 * @param {string} h 
 * @returns {boolean|string}
 */
function parseBoolean(h) {
    switch (h) {
        case 'true': return true;
        case 'false': return false;
        default: return h;
    }
}

/**
 * initializes the main page after load.
 */
function init() {
    randomBackgrounds();
    themeToggle();
    loadVersions('v0.4.1-beta-2025-03-26');
}

/**
 * Loads all existing builds and then selects a one that's supplied in the paramaters. 
 * If none are supplied, then the first build that pops up is selected by default.
 * @param {string} r 
 */
function loadVersions(r) {
    const presetDropdown = jQuery("#presetDropdown");
    presetDropdown.attr("disabled", "");
    presetDropdown.off("change");
    presetDropdown.html('<option>Loading Presets...</option>');
    const versionDropdown = jQuery("#versionDropdown");
    versionDropdown.off("change");
    versionDropdown.attr("disabled", "");
    !versionDropdown.html() ? versionDropdown.html(`<option>Loading Version ${r.substring(1).split('-').join(' ')}...</option>`) : ''
    jQuery("#statusText").html(`Getting Randomizer Settings From ${r.split('-').join(' ')}.<br>`)
    jQuery("#settings-form").hide().html('')
    jQuery("#waiting-screen").show();
    getBuilds().then(d => {
        let html = '';
        for (const eI in d) {
            const versionNum = eI.split("-")[0];
            html += `<option value="${eI}"${eI == r ? ' selected' : ''}>${versionNum}${
                eI.substring(versionNum.length).startsWith('-') ? ` -${eI.substring(versionNum.length).split("-").map(capitalizeWord).join(' ')}` : ''
            }</option>`;
            if (eI == r) {
                let html2 = '';
                for (let i = 0; i < d[eI].presets.length; i++) {
                    const v = d[eI].presets[i];
                    if (i == 0) {
                        loadPreset(v);
                        presetDropdown.on("change", e => {
                            loadPreset(JSON.parse(decodeURIComponent(jQuery(e.target).val())))
                        });
                    }
                    html2 += `<option value="${
                        encodeURIComponent(JSON.stringify(v))
                    }" title="${v.description || ''}">${v.presetName}</option>`;
                }
                presetDropdown.html(html2);
                presetDropdown.removeAttr("disabled");
            }
        }
        versionDropdown.on("change", d => loadVersions(jQuery(d.target).val()));
        versionDropdown.html(html);
    });
}

/**
 * Toggles a theme based off of user preferences.
 */
function themeToggle() {
    let darkMode = localStorage.getItem('darkMode');
    const darkModeToggle = document.querySelector('#theme-toggle');

    const enableDarkMode = () => {
        document.body.classList.add('darkMode');
        localStorage.setItem('darkMode', 'enabled');
    }
    const disableDarkMode = () => {
        document.body.classList.remove('darkMode');
        localStorage.setItem('darkMode', null);
    }

    // Defaults to using the user's theme preference, but will remember if they toggle it.
    if (darkMode === 'enabled' || (darkMode === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        enableDarkMode();
    }

    darkModeToggle.addEventListener('click', () => { // Toggles dark mode upon the click of the Theme 🗘 button.
        darkMode = localStorage.getItem('darkMode');
        if (darkMode !== 'enabled') {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    });
}

/**
 * Generates random backgrounds
 */
function randomBackgrounds() {
    let backgrounds = [
        'img/bg.png',
        'img/bg_flippers_dungeon.png',
        'img/bg_throne_room.png',
        'img/bg_ice.png',
        'img/bg_desert.png',
        'img/bg_lorule_sacred_realm.png'
    ];
    let index = Math.floor(Math.random() * backgrounds.length);
    let classToAdd = backgrounds[index];

    document.body.setAttribute("style", `background-image: url("${classToAdd}");`);
}

/**
 * Loads randomizer settings using the given preset data
 * @param {JSON} l
 */
function loadPreset(j) {
    const versionDropdown = document.getElementById('versionDropdown');
    versionDropdown.setAttribute("disabled", "");
    jQuery("#statusText").html(`The randomizer settings are loading...<br>`)
    jQuery("#settings-form").hide().html('')
    jQuery("#waiting-screen").show();
    const wordOptions = { // helper for some options
        logic_mode: ["Normal", "Hard", "Glitched", "Adv Glitched", "Hell", "No Logic"],
        lc_requirement: 7,
        ped_requirement: ["Vanilla", "Standard"],
        door_shuffle: ["Off", "Dungeon Entrances"],
        cracks: ["Closed", "Open"],
        cracksanity: ["Off", "Cross World Pairs", "Any World Pairs", "Mirrored Cross World Pairs", "Mirrored Any World Pairs"],
        keysy: ["Off", "Small Keysy", "Big Keysy", "All Keysy"],
        trials_door: ["Open From Inside Only", "One Trial Required", "Two Trials Required", "Three Trials Required", "All Trials Required", "Open From Both Sides"],
        weather_vanes: ["Standard", "Shuffled", "Convenient", "Hyrule", "Lorule", "All"],
        maiamai_limit: 100,
        nice_items: ["Vanilla", "Shuffled", "Off"],
        treacherous_tower_floors: 66,
        hint_ghost_price: 9999,
        hyrule_castle_setting: ["Early Lorule Castle", "Closed"]
    };
    wordOptions.exclusions = wordOptions.user_exclusions = j.exclusionOptions;
    for (const i in wordOptions.exclusions) {
        for (const c in wordOptions.exclusions[i]) wordOptions.exclusions[i][c] = Object.keys(wordOptions.exclusions[i][c]);
    }
    function editableSettings(k) { // finalize the loop
        const info = {};
        for (const i in k) {
            if (typeof k[i] != "object" || Array.isArray(k[i])) {
                info[i] = {
                    defaultValue: k[i]
                }
                if (typeof k[i] != "number") info[i][(() => {
                    switch (typeof k[i]) {
                        case "object": return "useCheckmarks";
                        default: return "useOptions"
                    }
                })()] = true;
                if (wordOptions[i]) info[i][(() => {
                    switch (typeof k[i]) {
                        case "number": return 'maxNum';
                        default: return "allOptions"
                    }
                })()] = wordOptions[i];
            } else info[i] = editableSettings(k[i]);
        }
        return info;
    }
    let html = `<div class="section">
        <label>Seed Info</label>
        <div class="setting" title="Specify a number to use for the randomizer seed.">
            <label class="pointer">
                <input name="seed" type="number" value="${j.seed != undefined ? j.seed : ""}">
                Seed Number
            </label>
        </div>
        ${j.hash ? `<div class="setting" title="A part of the randomizer that can be used for game generation. this can become relavent in v0.4 and later versions.">
            <label class="pointer">
                <input name="hash" type="text" value="${j.hash != undefined ? j.hash : ""}" readonly>
                Hash
            </label>
        </div>` : ''}
        <div class="setting" title="A version of the randomizer that will be used for checking to see whatever or not the preset version matches the randomizer version. This is heavily relied on in v0.4 and later versions.">
            <label class="pointer">
                <input name="version" type="text" value="${j.version}" readonly>
                Version
            </label>
        </div>
    </div>`;
    let commentCount = 0;
    const stuff = editableSettings(j.settings);
    for (const i in j.settings) {
        if (typeof j.settings[i] == "object" && !Array.isArray(j.settings[i])) {
            html += `<div class="section"><label>${i.split("_").map(capitalizeWord).join('')}</label>`;
            for (const g in j.settings[i]) appendSetting(stuff[i][g], i, g)
            html += '</div>'
        } else {
            appendSetting(stuff[i], i);
        }
    }
    function appendSetting(setting, i, g) {
        const name = `settings[${i}]${g ? `[${g}]` : ''}`;
        const options = setting.allOptions || [true, false];
        html += `<div class="setting" title='${j.comments ? j.comments[commentCount] ? j.comments[commentCount].split("'").join('') : '' : ''}'>
            <label>
                ${setting.useOptions ? `<select name="${name}">${
                    options.map(v => {
                        const val = typeof v == "string" ? v.split(" ").join('') : v;
                        return `<option value="${val}"${val == setting.defaultValue ? ' selected' : ''}>${v}</option>`
                    }).join('')
                }</select>` : setting.maxNum ? `<div class="range_val">
                    <input id="${i}_${g}_num" type="number" value="${setting.defaultValue}" oninput="document.getElementById('${i}_${g}_rang').value = document.getElementById('${i}_${g}_num').value;" min="0" max="${setting.maxNum}" name="${name}"/>
                    <input id="${i}_${g}_rang" type="range" value="${setting.defaultValue}" oninput="document.getElementById('${i}_${g}_num').value = document.getElementById('${i}_${g}_rang').value;" min="0" max="${setting.maxNum}" style="width: 70px">
                    <input type="button" onclick="(() => {
                        const num = Math.floor(Math.random() * ${parseInt(setting.maxNum)});
                        for (const f of ['_num', '_rang']) document.getElementById('${i}_${g}' + f).value = num;
                    })();" value="Generate Random Number"/>
                </div>` : setting.useCheckmarks ? (() => {
                    function c(m) {
                        let html = '';
                        for (const j in m) {
                            if (typeof m[j] == "object") {
                                if (
                                    !Array.isArray(m[j])
                                ) html += `<input class="accordion" type="button" value="${j}" onclick="(() => {
                                    const panel = document.getElementById('${j}');
                                    const currentClasses = panel.previousSibling.classList;
                                    currentClasses[currentClasses[currentClasses.length - 1] != "active" ? 'add' : 'remove']("active");
                                    panel.style.display == "block" ? panel.style.display = "none" : panel.style.display = "block";
                                })();"><div class="panel" id="${j}">${c(m[j])}</div>`;
                                else html += `<div class="section">${(() => {
                                    let html = `<label>${j}</label>`;
                                    for (let l = 0; l < m[j].length; l++) {
                                        html += `<div class="setting" title="You may exclude the ${
                                            m[j][l].split(j).map(f => f.startsWith(' ') ? f.substring(1) : f).join('')
                                        } check located in ${j} if you don't want any important items located in the check.">
                                            <label>
                                                <input${
                                                    setting.defaultValue.find(i => i == m[j][l]) ? ' checked' : ''
                                                } type="checkbox" name="${name}[${l}][${m[j][l]}]">
                                                ${m[j][l]}
                                            </label>
                                        </div>`
                                    }
                                    return html;
                                })()}</div>`
                            }
                        }
                        return html;
                    }
                    return c(setting.allOptions)
                })() : `<input type="hidden" name="${name}" value="${setting.defaultValue}"/>`}
                ${(g || i).split("_").map(capitalizeWord).join(" ")}
            </label>
        </div>`;
        if (j.comments) commentCount++
    }
    jQuery("#waiting-screen").hide();
    jQuery("#settings-form").html(html + `<div class="section"><label>ROM</label>
        <div class="setting" title="&NewLine;You must provide your own copy of &quot;The Legend of Zelda: A Link Between Worlds&quot; to use the randomizer.&NewLine;&NewLine;The ROM must be:&NewLine;1. The US (North American) version of the game&NewLine;2. Decrypted&NewLine;3. In a .3ds format (converters exist to turn .cia files into .3ds)&NewLine;">
            <label><input id="rom" accept=".3ds" name="rom" style="width: 50%" type="file" required>Original ROM</label>
        </div>
    </div>
    <span>
        <input type="submit" value="Generate Seed">
    </span>`).show();
    versionDropdown.removeAttribute("disabled")
}

/**
 * Gives a word a captial letter at the beginning.
 * @param {string} word 
 * @returns {string}
 */
function capitalizeWord(word) {
    if (!word) return;
    const rest = word.substring(1);
    return word.split(rest)[0].toUpperCase() + rest;
}

// Wait for everything to be loaded, and then bootstrap the app
window.addEventListener("load", function bootstrap() {
    init();
});

async function getBuilds() {
    const buildFiles = await (await fetch('/builds/versions.json')).json();
    const info = {};
    for (const i in buildFiles) {
        info[i] = {};
        if (buildFiles[i].directory.presets) {
            info[i].presets = [];
            for (const k in buildFiles[i].directory.presets) {
                for (const file in buildFiles[i].directory.presets[k]) {
                    if (!file.endsWith(".json")) continue;
                    const comments = [];
                    let fileContents = buildFiles[i].directory.presets[k][file].file.contents
                    let pt = fileContents.indexOf("// ");
                    while (pt > -1) { // push and remove comments
                        const line = fileContents.substring(pt).split("\r").join('').split("\n")[0]
                        comments.push(line.substring(3));
                        fileContents = fileContents.split(line).join("")
                        pt = fileContents.indexOf("// ", pt + 1)
                    }
                    const info2 = JSON.parse(fileContents);
                    if (!info2.settings) {
                        info2.settings = Object.assign({}, info2)
                        for (const i in info2) {
                            if (info2.settings[i]) delete info2[i];
                        }
                    }
                    info2.comments ||= comments;
                    if (buildFiles[i].directory['excludableChecksList.json']) info2.exclusionOptions = JSON.parse(
                        buildFiles[i].directory['excludableChecksList.json'].file.contents
                    ).layout
                    if (!info2.version) {
                        const versionNum = i.split("-")[0];
                        Object.assign(info2, {
                            presetName: file.substring(0, file.lastIndexOf(".")).split("_").map(capitalizeWord).join(' '),
                            version: `${versionNum}${
                                i.substring(versionNum.length).startsWith('-') ? ` -${
                                    i.substring(versionNum.length).split("-").map(capitalizeWord).join(' ')
                                }` : ''
                            }`
                        });
                    }
                    info[i].presets.unshift(info2);
                }
            }
        }
    }
    return info;
}
