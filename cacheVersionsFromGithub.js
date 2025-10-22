import https from 'https';
import fs from 'fs';

/*
writes down the release versions of the albw randomizer to the versions_github.json file which will be located in the public folder for easy web access. 
This prevents the user from accidently using GitHub api's rate limit.
*/
https.get("https://api.github.com/repos/rickfay/z17-randomizer/releases", {
    headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0"
    }
}, res => {
    const buffers = [];
    res.on("data", d => buffers.push(d)).on("end", () => {
        fs.writeFileSync('./public/versions_github.json', Buffer.concat(buffers).toString());
    })
})

/*
writes down the release versions of the albw randomizer to the versions.json file which will be located in the public folder for easy web access. 
This prevents the user from accidently using Gitlab api's rate limit.
*/
https.get("https://gitlab.com/api/v4/projects/25946625/releases", {
    headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0"
    }
}, res => {
    const buffers = [];
    res.on("data", d => buffers.push(d)).on("end", () => {
        fs.writeFileSync('./public/versions_gitlab.json', Buffer.concat(buffers).toString());
    })
})