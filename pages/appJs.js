/**
 * initializes the main page after load.
 */
function init() {
    randomBackgrounds();
    themeToggle();
    loadVersions('v0.3.1');
}

/**
 * Loads all existing builds and then selects a one that's supplied in the paramaters. 
 * If none are supplied, then the first build that pops up is selected by default.
 * @param {string} r 
 */
function loadVersions(r) {
    const presetDropdown = $("#presetDropdown");
    presetDropdown.attr("disabled", "");
    presetDropdown.off("change");
    presetDropdown.html('<option>Loading Presets...</option>');
    const versionDropdown = $("#versionDropdown");
    versionDropdown.attr("disabled", "");
    !versionDropdown.html() ? versionDropdown.html(`<option>Loading Version ${r.substring(1).split('-').join(' ')}...</option>`) : ''
    $("#statusText").html(`Getting Randomizer Settings From ${r.split('-').join(' ')}.<br>`)
    $("#settings-form").hide().html('')
    $("#waiting-screen").show();
    jQuery.post('/builds', d => {
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
                            loadPreset(JSON.parse(decodeURIComponent($(e.target).val())))
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
        versionDropdown.html(html);
    })
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
    $("#statusText").html(`The randomizer settings are loading...<br>`)
    $("#settings-form").hide().html('')
    $("#waiting-screen").show();
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
                    <input id="${i}_${g}_num" type="number" value="${setting.defaultValue}" oninput="valChange('${i}_${g}_rang', '${i}_${g}_num')" min="0" max="${setting.maxNum}" name="${name}"/>
                    <input id="${i}_${g}_rang" type="range" value="${setting.defaultValue}" oninput="valChange('${i}_${g}_num', '${i}_${g}_rang')" min="0" max="${setting.maxNum}" style="width: 70px">
                    <input type="button" onclick="randomNumber(${parseInt(setting.maxNum)}, '${i}_${g}')" value="Generate Random Number"/>
                </div>` : setting.useCheckmarks ? (() => {
                    function c(m) {
                        let html = '';
                        for (const j in m) {
                            if (typeof m[j] == "object") {
                                if (
                                    !Array.isArray(m[j])
                                ) html += `<input class="accordion" type="button" value="${j}" onclick="showAccordionItem('${j}')"><div class="panel" id="${j}">${c(m[j])}</div>`;
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
    $("#waiting-screen").hide();
    $("#settings-form").html(html + `<div class="section"><label>ROM</label>
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
 * Reveals an item in the given accordion
 * @param {string} elemId 
 */
function showAccordionItem(elemId) {
    const panel = document.getElementById(elemId);
    const currentClasses = panel.previousSibling.classList;
    currentClasses[currentClasses[currentClasses.length - 1] != "active" ? 'add' : 'remove']("active");
    panel.style.display == "block" ? panel.style.display = "none" : panel.style.display = "block";
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

/**
 * Changes the value that the user reads when a slider is changed.
 * @param {string} a
 * @param {string} b
 */
function valChange(a, b) {
    document.getElementById(a).value = document.getElementById(b).value;
}

/**
 * Generates a number for certain fields
 * @param {number} n 
 * @param {string} e 
 */
function randomNumber(n, e) {
    const num = Math.floor(Math.random() * n);
    for (const f of ['_num', '_range']) document.getElementById(e + f).value = num;
}
// Wait for everything to be loaded, and then bootstrap the app
window.addEventListener("load", function bootstrap() {
    init();
});
