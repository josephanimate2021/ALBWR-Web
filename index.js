/**
 * ALBWR Web Server
 */
// modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const {spawn} = require("child_process");
const JSZip = require("jszip");
const ws = require("ws");
const app = express();
const yaml = require("yaml");
const http = require("http");
const url = require("url");
// variables
let scriptOutput = '', okay2spitscript = false, userIsRandomizingGame = false
const publicDirectoryPath = path.join(__dirname, 'public');
const server = http.createServer(app);
const wss = new ws.WebSocketServer({ noServer: true });
// handle WebSocket connections
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
                    if (userIsRandomizingGame) return ws.send('Someone is currently randomizing their game right now. Please check back later.')
                    userIsRandomizingGame = true
                    switch (parsedUrl.query.v) {
                        case "z17-local":
                        case "albw": return ws.send(`Sorry, but the ${parsedUrl.query.v} randomizer does not support the CLI.`);
                    }
                    const sourceCodeRoot = path.join(__dirname, `./sourcecodes/${parsedUrl.query.sourceVersion}${
                        parsedUrl.query.sourceVersion == "dev" ? `/${req.headers['x-forwarded-for'] || 'localhost'}` : ''
                    }`);
                    const randoPath = path.join(sourceCodeRoot, parsedUrl.query.v);
                    if (parsedUrl.query.sourceVersion == "dev") {
                        if (!fs.existsSync(randoPath)) {
                            ws.send(`It seems that the build folder for your cloned source code does not exist. Creating the folder now...\r\n`);
                            const sourceFolder = path.join(sourceCodeRoot, parsedUrl.query.v.substring(0, parsedUrl.query.v.indexOf("/")));
                            const command = [sourceFolder, '&& cargo update && cargo build'];
                            ws.send(`Running Command: cd ${command.join(' ')}\r\n`);
                            const shell = spawn('cd', command, {
                                shell: true
                            });
                            shellInit(shell, () => {
                                userIsRandomizingGame = false;
                                deleteALBWStuff(Object.assign(req, parsedUrl), randoPath);
                            });
                            shell.on("close", c => {
                                if (c == 0) { // if successful, create the files needed to work the albw randomizer executable
                                    ws.send(`The build was successful! Attempting to launch the ${parsedUrl.query.type} executable...\r\n`);
                                    const configInBuild = path.join(randoPath, 'config.json');
                                    if (!fs.existsSync(configInBuild)) fs.copyFileSync(path.join(sourceFolder, "config.json"), configInBuild);
                                    for (const filePath of ["presets/Example.json", "presets/Example.toml", "presets/Standard.toml"]) {
                                        const presetInBuild = path.join(randoPath, filePath);
                                        if (!fs.existsSync(presetInBuild)) {
                                            const presetFile = path.join(sourceFolder, filePath);
                                            if (fs.existsSync(presetFile)) {
                                                const folder = filePath.split("/")[0];
                                                if (!fs.existsSync(path.join(randoPath, folder))) fs.mkdirSync(path.join(randoPath, folder));
                                                fs.copyFileSync(presetFile, presetInBuild);
                                            }
                                        }
                                    }
                                    const exclusiveChecksInBuild = path.join(sourceFolder, 'excludableChecksList.json');
                                    if (!fs.existsSync(exclusiveChecksInBuild)) {
                                        const info = {}
                                        fs.writeFileSync(exclusiveChecksInBuild, JSON.stringify(info, null, "\t"))
                                    }
                                    launchExe();
                                }
                                else userIsRandomizingGame = false, ws.send(`The build command for rust has failed with code ${
                                    c
                                }.\r\nEither rust isn't installed or something else went wrong during the build process like not having an existant directory for the cloned source code or etc,\r\nstuff like that. Please resolve those issues before reloading this page.`)
                            })
                        } else launchExe();
                    } else launchExe();
                    function launchExe() {
                        if (writeALBWFile(Object.assign(req, parsedUrl), {}, randoPath, false, [], ws)) {
                            const shell = spawn("cd", [randoPath, `&& albw-${parsedUrl.query.type}${parsedUrl.query.execV ? `-${parsedUrl.query.execV}` : ''}`], {
                                name: 'xterm-color',
                                env: process.env,
                                shell: true
                            });
                            shellInit(shell, () => {
                                userIsRandomizingGame = false;
                                deleteALBWStuff(Object.assign(req, parsedUrl), randoPath);
                            });
                            shell.on("close", async c => {
                                if (!parsedUrl.query.execV?.includes("--")) {
                                    if (c == 0) {
                                        ws.send(`\nYour game was successfully randomized. Getting zip file for your randomized game...`);
                                        await genGameZip(Object.assign(req, parsedUrl), ws);
                                        ws.send(`\nYour zip file is available for download!`);
                                        ws.send(`\nclick on the "Download Randomized Game" button below to download your randomized game.`);
                                        ws.send(`\nIn order to randomize your game again, simply reload this page.`);
                                        term.write(`\nBy the way, don't forget to use a tracker: ${window.location.origin}/tracker`);
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
                            userIsRandomizingGame = false;
                            ws.send('\nPlease try reloading the page or contacting josephalt7000 on discord to get your issue resolved.')
                            ws.send('\nA screenshot of this error is highly encouraged in order for your error to be better resolved.');
                        }
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
                } case "/uploadFile": { // Uploads a file via websockets
                    if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');
                    const ipbse64 = Buffer.from(req.headers['x-forwarded-for'] || 'localhost').toString('base64');
                    const name = parsedUrl.query.value?.substring(parsedUrl.query.value?.lastIndexOf("\\") + 1) || parsedUrl.query.name;
                    const ext = name?.substring(name?.lastIndexOf(".") + 1) || "json";
                    if (name) fs.writeFileSync(`./uploads/${name}`, '');
                    ws.on("message", e => {
                        try {
                            const info = JSON.parse(e);
                            switch (info.onFileUploadAfter) { // functions for after a file is done uploading on websockets
                                case "deletePreset": {
                                    const fileMatch = fs.readdirSync('./uploads').filter(i => i.startsWith(info.fileId));
                                    if (fileMatch.length == 1) {
                                        fs.unlinkSync(`./uploads/${fileMatch[0]}`);
                                        ws.send('success');
                                    } else ws.send('fail');
                                    break;
                                } case "make3dsrom": { // creates a 3ds rom when told to
                                    fs.renameSync(`./uploads/${name}`, `./uploads/rom-${ipbse64}.3ds`)
                                    ws.send('success');
                                    break;
                                } case "convert2preset": { 
                                    // when called, the uploaded file will be converted into a settings preset. 
                                    // If the file is not supported, then this won't work.
                                    let preset = fs.existsSync(
                                        `./uploads/${name || info.publishingPreset.filename}`
                                    ) ? fs.readFileSync(
                                        `./uploads/${name || info.publishingPreset.filename}`
                                    ).toString("utf-8") : JSON.stringify(info.publishingPreset);
                                    info.publishingPreset.presetName ||= "Untitled Preset";
                                    info.publishingPreset.notes = info.publishingPreset.notes ? info.publishingPreset.notes.split("\r").join('').split("\n") : [];
                                    info.publishingPreset.publisherIP = req.headers['x-forwarded-for'] || 'localhost';
                                    function writePreset(preset) {
                                        console.log(preset);
                                        fs.writeFileSync(
                                            `./uploads/${info.publishingPreset.filename}`, 
                                            typeof preset == "object" ? JSON.stringify(preset, null, "\t") : preset
                                        );
                                    }
                                    switch (ext) {
                                        case "json": { 
                                            // JSON spoiler logs are quite universal to the ALBWR community nowadays so there shouldn't be too much
                                            // concern with this method.
                                            try { // most spoiler logs don't have comments so it should be fine.
                                                preset = JSON.parse(preset)
                                                Object.assign(preset, info.publishingPreset);
                                            } finally { 
                                                // most preset files made with JSON have comments so the JSON won't be able to get parsed. 
                                                // As a result of this, we will have to manually input data without parsing the JSON string.
                                                for (const i in info.publishingPreset) preset = preset.replace("{", `{\n\t"${i}": ${
                                                    typeof info.publishingPreset[i] == "object" ? JSON.stringify(info.publishingPreset[i]) : `"${info.publishingPreset[i]}"`
                                                },`);
                                            }
                                            writePreset(preset);
                                            break;
                                        } case "yaml": { 
                                            /**
                                             * Spoiler logs in yamls will only work with versions older than v3 and newer. 
                                             * so it's better to just upload a spoiler log as a JSON file 
                                             * as that's how most people are sharing their albwr presets/spoiler logs nowadays.
                                             * Not sure why i included this, but for all i know, i wanted to support spoiler logs as well, not just presets.
                                             * Considering the fact that yaml spoiler logs first popped up during albwr's early stages of developement,
                                             * i wouldn't be suprised if the randomizer algorithm does not keep the seed and eveything else the same considering how
                                             * old yaml spoiler logs are to this day.
                                             */ 
                                            switch (info.expectedPresetV) {
                                                case "z17":
                                                case "z17v3": fs.unlinkSync(`./uploads/${name}`); return ws.send('incompatiableVersionError');
                                                default: {
                                                    preset = yaml.parse(preset);
                                                    if (preset.settings && preset.layout && preset.seed) {
                                                        if (preset.layout.Hyrule && preset.layout.Lorule && preset.layout.Dungeons) {
                                                            for (const i in preset.settings) preset[i] = preset.settings[i];
                                                            delete preset.settings;
                                                            Object.assign(preset, info.publishingPreset)
                                                            writePreset(preset);
                                                        } else ws.send('noExpectedLayoutsError')
                                                    } else ws.send('inproperSpoilerLogError')
                                                }
                                            }
                                            break;
                                        } case "toml": { // There were presets made with toml in the past. so converting this to a JSON might be tricky.
                                            break;
                                        }
                                    }
                                    if (fs.existsSync(`./uploads/${name}`)) fs.unlinkSync(`./uploads/${name}`);
                                    ws.send('success');
                                    break;
                                }
                            }
                        } finally {
                            fs.appendFileSync(`./uploads/${name}`, e);
                            ws.send("ok");
                        }
                    });
                    ws.send("ok")
                    break;
                } case "/cloneRepo": {
                    ws.on("message", e => {
                        const data = JSON.parse(e);
                        const info = data.info[data.url];
                        const branchInfo = info.branches.find(i => i.name == data.branch) || info.commits.find(i => (i.sha || i.id) == data.branch);
                        const sourcecodesDevFolder = path.join(__dirname, './sourcecodes/dev'), inIp = path.join(sourcecodesDevFolder, req.headers['x-forwarded-for'] || 'localhost');
                        if (!fs.existsSync(sourcecodesDevFolder)) fs.mkdirSync(sourcecodesDevFolder);
                        if (!fs.existsSync(inIp)) fs.mkdirSync(inIp);
                        const repoFolder = path.join(inIp, info.repo.name);
                        if (fs.existsSync(repoFolder)) fs.rmSync(repoFolder, {
                            recursive: true
                        })
                        const command = [
                            inIp,
                            '&& git clone',
                            (info.repo.html_url || info.repo.web_url) + ".git",
                            '-v',
                            '--progress'
                        ];
                        if (branchInfo.name) {
                            command.push('--branch');
                            command.push(branchInfo.name);
                        }
                        ws.send(`\r\nRunning command:\r\ncd ${command.join(' ')}`)
                        const shell = spawn(`cd`, command, {
                            shell: true
                        });
                        shellInit(shell);
                        shell.on("close", c => {
                            if (!branchInfo.sha && !branchInfo.short_id && !branchInfo.id) {
                                if (c == 0) ws.send('success');
                                else {
                                    ws.send(`\r\nThe command closed unexpectedly with code ${c}.\r\n`);
                                    ws.send('fail');
                                }
                            } else {
                                ws.send(`Because you chose to use commits, a command will now be ran where it will checkout commit ${
                                    branchInfo.sha?.slice(0, -33) || branchInfo.short_id
                                }.`)
                                const command = [
                                    repoFolder,
                                    '&& git checkout',
                                    branchInfo.sha || branchInfo.id,
                                ];
                                ws.send(`\r\nRunning command:\r\ncd ${command.join(' ')}`)
                                const shell = spawn(`cd`, command, {
                                    shell: true
                                });
                                shellInit(shell);
                                shell.on("close", c => {
                                    if (c == 0) ws.send('success');
                                    else {
                                        ws.send(`\r\nThe command closed unexpectedly with code ${c}.\r\n`);
                                        ws.send('fail');
                                    }
                                });
                            }
                        });
                    })
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
// handle console logging
app.use((req, _, next) => {
    console.log(req.headers.origin ? req.headers.origin?.split(":")[0] : '', req.method, req.url, req.query);
    next();
})
// Handling the MIME types for CSS and JS files
.use(express.static(publicDirectoryPath, {
    setHeaders: (res, filePath, stat) => {
        if (filePath.endsWith('.js')) {
            res.set('Content-Type', 'text/javascript');
        } else if (filePath.endsWith('.css')) {
            res.set('Content-Type', 'text/css');
        }
    }
}))
// Main page
.get('/', (req, res) => {
    const ipbse64 = Buffer.from(req.headers['x-forwarded-for'] || 'localhost').toString('base64');
    if (!req.query.fileUploaded) {
        if (fs.existsSync(`./uploads/rom-${ipbse64}.3ds`)) {
            res.writeHead(302, '', {
                location: "/?fileUploaded=true"
            });
            res.end();
        }
    } else {
        if (!fs.existsSync(`./uploads/rom-${ipbse64}.3ds`)) {
            res.writeHead(302, '', {
                location: "/"
            });
            res.end();
        }
    }
    res.sendFile(path.join(__dirname, 'views', 'uploadForm.html'));
}) 
// shell page
.get('/shell', (req, res) => {
    if (!req.headers.host.startsWith("localhost") && !req.headers.host.startsWith("127.0.0.1")) {
        res.writeHead(302, '', {
            location: "/"
        });
        res.end();
    } else res.sendFile(path.join(__dirname, `views/interactiveShell.html`))
}) 
// Page for the v0.4 family of the albw randomizer which as of right now is currently the latest family of versions that are currently out.
.get('/v4', (req, res) => {
    if (!fs.existsSync(`./uploads/rom-${Buffer.from(req.headers['x-forwarded-for'] || 'localhost').toString('base64')}.3ds`)) {
        res.writeHead(302, '', {
            location: "/"
        });
        res.end();
    } else res.sendFile(path.join(__dirname, 'views', 'newRando.html'));
}) 
// RandoCLI page for users who prefer the style.
.get('/cli', (req, res) => {
    if (!fs.existsSync(`./uploads/rom-${Buffer.from(req.headers['x-forwarded-for'] || 'localhost').toString('base64')}.3ds`)) {
        res.writeHead(302, '', {
            location: "/"
        });
        res.end();
    } else res.sendFile(path.join(__dirname, 'views', 'randoCli.html'));
}) 
// Deletes a user's 3ds rom apon request.
.get('/deleteFile', (req, res) => {
    fs.unlinkSync(`./uploads/rom-${Buffer.from(req.headers['x-forwarded-for'] || 'localhost').toString('base64')}.3ds`)
    res.writeHead(302, '', {
        location: "/"
    });
    res.end();
}) 
// Sends the user's IP Address (Server side) to the browser
.get('/whatismyip', (req, res) => res.end(req.headers['x-forwarded-for'] || 'localhost'))
// Gets the settings using the provided version and source version.
.get('/settings/:sourceVersion/:v', (req, res) => {
    // variables
    const presets = [];
    const randoPath = `./sourcecodes/${req.params.sourceVersion}${
        req.params.sourceVersion == "dev" ? `/${req.headers['x-forwarded-for'] || 'localhost'}` : ''
    }/${req.params.v}`;
    const excludableChecksJSON = fs.existsSync(`${randoPath}/excludableChecksList.json`) ? JSON.parse(
        fs.readFileSync(`${randoPath}/excludableChecksList.json`)
    ) : {};
    let localPrefix;
    // loop for pushing any uploaded presets into the presets array.
    for (const file of fs.readdirSync('./uploads').filter(i => i.startsWith(`settingsPreset-${req.params.v}-`) && (i.endsWith(".json") || i.endsWith(".toml")))) {
        const f = file.endsWith(".toml") ? decodeSettingsToml : decodeSettingsJSON;
        const info = f({
            id: file.substring(0, file.lastIndexOf("."))
        }, `./uploads/${file}`, randoPath);
        // Keep the loop going if a private preset is detected but does not match the ip address provided by the user's browser.
        if (info.private && info.publisherIP != (req.headers['x-forwarded-for'] || 'localhost')) continue;
        // Push the info if all checks cleared successfuly.
        info.presetName ||= "Untitled Preset";
        presets.unshift(info);
    }
    // functions
    function decodeSettingsJSON(info, jsonFile) { // Decodes some settings written in JSON with comments.
        let json = fs.readFileSync(jsonFile).toString('utf-8');
        const wordOptions = { // Used to provide options for some setting properties
            logic_mode: ["Normal", "Hard", "Glitched", "AdvGlitched", "Hell", "NoLogic"],
            lc_requirement: 7,
            ped_requirement: ["Vanilla", "Standard"],
            door_shuffle: ["Off", "DungeonEntrances"],
            cracks: ["Closed", "Open"],
            cracksanity: ["Off", "CrossWorldPairs", "AnyWorldPairs", "MirroredCrossWorldPairs", "MirroredAnyWorldPairs"],
            keysy: ["Off", "SmallKeysy", "BigKeysy", "AllKeysy"],
            trials_door: ["OpenFromInsideOnly", "OneTrialRequired", "TwoTrialsRequired", "ThreeTrialsRequired", "AllTrialsRequired", "OpenFromBothSides"],
            weather_vanes: ["Standard", "Shuffled", "Convenient", "Hyrule", "Lorule", "All"],
            maiamai_limit: 100,
            nice_items: ["Vanilla", "Shuffled", "Off"],
            treacherous_tower_floors: 66,
            hint_ghost_price: 9999,
            user_exclusions: excludableChecksJSON
        }
        wordOptions.portal_shuffle = wordOptions.cracksanity;
        wordOptions.ravios_shop = wordOptions.cracks;
        // exclusions are the same as user exclusions in v4, so who cares.
        wordOptions.exclusions = wordOptions.user_exclusions;
        const comments = [];
        let commentCount = 1;
        let pos = json.indexOf("// ");
        while (pos > -1) { // Takes out all of the comments making it easier to parse the JSON output.
            const c = json.substring(pos).split('\r').join('').split('\n')[0];
            comments.push(c.substring(3));
            json = json.split(c).join("")
            pos = json.indexOf("// ");
        }
        info.notes = info.notes || [];
        if (comments[0]) info.notes.push(comments[0]);
        Object.assign(info, JSON.parse(json));
        if (req.params.v == "z17v3") { // Add some extra stuff if the detected version is v3.
            info.settings ||= JSON.parse(json);
            delete info.settings.presetName;
            delete info.settings.notes;
            wordOptions.ped_requirement[1] = "Charmed";
            wordOptions.ped_requirement[2] = "Standard";
        }
        for (const i in info.settings) {
            if (info[i]) delete info[i];
        }
        function c(k) { // The function that converts setting values into selectable values. The randomizer takes care of converting this back to the original.
            for (const settingName in k) {
                if (typeof k[settingName] == "object" && !Array.isArray(k[settingName])) c(k[settingName]);
                else {
                    const info2 = {
                        comment: comments[commentCount],
                        defaultValue: k[settingName]
                    }
                    switch (typeof k[settingName]) {
                        case "boolean": {
                            info2.useBooleanOptions = true;
                            break;
                        } default: {
                            if (Array.isArray(k[settingName])) info2.useCheckmarks = true;
                            if (
                                wordOptions[settingName]
                            ) info2[typeof k[settingName] == "number" ? 'rangeNumOptionsTo' : 'allOptions'] = wordOptions[settingName]
                        }
                    }
                    k[settingName] = info2;;
                    commentCount++
                }
            }
        }
        c(info.settings)
        return info;
    }
    // conditionals
    if (req.params.sourceVersion == "stable") switch (req.params.v) { // Pushes a preset depending on the rando version.
        case "albw": localPrefix = "albw";
        case "z17-local": {
            localPrefix ||= "z17";
            presets.unshift(decodeSettingsToml({
                presetName: "Default ALBWR Open World Template",
                id: "Open",
                notes: [],
                settings: {}
            }, `${randoPath}/${localPrefix}-randomizer/config/presets/Open.toml`, randoPath));
            presets.unshift(decodeSettingsToml({
                presetName: "Default ALBWR Standard Template",
                id: "Standard",
                notes: [],
                settings: {}
            }, `${randoPath}/${localPrefix}-randomizer/config/presets/Standard.toml`, randoPath));
            break;
        } 
        case "z17-rando": localPrefix = "Standard";
        case "z17r": {
            localPrefix ||= "Example";
            presets.unshift(decodeSettingsToml({
                presetName: "Default z17 ALBWR Template",
                id: localPrefix,
                notes: [],
                settings: {}
            }, `${randoPath}/presets/${localPrefix}.toml`, randoPath))
            break;
        } default: { // JSON is more universal with the ALBWR community, so I am allowing code modifiers to add as many example presets as they want.
            fs.readdirSync(`${randoPath}/presets`).forEach(file => {
                presets.unshift(decodeSettingsJSON({
                    id: file.substring(0, file.lastIndexOf("."))
                }, `${randoPath}/presets/${file}`));
            })
            break;
        }
    } else { // For cloned source codes, we need to take a different approach by pusing presets using trial and error.
        for (const file of ['presets/Example.json', 'presets/Example.toml', 'presets/Standard.toml']) { 
            // The given array is preset files to look for during the loop.
            const presetFile = path.join(randoPath, file);
            if (fs.existsSync(presetFile)) { // gives presets a name based off of the found preset file.
                if (file.endsWith(".json")) presets.unshift(decodeSettingsJSON({
                    presetName: "Default z17 ALBWR Template"
                }, presetFile));
                else if (file.endsWith(".toml")) presets.unshift(decodeSettingsToml({
                    presetName: `Default ALBWR Standard Template`,
                    notes: [],
                    settings: {}
                }, presetFile, randoPath));
            }
        }
    }
    res.json(presets);
})
// Randomizes ALBW using the provided user input (The core of this whole web application)
.post('/:type/:id', (req, res) => {
    try {
        if (userIsRandomizingGame) { 
            // Due to the potential overlap of files during game randomization, 
            // I will let one user randomize their gane at a time.
            scriptOutput += "Someone else is randomizing their game right now. Please wait for a few minutes.";
            okay2spitscript = true; 
            return;
        }
        res.json({ // No user needs to wait for the randomizer to start. So just kick into the rando status.
            isRandomizing: true,
            data: Object.assign({}, req.params, req.query)
        })
        // variables and conditionals
        userIsRandomizingGame = true;
        let randoPath = path.join(__dirname, 'sourcecodes', req.query.sourceVersion);
        if (req.query.sourceVersion == "dev") randoPath = path.join(randoPath, req.headers['x-forwarded-for'] || 'localhost');
        randoPath = path.join(randoPath, req.query.v);
        const command = [randoPath, "&&", `albw-${req.params.type}`];
        if (req.query.noSpoilers) command.push('--no-spoiler');
        if (req.query.noPatch) command.push('--no-patch');
        if (req.query.seed && req.params.type == "randomizer") command.push(`--seed ${req.query.seed}`);
        scriptOutput = `The randomizer is now up and running${req.query.execVersion ? ` on version ${req.query.execVersion}` : ''}.\r\n`;
        okay2spitscript = true;
        if (req.query.execVersion) command[2] += `-${req.query.execVersion}`;
        const versionsFile = path.join(randoPath, 'versions.json');
        const versions = fs.existsSync(versionsFile) ? JSON.parse(fs.readFileSync(versionsFile)) : {};
        function sForWord(word = 'attempt', num = 0) { // adds an s to a word via a given number
            return num > 1 ? (word + 's') : word
        }
        function gameGeneration(currentAttempt, limit) { // Uses the provided limit and attempt count to randomize ALBW.
            // variables
            scriptOutput+=`Attempt #${currentAttempt}\r\nNOTE: There are cuurently ${limit - (currentAttempt - 1)} ${
                sForWord('attempt', limit - (currentAttempt - 1))
            } remaining until the randomizer stops entirely (unless you restart it).\r\nThis measure helps ensure that this website is still usable for everyone and that heavy loads are not being applied to the backend of this website.\r\n`;
            okay2spitscript = true
            const liveOutput = spawn(`cd`, command, {
                shell: true
            });
            // log output to the terminal
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
                if (code != 0) { // Errors out depending on the close code.
                    if (limit) {
                        scriptOutput += `The command closed unexpectedly with the ${code} code after ${currentAttempt} ${
                            sForWord('attempt', currentAttempt)
                        }.\r\n${
                            code == 101 ? currentAttempt < limit ? `Retrying with ${limit - currentAttempt} ${
                                sForWord('attempt', limit - currentAttempt)
                            } remaining...` : `ERROR: you have reached a max limit of ${limit} ${
                                sForWord('attempt', limit)
                            }. Please try again later.Press Enter to continue...` : 'Press Enter to continue...'
                        }\r\n`;
                        okay2spitscript = true;
                        if (code == 101 && currentAttempt < limit) gameGeneration(currentAttempt + 1, limit);
                    } else {
                        scriptOutput += `The command closed unexpectedly with the ${code} code after ${currentAttempt} ${
                            sForWord('attempt', currentAttempt)
                        }.${code == 101 ? `Retrying...` : 'Press Enter to continue...'}\r\n`;
                        okay2spitscript = true;
                        if (code == 101) gameGeneration(currentAttempt + 1);
                    }
                } else { // Randomization successful
                    scriptOutput += `Press Enter to continue...`;
                    okay2spitscript = true;
                }
            });
        
            liveOutput.on('error', function(code) { // An error occured
                console.log('error:', code);
                scriptOutput += `The command errored out with ${code} after ${currentAttempt} ${sForWord('attempt', currentAttempt)}.\r\nPress Enter to continue...`;
                okay2spitscript = true;
            });
        }
        if (writeALBWFile(req, versions, randoPath, req.query.writeNewPreset, command)) { // preps ALBW stuff and then generates a game.
            scriptOutput += `Running Command: cd ${command.join(' ')}\r\n`;
            okay2spitscript = true;
            gameGeneration(1, 100);
        } else { // whoops
            scriptOutput += `An unknown error occured while writting the required stuff to ${randoPath}.\r\nPress Enter to continue...`;
            okay2spitscript = true;
        }
    } catch (err) { // Something happened
        console.error(err)
        return res.status(500).json({
            error: {
                message: err.toString(),
                data: err
            }
        });
    }
})
// Gets a version from the paramaters
.get('/execVersions/:sourceVersion/:v', (req, res) => {
    const versionsPath = `./sourcecodes/${req.params.sourceVersion}${
        req.params.sourceVersion == "dev" ? `/${req.headers['x-forwarded-for'] || 'localhost'}` : ''
    }/${req.params.v}/versions.json`
    res.json(fs.existsSync(versionsPath) ? JSON.parse(fs.readFileSync(versionsPath)) : {})
})
// gets randomizer status (obviously)
.get('/randomizationStatus', (req, res) => {
    const interval = setInterval(() => {
        if (okay2spitscript) okay2spitscript = false, clearInterval(interval), res.send(scriptOutput);
    }, 1)
})
// Generates a zip for a randomized game
.post('/genZipFromRandomizedGame', genGameZip);
// functions
function decodeSettingsToml(info = {}, tomlFile, randoPath) { // Decodes some preset settings in a toml format (Work in progress).
    let tomlString = fs.readFileSync(tomlFile).toString('utf-8'), commentCount = 0, settingsCat;
    const exclude = fs.existsSync(path.join(randoPath, 'excludableChecksList.yaml')) ? yaml.parse(
        fs.readFileSync(path.join(randoPath, 'excludableChecksList.yaml')).toString('utf8')
    ) : {}
    const exclusions = fs.existsSync(path.join(randoPath, 'excludableChecksList.json')) ? JSON.parse(
        fs.readFileSync(path.join(randoPath, 'excludableChecksList.json'))
    ) : {}
    const optionTypes = {
        Skippable: ['Unchanged', 'Shuffled', 'Skip'],
        Progression: ['Unchanged', 'Shuffled']
    }, wordOptions = {
        captains_sword: optionTypes.Skippable,
        borrowed_sword: optionTypes.Progression,
        lamp: optionTypes.Progression,
        first_bracelet: optionTypes.Skippable,
        barrier: ['Unchanged', 'Start'],
        mode: ["Normal", "Hard", "GlitchBasic", "GlitchAdvanced", "GlitchHell", "NoLogic"]
    }, comments = [];
    info.settings = {};
    info.notes = [];
    for (const line of tomlString.split("\r").join('').split("\n")) {
        if (!line) continue;
        if (line.startsWith("## ")) comments.push(line.substring(3));
        if (line.startsWith("[") && line.endsWith("]")) {
            settingsCat = line.substring(1).slice(0, -1);
            if (!settingsCat.includes(".")) {
                const json = info.settings[settingsCat] = {};
                if (comments[commentCount]) {
                    json.comment = comments[commentCount];
                    commentCount++;
                }
                switch (settingsCat) {
                    case "exclude": {
                        info.settings.exclude.useCheckmarks = true;
                        info.settings.exclude.defaultValue = {};
                        info.settings.exclude.allOptions = exclude.layout;
                        let exclusiveCat;
                        const exclusiveSubstring = tomlString.substring(tomlString.indexOf(`[exclude]`));
                        let p = exclusiveSubstring.indexOf("##");
                        while (p > -1) {
                            const n = p + 2;
                            const string = exclusiveSubstring.substring(n);
                            const line = string.split('\r').join('').split('\n')[0]
                            if (line.startsWith("[") && line.endsWith("]") && line.includes(".")) {
                                exclusiveCat = line.substring(1).slice(0, -1).split(".")[1];
                                info.settings.exclude.defaultValue[exclusiveCat] = {};
                            } else if (line.includes("' = ")) {
                                const [key, value] = line.split("'").join("").split(" = ");
                                const stringArray = string.substring(string.indexOf(`'${key}' = ${value}`) + (key.length + 5)).split("##").join('').split("]")[0] + ']';
                                info.settings.exclude.defaultValue[exclusiveCat][key] = stringArray.substring(1).slice(0, -1).split('\r').join('').split('\n').join('').split(",").map(v => v.split("'").join('').substring(4));
                            }
                            p = exclusiveSubstring.indexOf("##", n);
                        }
                        break;
                    } case "exclusions": {
                        const line = tomlString.substring(tomlString.indexOf(`[exclusions]`)).split("\r").join('').split("\n")[1]
                        Object.assign(info.settings.exclusions, {
                            exclusions: {
                                useCheckmarks: true,
                                defaultValue: JSON.parse(line.substring(15)),
                                allOptions: exclusions
                            }
                        });
                        break;
                    }
                }
            }
        } 
        if (line.includes(" = ") && !line.startsWith('"exclusions" = [')) {
            const [key, value] = line.split(" = ");
            if (settingsCat) {
                if (!settingsCat.includes(".")) setInfo(info.settings[settingsCat]);
            } else info[key] = tomlValue(value);
            function tomlValue(value) {
                return (value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")) ? value.substring(1).slice(0, -1) : value;
            }
            function setInfo(json) {
                json[key] = {
                    defaultValue: tomlValue(value)
                };
                if (comments[commentCount]) {
                    json[key].comment = comments[commentCount];
                    commentCount++
                }
                if (wordOptions[key]) json[key][typeof wordOptions[key] == "number" ? 'rangeNumOptionsTo' : 'allOptions'] = wordOptions[key];
                else json[key].useBooleanOptions = true;
            }
        }
    }
    return info;
}
function deleteALBWStuff(req, randoPath) { // deletes any existing albw stuff after game randomization
    let config;
    switch (req.query.v) {
        case "albw": config = "albw";
        case "z17-local": {
            const t = config || 'z17';
            const configFolder = path.join(randoPath, `${t}-randomizer/config`);
            if (
                fs.existsSync(path.join(configFolder, `presets/${req.query.id}.toml`)) && req.query.deletePreset
            ) fs.unlinkSync(path.join(configFolder, `presets/${req.query.id}.toml`))
            config = decodeSettingsToml({}, path.join(configFolder, `Rando.toml`), randoPath);
            fs.rmSync(path.join(process.env.APPDATA, `${t}-randomizer`), {
                recursive: true, 
                force: true 
            });
            break;
        } 
        case "z17r":
        case "z17-rando": {
            config = decodeSettingsToml({}, path.join(randoPath, 'config.toml'), randoPath);
            const presetFile = path.join(randoPath, `presets/${req.query.id}.toml`);
            if (req.query.deletePreset && fs.existsSync(presetFile)) fs.unlinkSync(presetFile);
            break;
        } default: {
            config = fs.existsSync(path.join(randoPath, 'config.json')) ? JSON.parse(fs.readFileSync(path.join(randoPath, 'config.json'))) : {
                rom: 'albw.3ds',
                output: 'generated'
            };
            const presetFile = path.join(randoPath, `presets/${req.query?.id}.json`);
            if ((req.query.deletePreset || fs.existsSync(`./uploads/${req.query?.id}.json`)) && fs.existsSync(presetFile)) fs.unlinkSync(presetFile);
            break;
        } 
    }
    const outputFolder = path.join(randoPath, config.output);
    const rom = path.join(randoPath, config.rom)
    if (fs.existsSync(outputFolder)) fs.rmSync(outputFolder, {
        recursive: true, 
        force: true 
    });
    if (fs.existsSync(rom)) fs.renameSync(rom, `./uploads/rom-${Buffer.from(req.headers['x-forwarded-for'] || 'localhost').toString('base64')}.3ds`);
}
async function genGameZip(req, res) { // Function to generate a randomized game zip file
    function handleError(e) { // Error handler
        console.error(e);
        if (req.headers.connection != "upgrade") res.status(404);
        res.send(e.toString());
    }
    if (!userIsRandomizingGame) return handleError("Someone needs to randomize ALBW in order to generate a zip file.")
    userIsRandomizingGame = false;
    try { // Generate to see what happens
        const zip = new JSZip();
        let randoPath = path.join(__dirname, 'sourcecodes', req.query.sourceVersion);
        if (req.query.sourceVersion == "dev") randoPath = path.join(randoPath, req.headers['x-forwarded-for'] || 'localhost');
        randoPath = path.join(randoPath, req.query.v);
        function c(l, k) {
            for (const file of fs.readdirSync(l)) {
                const filepath = path.join(l, file);
                const fileStats = fs.lstatSync(filepath);
                if (fileStats.isDirectory()) c(filepath, k.folder(file))
                else k.file(file, fs.readFileSync(filepath))
            }
        }
        let config;
        switch (req.query.v) {
            case "z17r":
            case "z17-rando": {
                config = decodeSettingsToml({}, path.join(randoPath, 'config.toml'), randoPath)
                break;
            } 
            case "albw": config = 'albw';
            case "z17-local": {
                config = decodeSettingsToml(
                    {}, 
                    path.join(randoPath, `${config || 'z17'}-randomizer/config/Rando.toml`),
                    randoPath
                );
                break;
            } default: config = JSON.parse(fs.readFileSync(path.join(randoPath, 'config.json')));
        }
        c(path.join(randoPath, config.output), zip);
        deleteALBWStuff(req, randoPath);
        res.send(await zip.generateAsync({type:"nodebuffer"}))
    } catch (e) { // whoops
        handleError(e);
    }
}
function writeALBWFile(req = {}, versions = {}, randoPath, writeNewPreset = false, command = [], res = {
    send() {}
}) { // Writes down important stuff before albw randomization to prevent common problems that users face.
    try {
        if (req.query.execV?.includes("--")) return true;
        function string2boolean(s) { // Converts a string to a boolean
            switch (s) {
                case "true": return true;
                case "false": return false;
                default: {
                    if (isNaN(Number(s))) return s;
                    return Number(s);
                }
            }
        }
        function writeOldToml() { // Pretty much converting json to toml which is slightly easier than doing this vice-versa thing.
            let toml = '';
            for (const i in req.query.settings) {
                toml += `[${i}]\r\n`;
                if (i == "exclude") for (const i in req.query.settings.exclude) {
                    toml += `[${i}]\r\n`;
                    const keys = Object.keys(req.query.settings.exclude[i])
                    for (let b = 0; b < keys.length; b++) {
                        const array = req.query.settings.exclude[i][keys[b]];
                        const array2 = [];
                        for (const info of array) array2.unshift(Object.keys(info)[0]);
                        toml += `'${keys[b]}' = [\r\n`;
                        for (var h = 0; h < array.length; h++) toml += `    '${array2[h]}'${h < array2.length - 1 ? ',\r\n' : ''}`;
                        toml += `\r\n]\r\n`;
                    }
                }
                else if (i == "exclusions") toml += `"exclusions" = ${JSON.stringify(req.query.settings.exclusions?.exclusions || [], null, "\t")}\r\n`
                else for (const c in req.query.settings[i]) toml += `${c} = ${
                    typeof string2boolean(req.query.settings[i][c]) == "string" ? `'${req.query.settings[i][c]}'` : req.query.settings[i][c]
                }\r\n`;
            }
            return toml;
        }
        let config;
        switch (req.query.v) { // assigns stuff to the config variable based off of source versions.
            case "z17r":
            case "z17-rando": {
                config = decodeSettingsToml({}, path.join(randoPath, 'config.toml'), randoPath);
                if (
                    req.query.settings && typeof req.query.settings == "object" && writeNewPreset
                ) fs.writeFileSync(path.join(randoPath, `presets/${req.params.id}.toml`), writeOldToml());
                if (req.params?.id && req.params.type == "randomizer") command.push(`--preset ${req.params.id}`);
                break;
            } case "albw": {
                config = "albw";
                if (versions[req.query.execVersion]?.useVerbose && !req.query.noVerbose) command.push(`--verbose`);
            } case "z17-local": {
                const t = config || "z17";
                const builtRandoConfigFolder = path.join(randoPath, `${t}-randomizer/config`);
                config = decodeSettingsToml({}, path.join(builtRandoConfigFolder, `Rando.toml`), randoPath);
                if (req.query.settings && typeof req.query.settings == "object" && writeNewPreset) {
                    const presetFile = path.join(builtRandoConfigFolder, `presets/${req.params.id}.toml`);
                    if (!fs.existsSync(presetFile)) fs.writeFileSync(presetFile, writeOldToml());
                }
                if (req.params?.id && req.params.type == "randomizer") command.push(`--preset ${req.params.id}`);
                function c(k) {
                    const folderpath = path.join(randoPath, k);
                    for (const j of fs.readdirSync(folderpath)) {
                        const filepath = path.join(folderpath, j);
                        const stats = fs.lstatSync(filepath);
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
                            c(p);
                        } else fs.writeFileSync(path.join(process.env.APPDATA, k, j), fs.readFileSync(path.join(randoPath, k, j)));
                    }
                }
                c(`${t}-randomizer`)
                break;
            } default: {
                const info = req.query.v == "z17v3" ? (() => {
                    if (req.query?.settings?.exclusions?.exclusions) req.query.settings.exclusions.exclusions = Object.keys(req.query.settings.exclusions.exclusions);
                    return req.query.settings
                })() : (() => {
                    if (req.query?.settings?.user_exclusions) req.query.settings.user_exclusions = Object.keys(req.query.settings.user_exclusions);
                    if (req.query?.settings?.exclusions) req.query.settings.exclusions = Object.keys(req.query.settings.exclusions);
                    return req.query;
                })()
                const presetFolder = path.join(randoPath, 'presets');
                const presetFile = path.join(presetFolder, req.params?.id || './');
                if (info && typeof info == "object" && writeNewPreset) {
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
                } else if ( 
                    // with the preset editor disabled, I want to keep the same settings in tact so that the preset is truely playable for the user
                    // Especially if it's an uploaded spoiler log preset that the creator shared that is meant to get the user playing the uploaded preset
                    // with the same item checks, hint locations, and etc.
                    // This means that we can't be changing the preset version from it's original to the one that's provided by the user.
                    // I found that doing that will not leave the hash alone meaning that the user will be dissapointed once they find out that the seed isn't the
                    // same like the one that is provided.
                    !fs.existsSync(presetFile) && fs.existsSync(`./uploads/${req.params?.id}.json`)
                ) fs.copyFileSync(`./uploads/${req.params.id}.json`, `${presetFile}.json`);
                config = JSON.parse(fs.readFileSync(path.join(randoPath, 'config.json')));
                if (req.params?.id && req.params.type == "randomizer") command.push(`--preset ${req.params.id}`);
            }
        }
        const outputPath = path.join(randoPath, config.output);
        if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath);
        fs.renameSync(`./uploads/rom-${Buffer.from(req.headers['x-forwarded-for'] || 'localhost').toString('base64')}.3ds`, path.join(randoPath, config.rom));
        return true
    } catch (e) {
        console.log(e);
        res.send(e.toString());
        return false;
    }
}


const PORT = process.env.PORT || 80;

server.listen(PORT, () => { // listens to the server
    console.log(`Server is running on port ${PORT}`);
    setInterval(() => {
        if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');
        //const romFiles = f
    }, 66677788);
});
