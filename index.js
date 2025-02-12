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
        presets.unshift(JSON.parse(fs.readFileSync(`./uploads/${file}`)));
    }
    const presetsPath = `./${req.query.v}-randomizer/presets`;
    switch (req.query.v) {
        case "albw": {
            const toml = fs.readFileSync(`${presetsPath}/Standord.toml`).toString('utf-8');
            console.log(toml);
            break;
        } case "z17": {
            presets.unshift(JSON.parse(fs.readFileSync(`./examples/settingsPreset-z17-defaultTemplate.json`)))
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


const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
