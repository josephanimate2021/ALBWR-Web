const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const app = express();
app.use((req, res, next) => {
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


// Define routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'uploadForm.html'));
}).get('/settings', (req, res) => {
    const presets = [];
    for (const file of fs.readdirSync('./uploads').filter(i => i.startsWith(`settingsPreset-${req.query.v}-`) && i.endsWith(".json"))) {
        const info = JSON.parse(fs.readFileSync(`./uploads/${file}`));
        info.id = file.split("-")[2];
        presets.unshift(info);
    }
    const presetsPath = `./${req.query.v}-randomizer/presets`;
    const newLine = process.platform == "win32" ? "\r" : "" + "\n";
    switch (req.query.v) {
        case "albw": {
            const info = {
                presetName: "Default ALBWR Template",
                id: "albwDefaultTemplate",
                notes: [],
                settings: {}
            };
            let toml = fs.readFileSync(`${presetsPath}/Standard.toml`).toString('utf-8'), settingCat;
            const wordOptions = {
                captains_sword: ['Unchanged', 'Shuffled', 'Skip'],
                borrowed_sword: ['Unchanged', 'Shuffled'],
                lamp: ['Unchanged', 'Shuffled'],
                first_bracelet: ['Unchanged', 'Shuffled', 'Skip'],
                barrier: ['Unchanged', 'Start']
            }
            let p1 = toml.indexOf("## ");
            while (p1 > -1) {
                const [c, s] = toml.substring(p1).split(newLine);
                const setting = s.split("\n")[1]
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
                        allOptions: JSON.parse(fs.readFileSync('./albwrVer-checksThatCanBeExcluded.json'))
                    });
                    const line = setting.split("# ")[1].split(newLine)[0]
                    const key = line.split("[")[1].split("]")[0].split(".")[1];
                    info.settings[settingCat].defaultValue[key] = {};
                    const stuff = toml.substring(p1 + c.length);
                    let p2 = stuff.indexOf("# ");
                    while (p2 > -1) {
                        const n = p2 + 2;
                        const stuff2 = stuff.substring(n);
                        if (!stuff2.startsWith("[") && !stuff2.endsWith("]")) {
                            const unparsedArray = stuff2.split(' = ')[1].split('# ').join('');
                            const words = unparsedArray.split('[' + newLine)[1].split(']')[0].split(',').map(word => word.trim().slice(0, -1).substring(1));
                            words.splice(words.length - 1, 1)
                            info.settings[settingCat].defaultValue[key][stuff2.split("'")[1].split("'")[0]] = words; 
                            p2 = -1;
                        } else p2 = stuff.indexOf("# ", n);
                    }
                } else if (setting.startsWith("# ") && setting.includes(" =") && settingCat) {
                    let val = setting.split(" = ")[1].split(newLine)[0]
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
            presets.unshift(info);
            break;
        } case "z17": {
            const info = {
                presetName: "Default z17 ALBWR Template",
                id: "z17DefaultTemplate"
            };
            let json = fs.readFileSync(`${presetsPath}/Example.json`).toString('utf-8');
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
                        info2.allOptions = JSON.parse(fs.readFileSync('./z17Ver-checksThatCanBeExcluded.json'));
                    }
                    switch (typeof info.settings[settingCat][settingName]) {
                        case "boolean": {
                            info2.useBooleanOptions = true;
                            break;
                        } 
                        case "number": info2.allOptions = ["random"];
                        default: {
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
    res.json(presets.reverse());
})


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
    const uploadFolder = 'uploads/';
    const combinedFileName = req.query.filename;


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
            const data = await readFile(filePath);
            await appendFile(path.join(uploadFolder, combinedFileName), data);
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
