/**
 * A Script File for the ALBWR Tracker
 */

// Toggles an element to show and hide
let toggleStuff = {}, spoiler, connected2archipelago = false;
function toggle(id) {
    const elem = document.getElementById(id);
    elem.style.display = toggleStuff[id] ? 'none' : 'block';
    toggleStuff[id] = elem.style.display == "block";
}

function switchTrackerMode(type) { // loads the map and items by default
    const tracker = document.getElementById('tracker');
    tracker.setAttribute("data-mode", type);
    const drawer = tracker.getContext('2d');
    function drawMap() { // draws a layout 
        const map = document.getElementById('mapIng');
        drawer.drawImage(map, 0, 0);
        for (const location in checkLocations) {
            for (const itemLocation in checkLocations[location]) {
                const info = checkLocations[location][itemLocation];
                if (info.position) {
                    const [x, y] = info.position.toString().split("x");
                    drawer.beginPath();
                    const size = info.small ? 5 : 10
                    drawer.rect(x, y, size, size);
                    drawer.fillStyle = info.completed ? 'gray' : info.unlockedByDefault ? 'lime' : 'red';
                    drawer.fill();
                    if (info.stroke) {
                        if (!info.unlockedByDefault) drawer.strokeStyle = 'brown';
                        else if (info.completed) drawer.strokeStyle = 'grey';
                        drawer.stroke();
                    }
                }
            }
        }
    }
    function getItems() { // loads all of the items using either the uploaded spoiler log or default items file

    }
    for (const elem of document.getElementsByClassName('trackerOption')) elem.classList.remove('active');
    document.getElementById(type).classList.add('active')
    switch (type) {
        case "itemsAndMap": {
            drawMap();
            getItems();
            break;
        } case "items": {
            const canvas = document.getElementById('tracker');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            getItems();
        break;
        } case "map": {
            drawMap();
            break;
        }
    }
}
// clears a message upon modal close for connecting to an archipelago server.
$("#archipelagoConnector").on("hidden.bs.modal", e => $(e.target).find("p").text(''));

function archipelagoConnector(obj) { // Connects to an Archipelago server
    $(obj).find("p").text('')
    if (connected2archipelago) {
        if ($(obj).find('button[type="submit"]').data("connected")) jQuery(obj).trigger("archipelagoDisconnect");
        else $(obj).find("p").css("color", "red").text('Please wait for the archipelago server to be fully connected before you disconnect.')
    } else if (spoiler) {
        const tracker = document.getElementById('tracker');
        let connectionSuccessful = false;
        connected2archipelago = true;
        const originalText = $(obj).find('button[type="submit"]').text();
        const originalText2 = $("#statusKindof").text();
        $("#statusKindof").html('<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status">Connecting To Archipelago...</span>')
        $(obj).find('button[type="submit"]').attr("disabled", "");
        $(obj).find('button[type="submit"]').html('<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status">Connecting To Archipelago...</span>');
        function handleError(e) {
            $("#statusKindof").text(originalText2);
            $(obj).find('button[type="submit"]').attr("disabled", false)
            $(obj).find('button[type="submit"]').text(originalText);
            connected2archipelago = false;
            console.log(e);
            $(obj).find("p").css("color", "red")
            $(obj).find("p").html(`Failed to connect to Archipelago's WebSockets.<br>${e.toString()}`);
        }
        try {
            const socket = new WebSocket(`${window.location.protocol.startsWith("https") ? 'wss' : 'ws'}://${window.location.host}/archipelago?${$(obj).serialize()}`);
            setTimeout(() => {
                if (!connectionSuccessful) {
                    socket.close();
                    handleError("Timeout occured. Please try again later.")
                }
            }, 35042)
            socket.addEventListener("message", e => {
                if (typeof e.data == "string" && connectionSuccessful) {
                    console.log(e.data)
                    const [playerName, term, itemName, idk, location] = e.data.split(",");
                    for (const l in checkLocations) {
                        const info = checkLocations[l][location];
                        if (!info) continue;
                        info.completed = true;
                        switchTrackerMode(tracker.getAttribute("data-mode"));
                    }
                } else if (JSON.parse(e.data).connectionSuccessful) {
                    jQuery(obj).bind("archipelagoDisconnect", () => {
                        $(obj).find('button[type="submit"]').attr("data-connected", false);
                        socket.close();
                        $(obj).find('button[type="submit"]').text(originalText);
                        $("#statusKindof").html(originalText2);
                        connected2archipelago= false;
                        $(obj).find("p").text('Successfully disconnected from the Archipelago Server')
                    })
                    connectionSuccessful = true;
                    $("#statusKindof").text("Connected To Archipelago")
                    $(obj).find("p").css("color", "lime");
                    $(obj).find('button[type="submit"]').attr("data-connected", true);
                    $(obj).find('button[type="submit"]').attr("disabled", false);
                    $(obj).find('button[type="submit"]').text("Disconnect From Archipelago");
                    $(obj).find("p").text(`Successfully connected to the Archipelago server!`);
                }
            })
        } catch (e) {
            handleError(e);
        }
    } else $(obj).find("p").css("color", "red").text("Please upload your spoiler log");
}

function uploadSpoilerLog() { // uploads the spoiler log which will then help make tracking alot easier.
    const link = document.getElementById('uploadSpoilerBtn');
    const href = link.getAttribute("href");
    link.removeAttribute("href");
    const title = link.title;
    link.title = "Your file is currently in process of uploading right now. Please wait before you do anything."
    const linkJquery = $(link);
    const originalText = linkJquery.find("span").text();
    linkJquery.find("span").html('<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status">Uploading Spoiler Log...</span>');
    const file = document.getElementById('logsUploader').files[0];
    function handleError(type, msg) {
        link.title = title;
        link.href = href;
        linkJquery.find("span").text(originalText);
        displayAlert(type, msg);
    }
    if (!file) {
        spoiler = '';
        handleError("warning", "You have deleted your spoiler log from this webpage. Please select a file.")
    } else {
        const reader = new FileReader();
        reader.addEventListener("loadend", e => {
            const info = e.target.result;
            if (file.name.endsWith(".txt")) {
                const excluseParams = {};
                for (const info2 of info.split("\n")) {
                    const [key, value] = info2.split(":");
                    if (!key) continue;
                    if (!value) continue;
                    console.log(key, value.split("  ").join(''));
                }
            } else if (file.name.endsWith(".json") || file.name.endsWith(".yaml")) {
                const info2 = file.name.endsWith(".yaml") ? jsyaml.load(info) : JSON.parse(info);
                console.log(info2);
            } else return handleError("danger", "The file you tried to upload is not supported.")
            handleError("success", "Your spoiler log was uploaded succesasfully")
        });
        reader.readAsText(file);
    }
}

function displayAlert(type, msg) {
    $("#alertBlock").html(`<div class="alert alert-${type}" role="alert">${msg}</div>`);
}