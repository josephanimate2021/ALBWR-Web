// modules
import express from 'express';
import { snapshot } from '@webcontainer/snapshot';
import fs from 'fs';

// create the express app
const app = express();

// functions
function JSONFileSystem(folder) {
    const info = {};
    for (const file of fs.readdirSync(folder)) {
        const info2 = info[file] = {};
        const stats = fs.statSync(`${folder}/${file}`);
        info2[stats.isDirectory() ? 'directory' : 'file'] = stats.isDirectory() ? JSONFileSystem(`${folder}/${file}`) : {
            contents: fs.readFileSync(`${folder}/${file}`, 'utf-8')
        }
    }
    return info;
}

// add functions for all requests.
app.use(express.static("./pages")).get("/webContainerSnapshot", async (req, res) => {
    res.setHeader('content-type', 'application/octet-stream').send(await snapshot(`./${req.query.folder || ""}`));
})

// listen to the server on a specified port.
const port = 80;
app.listen(port, e => {
    console.log("The server is listening on port", port);
})