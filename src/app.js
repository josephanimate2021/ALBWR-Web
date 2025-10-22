// modules
import { WebContainer } from '@webcontainer/api';
import jQuery from 'jquery';
import { Terminal } from '@xterm/xterm';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { FitAddon } from '@xterm/addon-fit';
import JSZip from 'jszip';

var webContainerInstance

// run the randomizer on form submit.
jQuery("#settings-form").submit(async e => {
    const versionDropdown = jQuery("#versionDropdown");
    jQuery("#versionDropdown").attr("disabled", "");
    jQuery("#presetDropdown").attr("disabled", "");
    const settingsForm = jQuery("#settings-form");
    settingsForm.hide();
    const settings = parseForm(settingsForm);
    const versionVal = versionDropdown.val();
    jQuery("#statusText").text("Generating!");
    jQuery("#waiting-screen").show();
    const terminal = openTerminal('resultField');
    const commandExecution = async (cmd) => await executeCommand(cmd, terminal, webContainerInstance);
    commandExecution('echo Downloading rust...');
    await webContainerInstance.fs.writeFile("./rust_installer.sh", await (await fetch('/rust_installer.sh')).bytes())
    commandExecution('chmod +x rust_installer.sh')
    const shellProcess = await commandExecution("zsh ./rust_installer.sh");
    const exitCode = await shellProcess.exit;
    if (exitCode == 0) {

    } else {
        commandExecution("echo Rust has failed to download.")
    }
    /*webContainerInstance.fs.writeFile('./randomizeer/presets/form.json', JSON.stringify(settings, null, "\t"));
    instance.fs.writeFile('./package.json', JSON.stringify({
        name: "z17-randomizer",
        version: versionVal.substring(1),
        description: "A Link Between Worlds Randomizer",
        type: "module",
        scripts: {
          randomize: "node randomize.js"
        }
    }, null, "\t"))
    instance.fs.writeFile('./randomize.js', await (await fetch('/randomizerBackend.js')).text());
    terminal.write('Uploading The ALBW Rom To The Randomizer...\r\n')
    const reader = new FileReader();
    reader.onloadend = async function(e) {
        terminal.write('Successfully uploaded the ALBW rom! Setting up the randomizer...\r\n');
        const config = JSON.parse(await instance.fs.readFile('./config.json', 'utf8'));
        instance.fs.writeFile(`./${config.rom}`, e.target.result);
        instance.fs.writeFile('./albw-randomizer', await (await fetch(`/builds/${versionVal}/albw-randomizer`)).bytes());
        instance.fs.writeFile('./config.json', JSON.stringify(config, null, "\t"));
        executeRandomizer(terminal, instance, settings)
    };
    reader.readAsBinaryString(document.getElementById('rom').files[0]);*/
})

// Wait for everything to be loaded, and then bootstrap the app
window.addEventListener("load", function bootstrap() {
    init();
});

function openTerminal(elemId) {
    const fitAddon = new FitAddon();
    const terminal = new Terminal();
    terminal.open(document.getElementById(elemId));
    terminal.loadAddon(new WebLinksAddon());
    terminal.loadAddon(fitAddon);
    fitAddon.fit();
    window.addEventListener('resize', () => {
        fitAddon.fit();
    });
    return terminal;
}

function closeTerminal(elemId) {
    document.getElementById(elemId).innerHTML = '';
}

/**
 * Executes a command within the randomizer.
 * @param {Terminal} terminal
 */
async function executeCommand(command, terminal, webcontainerInstance, settings, requiresInput = false) {
    const commands = command.split(" ");
    const firstCommand = commands[0];
    commands.splice(0, 1);
    return await beginShellProcess(firstCommand, commands, settings, terminal, webcontainerInstance, requiresInput);
}

