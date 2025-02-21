document.getElementById('fileInput').addEventListener('change', function() {
    document.getElementById('fileName').innerHTML = this.files?.length == 1 ? selectedFileHTML(this.files[0].name) : '';
    document.getElementById('uploadButtonChunk').disabled = this.files?.length < 1;
});

const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');

dropArea.addEventListener('dragover', handleDragOver);
dropArea.addEventListener('dragleave', handleDragLeave);
dropArea.addEventListener('drop', handleDrop);
dropArea.addEventListener('click', () => fileInput.click());

function handleDragOver(event) {
    event.preventDefault();
    dropArea.style.backgroundColor = '#f0f0f0';
}

function selectedFileHTML(fileName) {
    return `<p>Selected file:</p>` + `<p style="font-weight: 500 !important;">${fileName}</p>`
}

function handleDragLeave(event) {
    event.preventDefault();
    dropArea.style.backgroundColor = '';
}

function handleDrop(event) {
    event.preventDefault();
    dropArea.style.backgroundColor = '';
    const files = event.dataTransfer.files;
    document.getElementById('fileName').innerHTML = files?.length == 1 ? selectedFileHTML(files[0].name) : '';
    document.getElementById('uploadButtonChunk').disabled = files?.length < 1;
    if (files.length == 1) {
        fileInput.files = files; // Set files for the input element
        
        handleFileSelect({ target: { files: files } }); // Call handleFileSelect function with the files
    } else if (fileInput.files) delete fileInput.files;
}

// handles file submission
document.getElementById('uploadButtonChunk').addEventListener("click", async function(e) {
    document.getElementById('fileUpload.errorMessage').textContent = '';
    document.getElementById('fileInput').style.display = 'none'
    document.getElementById('fileName').style.display = 'none'
    document.getElementById('dropArea').style.display = 'none'
    function errorMessage(msg) {
        e.target.textContent = "Upload";
        document.getElementById('fileUpload.errorMessage').textContent = msg;
        document.getElementById('fileInput').style.display = 'block'
        document.getElementById('fileName').style.display = 'block'
        document.getElementById('dropArea').style.display = 'block'
    }
    e.target.textContent = "Uploading File...";

    const file = document.getElementById('fileInput').files[0];
    const id = (Math.random()).toString().substring(2);
    const res = await fetch(`/upload?ext=${file.name.substring(file.name.lastIndexOf(".") + 1)}&id=${id}`, {
        method: "POST",
        body: file
    });
    const json = await res.json();
    if (json.success) {
        e.target.textContent = 'Upload complete! Please wait while the page gets refreshed';
        localStorage.setItem("uploadedFileId", id);
        window.location.reload();
    } else errorMessage(json.error.message);
})