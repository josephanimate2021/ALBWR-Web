let fileChunks = [];
let fileName = ''; // Variable to store the name of the original file
const totalChunks = 100; // Variable to store the number of chunks

if (localStorage.uploadedFileId) loadSettings(document.getElementById('version').value, s => {
    document.getElementById('step02').style.display = 'block';
    appendSettings(s);
})
else document.getElementById(`step01`).style.display = 'block';

function handleError(t = 'Upload failed! Please try again.', e) { // handles an error
    const progressBar = document.getElementById('progressBar');
    const progressBarInner = document.getElementById('progressBarInner');

    progressBar.style.display = 'none';
    progressBar.classList.remove('progressBarClass');
    progressBar.innerHTML = `<p> ${t} ${e ? e.toString() : ''} </p>`;
    progressBarInner.style.width = `0%`;

    document.getElementById('uploadButtonChunk').disabled = false;
    document.getElementById('uploadButtonChunk').innerHTMML = 'Upload';
    console.error(t, e)
}

// loads randomizer settings
function loadSettings(id, callback) {
    fetch(`/settings?v=${id}`).then(res => res.json()).then(callback);
}
// converts the JSON contents from settings to HTML
function appendSettings(s) {
    document.getElementById('presets').style.display = 'none';
    document.getElementById('presetsSelection').innerHTML = '';
    let html = '';
    for (const d of s) {
        document.getElementById('presetsSelection').insertAdjacentHTML('afterbegin', `<option value="${d.id}">${d.presetName}</option>`);
    }
    document.getElementById('presets').style.display = 'block';
}

// The file input event handler
function handleFileSelect(event) {
    const file = event.target.files[0];
    const fileSize = file.size;

    fileChunks = [];
    fileName = file.name; // Store the name of the original file

    console.log(`File selected: ${fileName}`);
    console.log(`Total file size: ${fileSize} bytes`);
    console.log(`Number of chunks: ${totalChunks}`);

    const chunkSize = Math.ceil(fileSize / totalChunks);

    let start = 0;

    for (let i = 0; i < totalChunks; i++) {
        const chunk = file.slice(start, start + chunkSize);
        fileChunks.push(chunk);
        start += chunkSize;
    }
}

// Function to check if a file was uploaded
function isFileUploaded() {
    return fileInput.files.length == 1;
}

async function uploadChunks() {
    console.log('Uploading chunks...');

    const id = (Math.random()).toString().substring(2);
    const ext = fileName.substring(fileName.lastIndexOf("."));

    // Create an array to hold all the upload promises
    const uploadPromises = [];

    for (let i = 0; i < totalChunks; i++) {
        const formData = new FormData();
        formData.append('file', fileChunks[i], `${i+1}-.-.`+id+ext);
        formData.append('filename',id+ext);
        formData.append('totalChunks', totalChunks);
        formData.append('chunkNumber', i + 1);

        // Send the chunk upload request asynchronously and store the promise
        const uploadPromise = uploadChunk(formData,i+1);

        uploadPromise.then(() => {
            var percentage = ((i + 1) / totalChunks) * 101;
            if(percentage===101){
                percentage=100;
            }
            setBar(percentage); // Call setBar function with the percentage
        });

        uploadPromises.push(uploadPromise);
    }

    // Wait for all upload promises to resolve
    await Promise.all(uploadPromises);
    console.log('All chunks uploaded successfully.');

    fetch(`/combine?filename=${encodeURIComponent(id+ext)}`)
        .then(response => {
            if (!response.ok) return handleError();
            return response.text(); // The response from server(in texts)
        })
        .then(data => {
            // The data from the server
            console.log(`The final response from server: ${data}`);
            localStorage.setItem("uploadedFileId", id);
            setBar(101);
        })
        .catch(error => {
            // Display errors when failed to get response from the server
            handleError('Fetch error:', error);
        });

    
}

async function uploadChunk(formData,progress) {
    try {
        const response = await fetch('/documents', {
            method: 'POST',
            body: formData
        });
        const result = await response.text();
        console.log(`Client Response: The file ${progress} sent to server!`);
        console.log('Server response:', result); // Log the response from the server
    } catch (error) {
        handleError('Error uploading file chunk:', error);
    }
}

// Detect if file was chosen and send to server, if no then show 'file was chosen'
document.getElementById('uploadButtonChunk').addEventListener('click', function(event) {
        // Check if a file was uploaded
    if (isFileUploaded()) {
        setBar(0);
        event.target.disabled = true;
        event.target.innerHTML = 'Uploading File...';
        uploadChunks();
    } else {
        // Do some other actions or show an error message
        handleError('No file was chosen!.');
    }

});

// When file is loaded then quickly save the changes
fileInput.addEventListener('change', handleFileSelect);
