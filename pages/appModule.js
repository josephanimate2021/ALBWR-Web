// modules
import { WebContainer } from 'https://cdn.jsdelivr.net/npm/@webcontainer/api/dist/index.js';

// run the randomizer on form submit.
jQuery("#settings-form").submit(async e => {
    const versionDropdown = $("#versionDropdown");
    $("#versionDropdown").attr("disabled", "");
    $("#presetDropdown").attr("disabled", "");
    const settingsForm = $("#settings-form");
    settingsForm.hide();
    const settings = parseForm(settingsForm);
    const versionVal = versionDropdown.val();
    $("#statusText").text("Generating!");
    $("#waiting-screen").show();
    const fitAddon = new FitAddon.FitAddon();
    const terminal = new Terminal();
    terminal.open(document.getElementById('resultField'));
    terminal.loadAddon(new WebLinksAddon.WebLinksAddon());
    terminal.loadAddon(fitAddon);
    fitAddon.fit();
    window.addEventListener('resize', () => {
        fitAddon.fit();
    });
    const instance = await WebContainer.boot();
    await instance.mount(await (await fetch(`/JSONFileSystem?folder=builds/${versionVal}&showContents=true&contentType=utf8`, {
        method: "POST"
    })).json());
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
        const buffer2 = new Uint8Array(await (await fetch(`/buildFiles/get/${versionVal}?filename=albw-randomizer`, {
            method: 'POST'
        })).arrayBuffer());
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
        if (i.includes("][") && i.endsWith("]") && i.startsWith(startVal + "[")) {
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
            } else newInfo[startVal][k[0]] = json[i]
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