// Starts the command execution process.
async function beginShellProcess(firstCommand, commands, settings, terminal, webcontainerInstance, requiresInput = false) {
    if (settings?.seed != undefined) commands.push(settings.seed);

    const shellProcess = await webcontainerInstance.spawn(firstCommand, commands, {
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

    return shellProcess;
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
    loadVersions();
}

/**
 * Loads all existing builds and then selects a one that's supplied in the paramaters. 
 * If none are supplied, then the first build that pops up is selected by default.
 */
async function loadVersions(pickedVersionIndex = 0, gitInstalled = false, dirsExist = {}) {
    const terminal = openTerminal('resultField');
    const presetDropdown = jQuery("#presetDropdown");
    presetDropdown.attr("disabled", "");
    presetDropdown.off("change");
    presetDropdown.html('<option>Loading Presets...</option>');
    const versionDropdown = jQuery("#versionDropdown");
    versionDropdown.off("change");
    versionDropdown.attr("disabled", "");
    !versionDropdown.html() ? versionDropdown.html(`<option>Loading Latest Version of the randomizer...</option>`) : ''
    const commandExecution = (cmd) => executeCommand(cmd, terminal, webContainerInstance);
    jQuery("#settings-form").hide().html('');
    const preferedVersionProvider = localStorage.wantsToUseBrokenVersionsOfRando ? "gitlab" : "github";
    const builds = await (await fetch(`/versions_${preferedVersionProvider}.json`)).json();
    const pickedBuild = builds[pickedVersionIndex]
    for (let i = 0; i < builds.length; i++) versionDropdown.append(
        `<option value="${i}"${builds[i].tag_name == pickedBuild.tag_name ? ' selected' : ''}>${builds[i].name}</option>`
    );
    versionDropdown.on("change", d => loadVersions(jQuery(d.target).val(), true, dirsExist));
    jQuery("#waiting-screen").show();
    if (!gitInstalled) {
        jQuery("#statusText").html(`Installing git for use in cloning the randomizer source code...<br>`)
        webContainerInstance = await WebContainer.boot();
        commandExecution("echo Installing git...");
        var attemptCount = 0;
        async function gitInstall() {
            const shellProcess = await beginShellProcess('npm', ['install', 'isomorphic-git'], {}, terminal, webContainerInstance);
            const exitCode = await shellProcess.exit;
            if (exitCode == 0) {
                commandExecution("echo Git has been installed successfuly!");
                jQuery("#statusText").html(`Git was successfuly installed!<br>We will move on to the next step in 5 seconds.<br>`)
                await webContainerInstance.fs.mkdir('./randomizer');
                setTimeout(() => {
                    closeTerminal('resultField');
                    loadVersions(0, true, dirsExist);
                }, 5000);
            } else if (attemptCount < 1) {
                commandExecution("echo Git has failed to install for some reason. Attempting install one more time.");
                attemptCount++
                gitInstall();
            } else commandExecution(
                "echo Git has failed to install 2 times in a row. It is needed in order to properly run the randomizer from a WebContainers instance. Maybe there is something going on with the code. Please report this issue to https://github.com/josephanimate2021/albwr-web/issues", 
                terminal, 
                webContainerInstance
            )
        }
        gitInstall()
    } else if (!dirsExist[`./${pickedBuild.tag_name}`]) {
        jQuery("#statusText").html(`Cloning the randomizer source code from<br>${pickedBuild.name}...<br>`);
        commandExecution("echo Cloning the source code...");
        commandExecution("echo This shouldn't take long if you have fast internet.")
        let attemptCount = 0;
        async function cloneSourceCode() {
            const shellProcess = await beginShellProcess('isogit', ['clone', '--url=' + (() => {
                return preferedVersionProvider == "github" ? pickedBuild.html_url.split("/releases")[0] : pickedBuild.commit.web_url.split("/-/")[0]
            })(), '--dir=randomizer', '--singleBranch=true', `--ref=${pickedBuild.tag_name}`], {}, terminal, webContainerInstance);
            const exitCode = await shellProcess.exit;
            if (exitCode == 0) {
                jQuery("#statusText").html(`Getting the settings from the latest randomizer version...<br>`);
                commandExecution('echo The source code was cloned successfuly! The randomizer is finally being set up now.');
                setTimeout(() => {
                    closeTerminal('resultField')
                    loadVersions(0, true, {
                        [`./${pickedBuild.tag_name}`]: true
                    });
                }, 5000);
            } else if (attemptCount < 1) {
                commandExecution('echo Failed to clone your source code for some reason. Trying one more time...');
                attemptCount++;
                await webContainerInstance.fs.rm(`./${pickedBuild.tag_name}`, { recursive: true });
                cloneSourceCode();
            } else commandExecution(
                "echo Git has failed to clone the source code 2 times in a row. It is needed in order to build a binary file for WebContainers to run. Maybe there is something going on with the code. Please report this issue to https://github.com/josephanimate2021/albwr-web/issues", 
                terminal, 
                webContainerInstance
            )
        }
        cloneSourceCode();
    } else {
        const comments = [];
        let fileContents = await webContainerInstance.fs.readFile('./randomizer/presets/Example.json', 'utf8')
        console.log(fileContents)
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
        if (!info2.version) {
            const versionNum = i.split("-")[0];
            Object.assign(info2, {
                presetName: file.substring(0, file.lastIndexOf(".")).split("_").map(capitalizeWord).join(' '),
                version: `${versionNum}${i.substring(versionNum.length).startsWith('-') ? ` -${
                    i.substring(versionNum.length).split("-").map(capitalizeWord).join(' ')
                }` : ''}`
            });
        }
        closeTerminal('resultField');
        loadPreset(info2);
    }
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
 * @param {JSON} j
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
