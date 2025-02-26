const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const {spawn} = require("child_process");
const JSZip = require("jszip");
let scriptOutput = '', okay2spitscript = false, userIsRandomizingGame = false, sessions = {};

const app = express();
app.use((req, res, next) => {
    sessions[req.headers['x-forwarded-for']] = sessions[req.headers['x-forwarded-for']] || {};
    console.log(req.method, req.url, req.query);
    next();
});

// The folder having the views
app.use(express.static(path.join(__dirname, 'views')));

// The folder containing the static files
const publicDirectoryPath = path.join(__dirname, 'public');

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
        if (sessions[req.headers['x-forwarded-for']] && sessions[req.headers['x-forwarded-for']].threeDsBuffer) return res.status(302).setHeader(
            "Location", `/?fileUploaded=true`
        ).end();
    } else {
        if (!sessions[req.headers['x-forwarded-for']] || !sessions[req.headers['x-forwarded-for']].threeDsBuffer) return res.status(302).setHeader(
            "Location", `/`
        ).end();
    }
    res.sendFile(path.join(__dirname, 'views', 'uploadForm.html'));
}).get('/deleteFile', (req, res) => {
    delete sessions[req.headers['x-forwarded-for']].threeDsBuffer;
    res.writeHead(302, '', {
        location: req.headers.referer
    });
    res.end();
}).get('/settings/:v', (req, res) => {
    const info = {}
    const presets = [];
    /*for (const file of fs.readdirSync('./uploads').filter(i => i.startsWith(`settingsPreset-${req.params.v}-`) && i.endsWith(".json"))) {
        const info = JSON.parse(fs.readFileSync(`./uploads/${file}`));
        info.id = file.split("-")[2];
        presets.unshift(info);
    }*/
    const randoPath = path.join(__dirname, `./sourcecodes/stable/${req.params.v}-randomizer`);
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
                    allOptions: JSON.parse(fs.readFileSync('./albwrVer-excludableChecksList.json'))
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
        } case "z17": {
            info.presetName = "Default z17 ALBWR Template";
            let json = fs.readFileSync(`${randoPath}/presets/Example.json`).toString('utf-8');
            const wordOptions = {
                logic_mode: ["Normal", "Hard", "Glitched", "AdvGlitched", "Hell", "NoLogic"],
                ped_requirement: ["Vanilla", "Charmed", "Standard"],
                hyrule_castle_setting: ["EarlyLoruleCastle" , "Closed"],
                lc_requirement: 7,
                hint_ghost_price: 9999
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
            info.notes = [comments[0]];
            info.settings = JSON.parse(json);
            for (const settingCat in info.settings) {
                for (const settingName in info.settings[settingCat]) {
                    const defaultValue = info.settings[settingCat][settingName];
                    const info2 = {
                        comment: comments[commentCount],
                        defaultValue
                    }
                    if (settingName == "exclusions") {
                        info2.userCanAddNewLines = true;
                        info2.allOptions = JSON.parse(fs.readFileSync(`${randoPath}/excludableChecksList.json`));
                    }
                    switch (typeof info.settings[settingCat][settingName]) {
                        case "boolean": {
                            info2.useBooleanOptions = true;
                            break;
                        } default: {
                            if (
                                wordOptions[settingName]
                            ) info2[typeof info.settings[settingCat][settingName] == "number" ? 'rangeNumOptionsTo' : 'allOptions'] = wordOptions[settingName]
                        }
                    }
                    info.settings[settingCat][settingName] = info2;
                    commentCount++
                }
            }
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
        const randoPath = path.join(__dirname, `./sourcecodes/stable/${req.query.v}-randomizer`);
        let file = "albw-randomizer";
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
                if (i == "exclude") {
    
                } else if (i == "exclusions") toml += `"exclusions" = ${JSON.stringify(req.query.settings.exclusions.exclusions, null, "\t")}\r\n`
                else for (const c in req.query.settings[i]) toml += `${!newToml ? `# ` : ''}${c} = ${
                    typeof string2boolean(req.query.settings[i][c]) == "string" ? `'${req.query.settings[i][c]}'` : req.query.settings[i][c]
                }\r\n`;
            }
            return toml;
        }
        const presetFile = `${randoPath}/presets/${req.params.id}`;
        scriptOutput += `${req.query.v} randomizer stable is running${req.query.execVersion ? ` on version ${req.query.execVersion}` : ''}.\r\n`;
        if (req.query.execVersion) file += `-${req.query.execVersion}`;
        const versionsFile = `${randoPath}/versions.json`;
        const versions = fs.existsSync(versionsFile) ? JSON.parse(fs.readFileSync(versionsFile)) : {};
        const command = [randoPath, `&& chmod +x ${file} && ./${file}`];
        switch (req.query.v) {
            case "albw": {
                if (versions[req.query.execVersion]?.useVerbose) command.push(`--verbose`);
                if (!fs.existsSync(`${randoPath}/generated`)) fs.mkdirSync(`${randoPath}/generated`);
                fs.writeFileSync(`${randoPath}/albw.3ds`, Buffer.concat(sessions[req.headers['x-forwarded-for']].threeDsBuffer));
                if (req.query.settings && typeof req.query.settings == "object") {
                    fs.renameSync(`${randoPath}/presets/Standard.toml`, `${randoPath}/presets/Standardold.toml`);
                    fs.writeFileSync(`${randoPath}/presets/Standard.toml`, writeOldToml());
                }
                break;
            } case "z17-local": {
                const config = parseTOML(fs.readFileSync(`${randoPath}/z17-randomizer/config/Rando.toml`).toString('utf-8'))
                if (!fs.existsSync(`${randoPath}/${config.output}`)) fs.mkdirSync(`${randoPath}/${config.output}`);
                fs.writeFileSync(`${randoPath}/${config.rom}`, Buffer.concat(sessions[req.headers['x-forwarded-for']].threeDsBuffer));
                if (req.query.settings && typeof req.query.settings == "object") {
                    const presetFile = `${randoPath}/z17-randomizer/config/presets/${req.params.id}.toml`
                    if (!fs.existsSync(presetFile)) fs.writeFileSync(presetFile, writeOldToml());
                }
                command.push(`--preset ${req.params.id}`);
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
                fs.writeFileSync(`${randoPath}/${config.rom}`, Buffer.concat(sessions[req.headers['x-forwarded-for']].threeDsBuffer));
                if (req.query.settings && typeof req.query.settings == "object") fs.writeFileSync(`${randoPath}/presets/${req.params.id}.toml`, writeOldToml(true));
                command.push(`--preset ${req.params.id}`);
                break;
            } case "z17": {
                if (req.query.settings && typeof req.query.settings == "object") {
                    function c(j) {
                        for (const i in j) {
                            if (typeof j[i] == "object") c(j[i])
                            else j[i] = string2boolean(j[i]);
                        }
                    }
                    c(req.query.settings);
                    if (req.params.id && !fs.existsSync(`${presetFile}.json`)) fs.writeFileSync(`${presetFile}.json`, JSON.stringify(req.query.settings, null, "\t"));
                }
                const config = JSON.parse(fs.readFileSync(`${randoPath}/config.json`));
                if (!fs.existsSync(`${randoPath}/${config.output}`)) fs.mkdirSync(`${randoPath}/${config.output}`);
                fs.writeFileSync(`${randoPath}/${config.rom}`, Buffer.concat(sessions[req.headers['x-forwarded-for']].threeDsBuffer));
                command.push(`--preset ${req.params.id}`);
                break;
            }
        }
        console.log(command)
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
    const versionsPath = path.join(__dirname, `./sourcecodes/stable/${req.params.v}-randomizer/versions.json`);
    res.json(fs.existsSync(versionsPath) ? JSON.parse(fs.readFileSync(versionsPath)) : {})
}).get('/randomizationStatus', (req, res) => {
    const interval = setInterval(() => {
        if (okay2spitscript) okay2spitscript = false, clearInterval(interval), res.send(scriptOutput);
    }, 1)
}).post('/genZipFromRandomizedGame', async (req, res) => {
    function handleError(e) {
        console.error(e);
        res.status(500).end(e.toString());
    }
    if (!userIsRandomizingGame) return handleError("Someone needs to randomize ALBW in order to generate a zip file.")
    userIsRandomizingGame = false;
    try {
        const zip = new JSZip();
        const fs = require('fs');
        const randoPath = path.join(__dirname, `./sourcecodes/stable/${req.query.v}-randomizer`);
        function c(l, k) {
            for (const file of fs.readdirSync(l)) {
                const fileStats = fs.lstatSync(`${l}/${file}`);
                if (fileStats.isDirectory()) c(`${l}/${file}`, k.folder(file))
                else k.file(file, fs.readFileSync(`${l}/${file}`))
            }
        }
        switch (req.query.v) {
            case "z17": {
                const config = JSON.parse(fs.readFileSync(`${randoPath}/config.json`));
                const generatedRomFolder = `${randoPath}/${config.output}`;
                c(generatedRomFolder, zip);
                fs.rmSync(generatedRomFolder, {
                    recursive: true, 
                    force: true 
                });
                fs.unlinkSync(`${randoPath}/${config.rom}`);
                const presetFile = `${randoPath}/presets/${req.query.id}.json`;
                if (req.query.deletePreset && fs.existsSync(presetFile)) fs.unlinkSync(presetFile);
                break;
            } 
            case "z17r":
            case "z17-rando": {
                const config = parseTOML(fs.readFileSync(`${randoPath}/config.toml`).toString('utf-8'))
                const generatedRomFolder = `${randoPath}/${config.output}`;
                c(generatedRomFolder, zip);
                fs.rmSync(generatedRomFolder, {
                    recursive: true, 
                    force: true 
                });
                fs.unlinkSync(`${randoPath}/${config.rom}`);
                const presetFile = `${randoPath}/presets/${req.query.id}.toml`;
                if (req.query.deletePreset && fs.existsSync(presetFile)) fs.unlinkSync(presetFile);
                break;
            } case "z17-local": {
                const config = parseTOML(fs.readFileSync(`${randoPath}/z17-randomizer/config/Rando.toml`).toString('utf-8'))
                const generatedRomFolder = `${randoPath}/${config.output}`;
                c(generatedRomFolder, zip);
                fs.rmSync(generatedRomFolder, {
                    recursive: true, 
                    force: true 
                });
                fs.unlinkSync(`${randoPath}/${config.rom}`);
                const presetFile = `${randoPath}/presets/${req.query.id}.toml`;
                if (req.query.deletePreset && fs.existsSync(presetFile)) fs.unlinkSync(presetFile);
                fs.rmSync(path.join(process.env.APPDATA, 'z17-randomizer'), {
                    recursive: true, 
                    force: true 
                });
                break;
            }  case "albw": {
                const generatedRomFolder = `${randoPath}/generated`;
                c(generatedRomFolder, zip);
                fs.rmSync(generatedRomFolder, {
                    recursive: true, 
                    force: true 
                });
                fs.unlinkSync(`${randoPath}/albw.3ds`);
                fs.renameSync(`${randoPath}/presets/Standardold.toml`, `${randoPath}/presets/Standard.toml`)
                break;
            }
        }
        res.end(await zip.generateAsync({type:"nodebuffer"}))
    } catch (e) {
        handleError(e);
    }
});


// Multer storage configuration
const storage = multer.diskStorage({
    destination: 'temps/',
    filename: function (req,file, cb) {
        // Generate the filename 
        const filename =  file.originalname;
        
        cb(null, filename); 
    }
});

const upload = multer({ storage });
const temporary = multer({ dest: 'temps/' });

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const appendFile = promisify(fs.appendFile);


// Route for receiving file chunks
app.post('/documents', upload.single('file'), (req, res) => {
    const msg = `Chunk "${req.body.chunkNumber}" received successfully`;

    console.log(msg);

    // Here if you have the database you can use it to store the files that have been saved in the 'temps' folder
    //..

    res.send(msg);

});


// Route for combining and saving chunks
app.get('/combine', upload.array('files'), async (req, res) => {
    const tempFolder = 'temps/';
    const combinedFileName = req.query.filename;
    sessions[req.headers['x-forwarded-for']].threeDsBuffer = []
    try {
        // Read all files in the temps folder
        const files = await readdir(tempFolder);

        // Filter out only the files with the format `${number}-.-.${combinedFileName}`
        const numberedFiles = files.filter(file => /^\d+-\.-\..+$/.test(file) && file.includes(combinedFileName));

        // Sort files based on the numbers before `-.-.` in their names
        numberedFiles.sort((a, b) => {
            const numA = parseInt(a.split('-.-.')[0]);
            const numB = parseInt(b.split('-.-.')[0]);
            return numA - numB;
        });
        // Combine chunks into a single file
        for (const file of numberedFiles) {
            const filePath = path.join(tempFolder, file);
            sessions[req.headers['x-forwarded-for']].threeDsBuffer.push(await readFile(filePath));
            fs.unlinkSync(filePath);
        }
        res.status(200).send('Files combined and saved successfully.');
    } catch (error) {
        console.error('Error combining files:', error);
        res.status(500).send('Internal Server Error');
    }
})


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
