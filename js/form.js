document.getElementById('fileInput').addEventListener('change', function() {
    const filename = this.files[0]?.name;
    const ext = filename?.substring(filename?.lastIndexOf(".") + 1) || '';
    document.getElementById('fileName').innerHTML = this.files?.length == 1 ? selectedFileHTML(this.files[0].name, ext) : 'Please select a file';
    document.getElementById('uploadButtonChunk').disabled = this.files?.length < 1 || ext != "3ds";
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

function selectedFileHTML(fileName, ext) {
    if (ext == "3ds") return `<p>Selected file:</p>` + `<p style="font-weight: 500 !important;">${fileName}</p>`
    if (fileName) return 'Invalid File Type! please upload a .3ds file instead.'
}

function handleDragLeave(event) {
    event.preventDefault();
    dropArea.style.backgroundColor = '';
}

function handleDrop(event) {
    event.preventDefault();
    dropArea.style.backgroundColor = '';
    const files = event.dataTransfer.files;
    const ext = files[0]?.name.substring(files[0]?.name.lastIndexOf(".") + 1) || ""
    document.getElementById('fileName').innerHTML = files?.length == 1 ? selectedFileHTML(files[0].name, ext) : 'Please select a file';
    document.getElementById('uploadButtonChunk').disabled = files?.length < 1 || ext != "3ds";
    if (files.length == 1) {
        fileInput.files = files; // Set files for the input element
        
        handleFileSelect({ target: { files } }); // Call handleFileSelect function with the files
    } else if (fileInput.files) delete fileInput.files;
}

function setBar(percent) {
    const progressBar = document.getElementById('progressBar');
    const progressBarInner = document.getElementById('progressBarInner');

    progressBar.style.display = 'block';

    if (percent === 101) {
        progressBar.innerHTML = `<p> Upload complete! Refreshing the page... </p>`;
        window.location.reload();
        return;
    }

    progressBarInner.style.width = `${percent}%`;
    progressBarInner.innerHTML = `${percent}%`;
}
