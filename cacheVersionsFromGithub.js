import https from 'https';
import fs from 'fs';

/*
writes down the release versions of the albw randomizer to the versions_github.json file which will be located in the public folder for easy web access. 
This prevents the user from accidently using GitHub api's rate limit.
*/
cacheBufferFromTheWeb("https://api.github.com/repos/rickfay/z17-randomizer/releases", './public/versions_github.json')

/*
writes down the release versions of the albw randomizer to the versions.json file which will be located in the public folder for easy web access. 
This prevents the user from accidently using Gitlab api's rate limit.
*/
cacheBufferFromTheWeb("https://gitlab.com/api/v4/projects/25946625/releases", './public/versions_gitlab.json');

// writes down the rust installer script for the randomizer to use later.
cacheBufferFromTheWeb("https://static.rust-lang.org/rustup/rustup-init.sh", './public/rust_installer.sh');

/**
 * Gets a buffer from the webb
 * @param {string} url 
 * @param {string} filepath 
 */
function cacheBufferFromTheWeb(url, filepath) {
    https.get(url, {
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0"
        }
    }, res => {
        const buffers = [];
        res.on("data", d => buffers.push(d)).on("end", () => {
            fs.writeFileSync(filepath, Buffer.concat(buffers).toString());
        })
    })
}