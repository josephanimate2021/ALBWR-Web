const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const {spawn} = require("child_process");
const JSZip = require("jszip");
let scriptOutput = '', okay2spitscript = false, userIsRandomizingGame = false
const ws = require("ws");
const app = express();
app.use((req, res, next) => {
    console.log(req.headers.origin ? req.headers.origin?.split(":")[0] : '', req.method, req.url, req.query);
    next();
});
const http = require("http");
// The folder containing the static files
const publicDirectoryPath = path.join(__dirname, 'public');
const server = http.createServer(app);
// Handling the MIME types for CSS and JS files
app.use(express.static(publicDirectoryPath, {
    setHeaders: (res, filePath, stat) => {
        if (filePath.endsWith('.js')) {
            res.set('Content-Type', 'text/javascript');
        } else if (filePath.endsWith('.css')) {
            res.set('Content-Type', 'text/css');
        }
    }
}));
const url = require("url");
const wss = new ws.WebSocketServer({ noServer: true });
wss.on('connection', (ws, req) => {
    console.log(`ws`, req.method, req.url);
    const parsedUrl = url.parse(req.url, true);
    function shellInit(shell, callbackOnClose) { // loads a user's shell using the provided ChildProcess.
        shell.stdin.setEncoding("utf8")
        ws.on('message', c => shell.stdin.write(c + "\n"));
        shell.stdout.setEncoding("utf8")
        shell.stdout.on('data', o => ws.send('\n' + o));
        shell.stderr.setEncoding("utf8")
        shell.stderr.on('data', e => ws.send('\n' + e));
        ws.on('close', () => {
            shell.kill();
            if (callbackOnClose && typeof callbackOnClose == "function") callbackOnClose();
        });
    }
    switch (req.method) {
        case "GET": {
            switch (parsedUrl.pathname) {
                case "/randoCli": { // CLI for the ALBW Randomizer
                    userIsRandomizingGame = true;
                    switch (parsedUrl.query.v) {
                        case "z17-local":
                        case "albw": return ws.send(`Sorry, but the ${parsedUrl.query.v} randomizer does not support the CLI.`);
                    }
                    const randoPath = path.join(__dirname, `./sourcecodes/stable/${parsedUrl.query.v}-randomizer`);
                    if (writeALBWFile(Object.assign(req, parsedUrl), {}, randoPath, false, [], ws)) {
                        const shell = spawn("cd", [randoPath, `&& albw-randomizer-${parsedUrl.query.execV}`], {
                            name: 'xterm-color',
                            env: process.env,
                            shell: true
                        });
                        shellInit(shell, () => {
                            userIsRandomizingGame = false;
                            deleteALBWStuff(req, randoPath);
                        });
                        shell.on("close", async c => {
                            if (!parsedUrl.query.execV.includes("--")) {
                                if (c == 0) {
                                    ws.send(`\nYour game was successfully randomized. Getting zip file for your randomized game...`);
                                    await genGameZip(Object.assign(req, parsedUrl), ws);
                                    ws.send(`\nYour zip file is available for download!`);
                                    ws.send(`\nclick on the "Download Randomized Game" button below to download your randomized game.`);
                                    ws.send(`\nIn order to randomize your game again, simply reload this page.`);
                                } else {
                                    ws.send(`\nThe Randomizer CLI Closed unexpectedly with code ${c}.`);
                                    ws.send('\nTry refreshing this page and then randomizing your game again.');
                                    ws.send("\nIf that dosen't work, it's likely that you might have to use the GUI to randomize your game.")
                                    ws.send('\nThat method does a better job with error handling without you having to go through the CLI every single time')
                                    ws.send('\nto configure your preset over and over again.')
                                }
                            }
                        })
                        shell.on("error", e => ws.send(e))
                    } else {
                        ws.send('\nPlease try reloading the page or contacting josephalt7000 on discord to get your issue resolved.')
                        ws.send('\nA screenshot of this error is highly encouraged in order for your error to be better resolved.');
                    }
                    break;
                } case "/shell": { // Loads a shell
                    const command1 = parsedUrl.query.type == "cmd" ? `/${parsedUrl.query.k ? 'k' : 'c'}` : '-command';
                    const command = [];
                    if (parsedUrl.query.command) {
                        command.push(command1);
                        command.push(parsedUrl.query.command);
                    }
                    shellInit(spawn(`${parsedUrl.query.type || "powershell"}.exe`, command, {
                        name: 'xterm-color',
                        env: process.env
                    }))
                    break;
                } case "/uploadFile": { // Uploads the ALBW rom file
                    if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');
                    fs.writeFileSync(`./uploads/rom-${req.headers['x-forwarded-for']}.3ds`, '');
                    ws.on("message", e => {
                        fs.appendFileSync(`./uploads/rom-${req.headers['x-forwarded-for']}.3ds`, e);
                        ws.send("ok");
                    });
                    ws.send("ok")
                    break;
                }
            }
            break;
        }
    }
});
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
// parses a toml config file.
function parseTOML(configToml) {
    const config = {};
    for (const line of configToml.split('\n')) {
        if (!line) continue;
        const [key, value] = line.split(" = '");
        config[key] = value.split("'")[0]
    }
    return config;
}
// Define routes
app.get('/', (req, res) => {
    if (!req.query.fileUploaded) {
        if (fs.existsSync(`./uploads/rom-${req.headers['x-forwarded-for']}.3ds`)) {
            res.writeHead(302, '', {
                location: "/?fileUploaded=true"
            });
            res.end();
        }
    } else {
        if (!fs.existsSync(`./uploads/rom-${req.headers['x-forwarded-for']}.3ds`)) {
            res.writeHead(302, '', {
                location: "/"
            });
            res.end();
        }
    }
    res.sendFile(path.join(__dirname, 'views', 'uploadForm.html'));
}).get('/shell', (req, res) => {
    if (!req.headers.host.startsWith("localhost") && !req.headers.host.startsWith("127.0.0.1")) {
        res.writeHead(302, '', {
            location: "/"
        });
        res.end();
    } else res.sendFile(path.join(__dirname, `views/interactiveShell.html`))
}).get('/v4', (req, res) => {
    if (!fs.existsSync(`./uploads/rom-${req.headers['x-forwarded-for']}.3ds`)) {
        res.writeHead(302, '', {
            location: "/"
        });
        res.end();
    } else res.sendFile(path.join(__dirname, 'views', 'newRando.html'));
}).get('/cli', (req, res) => {
    if (!fs.existsSync(`./uploads/rom-${req.headers['x-forwarded-for']}.3ds`)) {
        res.writeHead(302, '', {
            location: "/"
        });
        res.end();
    } else res.sendFile(path.join(__dirname, 'views', 'randoCli.html'));
}).get('/deleteFile', (req, res) => {
    fs.unlinkSync(`./uploads/rom-${req.headers['x-forwarded-for']}.3ds`)
    res.writeHead(302, '', {
        location: req.headers.referer
    });
    res.end();
}).get('/settings/:v', (req, res) => {
    const info = {}
    const presets = [];
    for (const file of fs.readdirSync('./uploads').filter(i => i.startsWith(`settingsPreset-${req.params.v}-`) && i.endsWith(".json"))) {
        const info = JSON.parse(fs.readFileSync(`./uploads/${file}`));
        info.id = file.split("-")[2];
        presets.unshift(info);
    }
    const randoPath = `./sourcecodes/stable/${req.params.v}-randomizer`;
    const newLineCommon = "\n";
    const newLine = process.platform == "win32" ? "\r" : "" + newLineCommon;
    function decodeOldToml(info, tomlFile) {
        let toml = fs.readFileSync(tomlFile).toString('utf-8'), settingCat;
        const wordOptions = {
            captains_sword: ['Unchanged', 'Shuffled', 'Skip'],
            borrowed_sword: ['Unchanged', 'Shuffled'],
            lamp: ['Unchanged', 'Shuffled'],
            first_bracelet: ['Unchanged', 'Shuffled', 'Skip'],
            barrier: ['Unchanged', 'Start']
        }
        let p1 = toml.indexOf("## ");
        while (p1 > -1) {
            const s = toml.substring(p1);
            const [c, setting] = s.split(newLine + newLineCommon);
            if (setting.startsWith("[") && setting.endsWith("]")) {
                settingCat = setting.split("[")[1].split("]")[0] 
                info.settings[settingCat] = {
                    comment: c.substring(3)
                };
            } else if (settingCat == "exclude") {
                Object.assign(info.settings[settingCat], {
                    tip: c.substring(3),
                    defaultValue: {},
                    userCanAddNewLines: true,
                    allOptions: JSON.parse(fs.readFileSync(`${randoPath}/excludableChecksList.json`))
                });
                const line = setting.split("# ")[1].split(newLine + newLineCommon)[0]
                const key = line.split("[")[1].split("]")[0].split(".")[1];
                info.settings[settingCat].defaultValue[key] = {};
                const stuff = toml.substring(p1 + c.length);
                let p2 = stuff.indexOf("# ");
                while (p2 > -1) {
                    const n = p2 + 2;
                    const stuff2 = stuff.substring(n);
                    if (!stuff2.startsWith("[") && !stuff2.endsWith("]")) {
                        const unparsedArray = stuff2.split(' = ')[1].split('# ').join('');
                        const words = unparsedArray.split('[' + newLine + newLineCommon)[1].split(']')[0].split(',').map(word => word.trim().slice(0, -1).substring(1));
                        words.splice(words.length - 1, 1)
                        info.settings[settingCat].defaultValue[key][stuff2.split("'")[1].split("'")[0]] = words; 
                        p2 = -1;
                    } else p2 = stuff.indexOf("# ", n);
                }
            } else if (setting.startsWith("# ") && setting.includes(" =") && settingCat) {
                let val = setting.split(" = ")[1].split(newLine + newLineCommon)[0]
                if (val.startsWith("'") && val.endsWith("'")) val = val.substring(1, val.length - 1);
                const info2 = {
                    comment: c.substring(3),
                    defaultValue: val
                }
                const name = setting.split("# ")[1].split(" =")[0];
                if (wordOptions[name]) info2.allOptions = wordOptions[name];
                else info2.useBooleanOptions = true;
                info.settings[settingCat][name] = info2
            }
            toml = toml.split(c).join("");
            p1 = toml.indexOf("## ", p1 + 3);
        }
        return info;
    }
    function decodeNewToml(info, tomlFile) {
        let toml = fs.readFileSync(tomlFile).toString('utf-8'), settingCat;
        let p1 = toml.indexOf("## ");
        const wordOptions = {
            mode: ["Normal", "Hard", "GlitchBasic", "GlitchAdvanced", "GlitchHell", "NoLogic"]
        }
        while (p1 > -1) {
            const s = toml.substring(p1);
            const [c, setting] = s.split(newLine + newLineCommon)
            if (setting.startsWith("[") && setting.endsWith("]")) {
                settingCat = setting.split("[")[1].split("]")[0];
                info.settings[settingCat] = {
                    comment: c.substring(3)
                };
            } else if (settingCat == "exclude") {

            } if (settingCat == "exclusions") {
                let stuff = s.substring(s.indexOf(setting)).split("#").join("").split(`"exclusions" = [`)[1].slice(0, -1)
                stuff = stuff.split(newLine).join('').split(newLineCommon);
                stuff.splice(0, 1);
                stuff.splice(stuff.length - 1, 1);
                info.settings.exclusions.exclusions = {
                    defaultValue: [],
                    userCanAddNewLines: true,
                    allOptions: JSON.parse(fs.readFileSync(`${randoPath}/excludableChecksList.json`))
                }
                for (const option of stuff) info.settings.exclusions.exclusions.defaultValue.push(option.substring(4).slice(0, option.endsWith('",') ? -2 : -1));
            } else if (setting.includes(" = ") && !setting.startsWith("#") && settingCat) {
                const [key, value] = setting.split(" = ");
                info.settings[settingCat][key] = {
                    comment: c.substring(3),
                    defaultValue: value
                }
                if (wordOptions[key]) info.settings[settingCat][key].allOptions = wordOptions[key];
                else info.settings[settingCat][key].useBooleanOptions = true;
            }
            toml = toml.split(c).join("");
            p1 = toml.indexOf("## ", p1 + 3);
        }
        return info;
    }
    switch (req.params.v) {
        case "albw": {
            Object.assign(info, {
                presetName: "Default ALBWR Template",
                notes: [],
                settings: {}
            });
            decodeOldToml(info, `${randoPath}/presets/Standard.toml`);
            presets.unshift(info);
            break;
        } case "z17-local": {
            Object.assign(info, {
                presetName: "Default z17 ALBWR Standard Template",
                notes: [],
                settings: {}
            });
            decodeOldToml(info, `${randoPath}/z17-randomizer/config/presets/Standard.toml`);
            presets.unshift(info);
            const info2 = {
                presetName: "Default z17 ALBWR Open World Template",
                notes: [],
                settings: {}
            };
            decodeOldToml(info2, `${randoPath}/z17-randomizer/config/presets/Open.toml`)
            presets.unshift(info2)
            break;
        } case "z17-rando": {
            Object.assign(info, {
                presetName: "Default z17 ALBWR Template",
                notes: [],
                settings: {}
            });
            decodeNewToml(info, `${randoPath}/presets/Standard.toml`);
            presets.unshift(info);
            break;
        } case "z17r": {
            Object.assign(info, {
                presetName: "Default z17 ALBWR Template",
                notes: [],
                settings: {}
            });
            decodeNewToml(info, `${randoPath}/presets/Example.toml`);
            presets.unshift(info);
            break;
        } case "z17v3": {
            info.notes = ["Visit the <a href=\"https://github.com/rickfay/z17-randomizer/tree/v0.3.0?tab=readme-ov-file#game-options\">project GitHub</a> for details about each option."];
            info.settings = JSON.parse(fs.readFileSync(`${randoPath}/presets/Example.json`));
        } default: {
            info.presetName = "Default z17 ALBWR Template";
            let json = fs.readFileSync(`${randoPath}/presets/Example.json`).toString('utf-8');
            const wordOptions = {
                logic_mode: ["Normal", "Hard", "Glitched", "AdvGlitched", "Hell", "NoLogic"],
                lc_requirement: 7,
                ped_requirement: ["Vanilla", "Standard"],
                cracks: ["Closed", "Open"],
                cracksanity: ["Off", "CrossWorldPairs", "AnyWorldPairs", "MirroredCrossWorldPairs", "MirroredAnyWorldPairs"],
                keysy: ["Off", "SmallKeysy", "BigKeysy", "AllKeysy"],
                trials_door: ["OpenFromInsideOnly", "OneTrialRequired", "TwoTrialsRequired", "ThreeTrialsRequired", "AllTrialsRequired", "OpenFromBothSides"],
                weather_vanes: ["Standard", "Shuffled", "Convenient", "Hyrule", "Lorule", "All"],
                maiamai_limit: 100,
                nice_items: ["Vanilla", "Shuffled", "Off"],
                treacherous_tower_floors: 66,
                user_exclusions: JSON.parse(fs.readFileSync(`${randoPath}/excludableChecksList.json`))
            }
            const comments = [];
            let commentCount = 1;
            let pos = json.indexOf("// ");
            while (pos > -1) {
                const c = json.substring(pos).split(newLine)[0];
                comments.push(c.substring(3));
                json = json.split(c).join("")
                pos = json.indexOf("// ", pos + 3);
            }
            info.notes = info.notes || [comments[0]];
            if (!info.settings) Object.assign(info, JSON.parse(json));
            function c(k) {
                for (const settingName in k) {
                    if (typeof k[settingName] == "object" && !k[settingName].exclusions && settingName != "user_exclusions") c(k[settingName]);
                    else {
                        if (k[settingName].exclusions) {
                            const defaultValue = k[settingName].exclusions;
                            k[settingName].exclusions = {
                                comment: comments[commentCount],
                                defaultValue,
                                useCheckmarks: true,
                                allOptions: wordOptions.user_exclusions
                            }
                        } else {
                            const info2 = {
                                comment: comments[commentCount],
                                defaultValue: k[settingName]
                            }
                            switch (typeof k[settingName]) {
                                case "boolean": {
                                    info2.useBooleanOptions = true;
                                    break;
                                } default: {
                                    if (settingName.includes("exclu")) info2.useCheckmarks = true;
                                    if (
                                        wordOptions[settingName]
                                    ) info2[typeof k[settingName] == "number" ? 'rangeNumOptionsTo' : 'allOptions'] = wordOptions[settingName]
                                }
                            }
                            k[settingName] = info2;
                        }
                        commentCount++
                    }
                }
            }
            c(info.settings)
            presets.unshift(info);
            break;
        }
    }
    res.json(presets);
}).post('/randomize/:id', (req, res) => {
    try {
        if (userIsRandomizingGame) return res.json({
            error: {
                message: "Someone else is randomizing their game right now. Please wait for a few minutes."
            }
        })
        userIsRandomizingGame = true;
        scriptOutput = '';
        okay2spitscript = false;
        const randoPath = `./sourcecodes/stable/${req.query.v}-randomizer`;
        const command = [path.join(__dirname, randoPath), "&&", "albw-randomizer"];
        if (req.query.noSpoilers) command.push('--no-spoiler');
        if (req.query.noPatch) command.push('--no-patch');
        if (req.query.seed) command.push(`--seed ${req.query.seed}`);
        scriptOutput += `${req.query.v} randomizer stable is running${req.query.execVersion ? ` on version ${req.query.execVersion}` : ''}.\r\n`;
        if (req.query.execVersion) command[2] += `-${req.query.execVersion}`;
        const versionsFile = `${randoPath}/versions.json`;
        const versions = fs.existsSync(versionsFile) ? JSON.parse(fs.readFileSync(versionsFile)) : {};
        if (writeALBWFile(req, versions, randoPath, true, command, res)) {
            function gameGeneration(currentAttempt) {
                function sForWord(word = 'attempt', num = 0) {
                    return num > 1 ? (word + 's') : word
                }
                scriptOutput+=`Attempt #${currentAttempt}\r\n`;
                okay2spitscript = true
                const liveOutput = spawn(`cd`, command, {
                    shell: true
                });
            
                liveOutput.stdout.setEncoding('utf8');
                liveOutput.stdout.on('data', function(data) {
                    console.log('stdout:', data);
                    scriptOutput+=data.toString()+"\r\n";
                    okay2spitscript = true
                });
            
                liveOutput.stderr.setEncoding('utf8');
                liveOutput.stderr.on('data', function(data) {
                    console.log('stderr:', data);
                    scriptOutput+=data.toString()+"\r\n";
                    okay2spitscript = true
                });
            
                liveOutput.on('close', function(code) {
                    console.log('closing code:', code)
                    if (code != 0) {
                        scriptOutput += `The command closed unexpectedly with the ${code} code after ${currentAttempt} ${
                            sForWord('attempt', currentAttempt)
                        }.\r\nRetrying...\r\n`;
                        okay2spitscript = true;
                        gameGeneration(currentAttempt + 1);
                    } else {
                        scriptOutput += `Press Enter to continue...`;
                        okay2spitscript = true;
                    }
                });
            
                liveOutput.on('error', function(code) {
                    console.log('error:', code);
                    scriptOutput += `The command errored out with ${code} after ${currentAttempt} ${
                        sForWord('attempt', currentAttempt)
                    }.\r\nRetrying...\r\n`;
                    okay2spitscript = true;
                    gameGeneration(currentAttempt + 1);
                });
            }
            gameGeneration(1)
            res.json({
                isRandomizing: true,
                data: Object.assign({}, req.params, req.query)
            })
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            error: {
                message: err.toString(),
                data: err
            }
        });
    }
}).get('/execVersions/:v', (req, res) => {
    const versionsPath = `./sourcecodes/stable/${req.params.v}-randomizer/versions.json`
    res.json(fs.existsSync(versionsPath) ? JSON.parse(fs.readFileSync(versionsPath)) : {})
}).get('/randomizationStatus', (req, res) => {
    const interval = setInterval(() => {
        if (okay2spitscript) okay2spitscript = false, clearInterval(interval), res.send(scriptOutput);
    }, 1)
}).post('/genZipFromRandomizedGame', genGameZip);
function deleteALBWStuff(req, randoPath) {
    let config;
    switch (req.query.v) {
        case "z17-local": {
            config = parseTOML(fs.readFileSync(`${randoPath}/z17-randomizer/config/Rando.toml`).toString('utf-8'))
            fs.rmSync(path.join(process.env.APPDATA, 'z17-randomizer'), {
                recursive: true, 
                force: true 
            });
        } 
        case "z17r":
        case "z17-rando": {
            if (!config) config = parseTOML(fs.readFileSync(`${randoPath}/config.toml`).toString('utf-8'))
            const presetFile = `${randoPath}/presets/${req.query.id}.toml`;
            if (req.query.deletePreset && fs.existsSync(presetFile)) fs.unlinkSync(presetFile);
            break;
        } case "albw": {
            config = {
                output: 'generated',
                rom: 'albw.3ds'
            }
            fs.renameSync(`${randoPath}/presets/Standardold.toml`, `${randoPath}/presets/Standard.toml`)
            break;
        } default: {
            config = JSON.parse(fs.readFileSync(`${randoPath}/config.json`));
            const presetFile = `${randoPath}/presets/${req.query.id}.json`;
            if (req.query.deletePreset && fs.existsSync(presetFile)) fs.unlinkSync(presetFile);
            break;
        } 
    }
    fs.rmSync(`${randoPath}/${config.output}`, {
        recursive: true, 
        force: true 
    });
    fs.unlinkSync(`${randoPath}/${config.rom}`);
}
async function genGameZip(req, res) {
    function handleError(e) {
        console.error(e);
        res.send(e.toString());
    }
    if (!userIsRandomizingGame) return handleError("Someone needs to randomize ALBW in order to generate a zip file.")
    userIsRandomizingGame = false;
    try {
        const zip = new JSZip();
        const randoPath = `./sourcecodes/stable/${req.query.v}-randomizer`;
        function c(l, k) {
            for (const file of fs.readdirSync(l)) {
                const fileStats = fs.lstatSync(`${l}/${file}`);
                if (fileStats.isDirectory()) c(`${l}/${file}`, k.folder(file))
                else k.file(file, fs.readFileSync(`${l}/${file}`))
            }
        }
        let config;
        switch (req.query.v) {
            case "z17r":
            case "z17-rando": {
                config = parseTOML(fs.readFileSync(`${randoPath}/config.toml`).toString('utf-8'))
                break;
            } case "z17-local": {
                config = parseTOML(fs.readFileSync(`${randoPath}/z17-randomizer/config/Rando.toml`).toString('utf-8'))
                break;
            } case "albw": {
                config = {
                    output: 'generated',
                    rom: 'albw.3ds'
                }
                break;
            } default: config = JSON.parse(fs.readFileSync(`${randoPath}/config.json`));
        }
        c(`${randoPath}/${config.output}`, zip);
        deleteALBWStuff(req, randoPath);
        res.send(await zip.generateAsync({type:"nodebuffer"}))
    } catch (e) {
        handleError(e);
    }
}
function writeALBWFile(req = {}, versions = {}, randoPath, writeNewPreset = false, command = [], res) {
    try {
        function string2boolean(s) {
            switch (s) {
                case "true": return true;
                case "false": return false;
                default: {
                    if (isNaN(Number(s))) return s;
                    return Number(s);
                }
            }
        }
        function writeOldToml(newToml = false) {
            let toml = '';
            for (const i in req.query.settings) {
                toml += `[${i}]\r\n`;
                if (i == "exclude" && !newToml) {
    
                } else if (i == "exclusions" && newToml) toml += `"exclusions" = ${JSON.stringify(req.query.settings.exclusions.exclusions, null, "\t")}`
                else {
                    for (const c in req.query.settings[i]) toml += `${!newToml ? `# ` : ''}${c} = ${
                        typeof string2boolean(req.query.settings[i][c]) == "string" ? `'${req.query.settings[i][c]}'` : req.query.settings[i][c]
                    }\r\n`;
                }
            }
            return toml;
        }
        switch (req.query.v) {
            case "albw": {
                if (versions[req.query.execVersion]?.useVerbose && !req.query.noVerbose) command.push(`--verbose`);
                if (!fs.existsSync(`${randoPath}/generated`)) fs.mkdirSync(`${randoPath}/generated`);
                fs.writeFileSync(`${randoPath}/albw.3ds`, fs.readFileSync(`./uploads/rom-${req.headers['x-forwarded-for']}.3ds`));
                if (req.query.settings && typeof req.query.settings == "object" && writeNewPreset) {
                    fs.renameSync(`${randoPath}/presets/Standard.toml`, `${randoPath}/presets/Standardold.toml`);
                    fs.writeFileSync(`${randoPath}/presets/Standard.toml`, writeOldToml());
                }
                break;
            } case "z17-local": {
                const config = parseTOML(fs.readFileSync(`${randoPath}/z17-randomizer/config/Rando.toml`).toString('utf-8'))
                if (!fs.existsSync(`${randoPath}/${config.output}`)) fs.mkdirSync(`${randoPath}/${config.output}`);
                fs.writeFileSync(`${randoPath}/${config.rom}`, fs.readFileSync(`./uploads/rom-${req.headers['x-forwarded-for']}.3ds`));
                if (req.query.settings && typeof req.query.settings == "object" && writeNewPreset) {
                    const presetFile = `${randoPath}/z17-randomizer/config/presets/${req.params.id}.toml`
                    if (!fs.existsSync(presetFile)) fs.writeFileSync(presetFile, writeOldToml());
                }
                if (req.params?.id) command.push(`--preset ${req.params.id}`);
                function c(k) {
                    for (const j of fs.readdirSync(`${randoPath}/${k}`)) {
                        const stats = fs.lstatSync(`${randoPath}/${k}/${j}`);
                        if (stats.isDirectory()) {
                            const p = `${k}/${j}`;
                            const array = p.split("/");
                            function d(j, n) {
                                if (array.length == n) return;
                                const p = path.join(process.env.APPDATA, j);
                                if (!fs.existsSync(p)) fs.mkdirSync(p);
                                d(`${j}/${array[n + 1]}`, n + 1);
                            }
                            d(array[0], 0)
                            c(`${k}/${j}`);
                        } else fs.writeFileSync(path.join(process.env.APPDATA, `${k}/${j}`), fs.readFileSync(`${randoPath}/${k}/${j}`));
                    }
                }
                c('z17-randomizer')
                break;
            } 
            case "z17r":
            case "z17-rando": {
                const config = parseTOML(fs.readFileSync(`${randoPath}/config.toml`).toString('utf-8'))
                if (!fs.existsSync(`${randoPath}/${config.output}`)) fs.mkdirSync(`${randoPath}/${config.output}`);
                fs.writeFileSync(`${randoPath}/${config.rom}`, fs.readFileSync(`./uploads/rom-${req.headers['x-forwarded-for']}.3ds`));
                if (
                    req.query.settings && typeof req.query.settings == "object" && writeNewPreset
                ) fs.writeFileSync(`${randoPath}/presets/${req.params.id}.toml`, writeOldToml(true));
                if (req.params?.id) command.push(`--preset ${req.params.id}`);
                break;
            } default: {
                const info = req.query.v == "z17v3" ? req.query.settings : req.query;
                if (info && typeof info == "object" && writeNewPreset) {
                    const presetFile = `${randoPath}/presets/${req.params.id}`
                    function c(j) {
                        for (const i in j) {
                            if (typeof j[i] == "object") c(j[i])
                            else j[i] = string2boolean(j[i]);
                        }
                    }
                    c(info);
                    if (
                        req.params.id && !fs.existsSync(`${presetFile}.json`)
                    ) fs.writeFileSync(`${presetFile}.json`, JSON.stringify(info, null, "\t"));
                }
                const config = JSON.parse(fs.readFileSync(`${randoPath}/config.json`));
                if (!fs.existsSync(`${randoPath}/${config.output}`)) fs.mkdirSync(`${randoPath}/${config.output}`);
                fs.writeFileSync(`${randoPath}/${config.rom}`, fs.readFileSync(`./uploads/rom-${req.headers['x-forwarded-for']}.3ds`));
                if (req.params?.id) command.push(`--preset ${req.params.id}`);
            }
        }
        return true
    } catch (e) {
        console.log(e);
        res.send(req.headers.connection == "upgrade" ? e : e.toString());
        return false;
    }
}


const PORT = process.env.PORT || 80;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
