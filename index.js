// modules
import express from 'express';
import fs from 'fs';

// create the express app
const app = express();

// functions

/**
 * Takes some contents from inside a folder or file and converts it into JSON for WebContainers api to use if needed.
 * Otherwise, the WebContainers snapshot module will be used in most cases.
 * @param {string} folder 
 * @param {boolean} noContentsOnAllFiles
 * @param {string} contentType 
 * @returns {JSON}
 */
function JSONFileSystem(folder, noContentsOnAllFiles = false) { 
    const info = {};
    for (const file of fs.readdirSync(folder)) {
        const info2 = info[file] = {};
        const stats = fs.statSync(`${folder}/${file}`);
        info2[stats.isDirectory() ? 'directory' : 'file'] = stats.isDirectory() ? JSONFileSystem(`${folder}/${file}`, noContentsOnAllFiles) : {
            contents: !noContentsOnAllFiles && file.includes(".") ? fs.readFileSync(`${folder}/${file}`, 'utf8') : ''
        }
    }
    return info;
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

// add functions for all requests.
app.use(express.static("./pages", {
    setHeaders(res, path) {
        res.set('Cross-Origin-Embedder-Policy', 'require-corp');
        res.set('Cross-Origin-Opener-Policy', 'same-origin');
    }
})).post("/JSONFileSystem", async (req, res) => {
    res.json(JSONFileSystem(req.query.folder, !req.query.showContents))
}).post('/builds', (req, res) => {
    const buildFiles = JSONFileSystem('./builds');
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
                        buildFiles[i].directory['excludableChecksList.json'].file.contents, "base64"
                    ).layout
                    if (!info2.version) {
                        const versionNum = i.split("-")[0];
                        Object.assign(info2, {
                            presetName: file.substring(0, file.lastIndexOf(".")).split("_").map(capitalizeWord).join(' '),
                            version: `${versionNum}${
                                i.substring(versionNum.length).startsWith('-') ? ` -${i.substring(versionNum.length).split("-").map(capitalizeWord).join(' ')}` : ''
                            }`
                        });
                    }
                    info[i].presets.unshift(info2);
                }
            }
        }
    }
    res.json(info);
}).post('/buildFiles/get/:version', (req, res) => {
    res.end(fs.readFileSync(`./builds/${req.params.version}/${req.query.filename}`));
})

// listen to the server on a specified port.
const port = 80;
app.listen(port, e => {
    console.log("The server is listening on port", port);
})