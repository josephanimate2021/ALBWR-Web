/**
 * A Script File for the ALBWR Tracker
 */

// Toggles an element to show and hide
let connected2archipelago = false, spoiler;
function toggle(id, display = "flex") {
    const elem = document.getElementById(id);
    elem.style.display = elem.style.display == display ? 'none' : display;
}

function switchTrackerMode(type, originalDisplaysetting = {}) { // loads the map and items by default
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
                        if (info.completed) drawer.strokeStyle = 'grey';
                        else if (!info.unlockedByDefault) drawer.strokeStyle = 'brown';
                        drawer.stroke();
                    }
                }
            }
        }
    }
    const items = document.getElementById('gameItems');
    function getItems(h = false) { 
        items.innerHTML = '';
        const cats = {
            gear: "Gear Items",
            items: "Progression Items",
            others: "Other Items"
        }
        if (!h) {
            items.style.display = "block";
            for (const type in cats) {
                const display = type != "items" ? originalDisplaysetting[type] || 'none' : 'flex';
                console.log(display);
                let html = `<h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
                    <span>${cats[type]}</span>
                    <a class="link-secondary" href="javascript:toggle('${type}Cat')">
                        <svg id="plus-circle" viewBox="0 0 16 16" class="bi">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        </svg>
                    </a>
                </h6><ul class="nav flex-row" id="${type}Cat" style="display: ${display};">`;
                for (const item in checkItems) {
                    if (checkItems[item].cat == type) {
                        html += `<li class="nav-item" title="${!checkItems[item].dontSayTitle ? item : ''}">
                            <a id="${checkItems[item].id}" class="nav-link d-flex align-items-center gap-2" href="javascript:;" onclick="retrievedItem('${checkItems[item].id}', '${type}', 'flex')">
                                <img src="/tracker/images/${type}/${checkItems[item].id}${
                                    checkItems[item].counts != undefined && checkItems[item].hasImageWithCount ? `-${
                                        checkItems[item].counts[1] == 0 && !checkItems[item].startImageCountAt0 ? 1 : checkItems[item].counts[1]
                                    }` : ''
                                }.png" alt="${item}"${!checkItems[item].obtained ? ` class="gameItemNotObtained"` : ''}/>
                                ${!checkItems[item].counts || checkItems[item].dontShowCount ? '' : checkItems[item].counts[1] || checkItems[item].counts[0]}
                            </a>
                        </li>`;
                    }
                }
                items.insertAdjacentHTML("beforeend", html + '</ul>');
            }
        } else items.style.display = "none";
    }
    for (const elem of document.getElementsByClassName('trackerOption')) elem.classList.remove('active');
    document.getElementById(type).classList.add('active');
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
            getItems(true);
            break;
        }
    }
}
function findCheckItem(itemId) {
    for (const item in checkItems) {
        if (checkItems[item].id == itemId) return checkItems[item];
    }
    return false;
}
function retrievedItem(itemId, cat, displaySetting) {
    const info = {};
    if (cat && displaySetting) info[cat] = displaySetting;
    const itemInfo = findCheckItem(itemId);
    if (itemInfo) {
        if (itemInfo.counts) {
            let [start, current, limit] = itemInfo.counts;
            if (current != undefined && limit != undefined) {
                if (current == limit) {
                    itemInfo.counts[1] = start;
                    itemInfo.obtained = false;
                } else {
                    itemInfo.obtained = true;
                    itemInfo.counts[1]++;
                }
            } else {
                itemInfo.obtained = true;
                itemInfo.counts[0]++;
            }
        } else itemInfo.obtained = !itemInfo.obtained;
        switchTrackerMode(document.getElementById('tracker').getAttribute("data-mode"), info);
    }
}
// clears a message upon modal close for connecting to an archipelago server.
$("#archipelagoConnector").on("hidden.bs.modal", e => $(e.target).find("p").text(''));

