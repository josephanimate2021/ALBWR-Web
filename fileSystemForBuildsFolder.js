// modules
import fs from 'fs';

// create the file system for the frontend to handle.
console.log('Creating a File System for the builds folder...');
fs.unlinkSync('./public/builds/versions.json')
function c(f) {
    const info = {};
    for (const file of fs.readdirSync(f)) {
        info[file] = {};
        const stats = fs.statSync(`${f}/${file}`);
        info[file][stats.isDirectory() ? 'directory' : 'file'] = stats.isDirectory() ? c(`${f}/${file}`) : {
            contents: !file.includes('.') ? '' : fs.readFileSync(`${f}/${file}`, 'utf8')
        }
    }
    return info;
}
const tree = c('./public/builds')
fs.writeFileSync(`./public/builds/versions.json`, JSON.stringify(tree, null, '\t'))
console.log('Successfully created the file system! Starting The App...')