function archipelagoConnector(obj) { // Connects to an Archipelago server
    $(obj).find("p").text('')
    if (connected2archipelago) { // disconnects from the archipelago server when the user clicks on the Disconnect From Archipelago button.
        if ($(obj).find('button[type="submit"]').data("connected")) jQuery(obj).trigger("archipelagoDisconnect");
        else $(obj).find("p").css("color", "red").text('Please wait for the archipelago server to be fully connected before you disconnect.')
    } else { // Starts the connection to the Archipelago server.
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
            console.error(e);
            $(obj).find("p").css("color", "red")
            $(obj).find("p").html(`Failed to connect to Archipelago's WebSockets.<br>${e.toString()}`);
        }
        try {
            const info = Object.fromEntries(new URLSearchParams($(obj).serialize()));
            const socket = new WebSocket(`${info.host.startsWith("localhost") || info.host.startsWith("127.0.0.1") ? 'ws' : 'wss'}://${info.host}`);
            setTimeout(() => {
                if (!connectionSuccessful) {
                    socket.close();
                    handleError("Timeout occured. Please try again later.")
                }
            }, 35042)
            let roomInfo;
            socket.addEventListener("message", async e => {
                const array = JSON.parse(e.data);
                for (const info2 of array) {
                    switch (info2.cmd) {
                        case "RoomInfo": {
                            if (!info2.password || info.password) {
                                roomInfo = info2;
                                roomInfo.tags.push("Tracker");
                                info2.password = !info.password ? info2.password : info.password;
                                info2.cmd = "GetDataPackage";
                            } else {
                                handleError("Please enter in the password");
                                $(obj).append(`<label for="password">Password</label><input class="form-control" type="password" id="password" name="password" required/>`);
                            }
                            break;
                        } case "DataPackage": {
                            spoiler = {
                                locations: {},
                                items: {}
                            };
                            const games = info2.data.games;
                            function uuidGenV4() { // generates a v4 UUID for archipelago
                                const G = [];
                                for (let Q = 0; Q < 36; Q++) G.push(Math.floor(Math.random() * 16));
                                return G[14] = 4, G[19] = G[19] &= -5, G[19] = G[19] |= 8, G[8] = G[13] = G[18] = G[23] = "-", G.map((Q) => Q.toString(16)).join("")
                            }
                            for (const game in games) {
                                if (game == "Archipelago") continue;
                                Object.assign(info2, {
                                    cmd: "Connect",
                                    password: info.password || "",
                                    name: info.user,
                                    game,
                                    slot_data: true,
                                    items_handling: 7,
                                    uuid: uuidGenV4(),
                                    tags: roomInfo.tags,
                                    version: roomInfo.version,
                                });
                                for (const location in games[game].location_name_to_id) {
                                    spoiler.locations[location] = Object.assign({
                                        id: games[game].location_name_to_id[location]
                                    }, checkLocations[location] || {});
                                }
                                for (const item in games[game].item_name_to_id) {
                                    spoiler.items[item] = Object.assign({
                                        id: games[game].item_name_to_id[item]
                                    }, checkItems[item] || {});
                                }
                            }
                            break;
                        } case "Connected": {
                            jQuery(obj).bind("archipelagoDisconnect", () => {
                                $(obj).find('button[type="submit"]').attr("data-connected", false);
                                socket.close();
                                $(obj).find('button[type="submit"]').text(originalText);
                                $("#statusKindof").html(originalText2);
                                connected2archipelago = false;
                                connectionSuccessful = false;
                                $(obj).find("p").text('Successfully disconnected from the Archipelago Server')
                            })
                            connectionSuccessful = true;
                            $("#statusKindof").text("Connected To Archipelago")
                            $(obj).find("p").css("color", "lime");
                            $(obj).find('button[type="submit"]').attr("data-connected", true);
                            $(obj).find('button[type="submit"]').attr("disabled", false);
                            $(obj).find('button[type="submit"]').text("Disconnect From Archipelago");
                            $(obj).find("p").text(`Successfully connected to the Archipelago server!`);
                            break;
                        } case "ReceivedItems": {
                            // I will begin working on this once the tracker fully works because right now i don't feel comftable inplmenting this feature 
                            // due to the current instability issues that are going on with the tracker right now.
                        }
                    }
                }
                if (!connectionSuccessful) socket.send(JSON.stringify(array))
                /*if (typeof e.data == "string" && connectionSuccessful) {
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
                }*/
            })
        } catch (e) {
            handleError(e);
        }
    }
}

function findCheckLocation(f) {
    for (const i in checkLocations) if (checkLocations[i][f]) return {
        info: checkLocations[i][f],
        cat: i
    };
    return false;
}

function displayAlert(type, msg) {
    $("#alertBlock").html(`<div class="alert alert-${type} alert-dismissible" role="alert">
        ${msg}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`);
}