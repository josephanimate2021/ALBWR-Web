/**
 * A Script File for the ALBWR Tracker
 */
// Toggles an element to show and hide
let connected2archipelago = false;
function toggle(id, display = "flex") {
    const elem = document.getElementById(id);
    if (id.endsWith("Cat")) document.getElementById('tracker').setAttribute("data-cat", id.split("Cat")[0]);
    elem.style.display = elem.style.display == display ? 'none' : display;
}
const trackerStuff = {};
function loadTracker(t, s = 'itemsAndMap') {
    for (const i in trackerStuff) delete trackerStuff[i];
    for (const i in t) trackerStuff[i] = t[i];
    switchTrackerMode(s)
}
function switchTrackerMode(type, j, loadLayouts = ["Hyrule", "Lorule", "Dungeons"]) { // loads the map and items by default
    const tracker = document.getElementById('tracker');
    j ||= !tracker.getAttribute("data-cat") ? "Progression Items" : tracker.getAttribute("data-cat");
    tracker.setAttribute("data-mode", type);
    tracker.setAttribute("data-cat", j);
    const drawer = tracker.getContext('2d');
    function drawMap() { // draws a layout 
        const map = document.getElementById('mapIng');
        drawer.drawImage(map, 0, 0);
        for (const locationType in trackerStuff.layout) {
            if (loadLayouts.findIndex(i => i == locationType) != undefined) for (const location in trackerStuff.layout[locationType]) {
                for (const check in trackerStuff.layout[locationType][location]) {
                    if (
                        (
                            trackerStuff.settings.user_exclusions || trackerStuff.settings.exclusions?.exclusions || trackerStuff.settings.exclusions || []
                        ).find(i => i == check)
                    ) continue;
                    if (trackerStuff.settings.exclude && trackerStuff.settings.exclude[locationType][location].find(i => i == check)) continue;
                    if (trackerStuff.full_exclusions && trackerStuff.full_exclusions.find(i => i == check)) continue;
                    const info = trackerStuff.layout[locationType][location][check];
                    if (info.position) {
                        if (info.housesItem) {
                            const itemInfo = trackerStuff.itemLayout.searchFor(info.housesItem);
                            if (!itemInfo.cat && !itemInfo.data) continue;
                            const itemInfoFromLayout = trackerStuff.itemLayout[itemInfo.cat][itemInfo.realItemName || info.housesItem];
                            if (itemInfoFromLayout) {
                                itemInfoFromLayout.locatedInChecks ||= [];
                                const together = `${locationType}@${location}@${check}`;
                                if (
                                    !itemInfoFromLayout.locatedInChecks.find(i => i == together)
                                ) itemInfoFromLayout.locatedInChecks.push(together);
                            }
                        }
                        const [x, y] = info.position.toString().split("x");
                        drawer.beginPath();
                        drawer.rect(x, y, 5, 5);
                        drawer.fillStyle = info.completed ? 'gray' : info.unlocked ? 'lime' : 'red';
                        drawer.fill();
                        if (info.stroke) {
                            if (info.completed) drawer.strokeStyle = 'grey';
                            else if (!info.unlocked) drawer.strokeStyle = 'brown';
                            drawer.stroke();
                        }
                    }
                }
            }
        }
    }
    const items = document.getElementById('gameItems');
    async function getItems(h = false) { // lists out all items using a spoiler log structure
        items.innerHTML = '';
        if (!h) {
            items.style.display = "block";
            for (const cat in trackerStuff.itemLayout) {
                if (typeof trackerStuff.itemLayout[cat] == "function") continue;
                const display = cat != j ? 'none' : 'flex';
                let html = `<h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
                    <span>${cat}</span>
                    <a class="link-secondary" href="javascript:toggle('${cat}Cat')">
                        <svg id="plus-circle" viewBox="0 0 16 16" class="bi">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        </svg>
                    </a>
                </h6><ul class="nav flex-row" id="${cat}Cat" style="display: ${display};">`;
                for (const item in trackerStuff.itemLayout[cat]) {
                    if (!trackerStuff.itemLayout[cat][item].imageFile || trackerStuff.removed_from_play.find(i => i == item)) continue;
                    if (!trackerStuff.itemLayout[cat][item].preloadedImages) {
                        if (
                            trackerStuff.itemLayout[cat][item].counts && !trackerStuff.itemLayout[cat][item].noImageCount
                        ) for (var i = trackerStuff.itemLayout[cat][item].counts[1]; i <= trackerStuff.itemLayout[cat][item].counts[2]; i++) {
                            const img = document.createElement('img');
                            img.src = `/tracker/images/${trackerStuff.itemLayout[cat][item].imageFile}-${i}.png`;
                        } else {
                            const img = document.createElement('img');
                            img.src = `/tracker/images/${trackerStuff.itemLayout[cat][item].imageFile}.png`;
                        }
                        trackerStuff.itemLayout[cat][item].preloadedImages = true;
                    }
                    html += `<li class="nav-item" title="${trackerStuff.itemLayout[cat][item].alt || item}">
                        <a id="${item}" class="nav-link d-flex align-items-center gap-2" href="javascript:;" onclick="retrievedItem('${item}', '${cat}')">
                            <img src="${
                                trackerStuff.itemLayout[cat][item].counts && (
                                    !trackerStuff.itemLayout[cat][item].noImageCount
                                ) ? `/tracker/images/${trackerStuff.itemLayout[cat][item].imageFile}-${
                                    trackerStuff.itemLayout[cat][item].counts[1]
                                }.png` : `/tracker/images/${trackerStuff.itemLayout[cat][item].imageFile}.png`
                            }" alt="${trackerStuff.itemLayout[cat][item].alt || item}"${
                                !trackerStuff.itemLayout[cat][item].obtained && !trackerStuff.itemLayout[cat][item].noDisable ? ` class="gameItemNotObtained"` : ''
                            }/>
                            ${!trackerStuff.itemLayout[cat][item].counts ? '' : trackerStuff.itemLayout[cat][item].counts[0]}
                        </a>
                    </li>`;
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
function retrievedItem(itemId, cat, confirmWithUser = true) {
    const itemInfo = trackerStuff.itemLayout[cat][itemId];
    if (itemInfo) {
        if (itemInfo.counts) {
            let [_, current, limit] = itemInfo.counts;
            if (current != undefined && limit != undefined) {
                if (current == limit) {
                    itemInfo.counts[0] = 0;
                    itemInfo.counts[1] = itemInfo.counts[3] ? 0 : 1;
                    itemInfo.obtained = false;
                } else {
                    itemInfo.obtained = true;
                    itemInfo.counts[0]++;
                    if (itemInfo.counts[0] > 1 || itemInfo.counts[3]) itemInfo.counts[1]++
                }
            } else {
                itemInfo.obtained = true;
                itemInfo.counts[0]++;
            }
        } else itemInfo.obtained = !itemInfo.obtained;
        if (itemInfo.locatedInChecks) {
            const checks = itemInfo.locatedInChecks.filter(i => {
                const [locationType, location, check] = i.split("@");
                return !trackerStuff.layout[locationType][location][check].completed;
            });
            if (confirmWithUser) {
                if (checks.length > 1) {
                    const modal = $('#checkSelectModal');
                    modal.find("span").text(itemId);
                    modal.find('div[class="accordion-body"]').html(checks.map(v => `<div class="form-check" title="If you got the ${itemId} from this check, then you can select this one.">
                        <input type="radio" name="check" value="${v}" id="${v}" class="form-check-input" required/>
                        <label class="form-check-label" for="${v}">${v.split("@")[1]} ${v.split("@")[2].split(v.split("@")[1]).join('')} (${v.split("@")[0]} Area)</label>
                    </div>`).join('<br>'));
                    modal.find('form[action="javascript:;"]').on("submit", e => {
                        $(e.target).off("submit");
                        const info = Object.fromEntries(new URLSearchParams($(e.target).serialize()));
                        itemInfo.selectedCheck = true;
                        checkCompleted(info.check, itemInfo, itemId);
                        modal.modal('hide');
                    })
                    modal.modal('show');
                    modal.on("hidden.bs.modal", () => {
                        modal.off("hidden.bs.modal");
                        if (!itemInfo.selectedCheck) {
                            itemInfo.counts[0]--;
                            if (itemInfo.counts[0] == 0) {
                                itemInfo.counts[1] = itemInfo.counts[3] ? 0 : 1;
                                itemInfo.obtained = false;
                            } else itemInfo.counts[1]--;
                        } else delete itemInfo.selectedCheck;
                        switchTrackerMode(document.getElementById('tracker').getAttribute("data-mode"), cat);
                    })
                } else checkCompleted(checks[0] || itemInfo.locatedInChecks[0], itemInfo, itemId)
            }
            if (!itemInfo.obtained) for (const l of itemInfo.locatedInChecks) {
                const [locationType, location, check] = l.split("@");
                delete trackerStuff.layout[locationType][location][check].completed;
            }
        }
        switchTrackerMode(document.getElementById('tracker').getAttribute("data-mode"), cat);
    }
}
function checkCompleted(k, j = {}, itemId, showItemRecievedMessage = false) { // clears a check as completed
    const [locationType, location, check] = k.split("@");
    trackerStuff.layout[locationType][location][check].completed = j.obtained;
    if (showItemRecievedMessage) displayAlert('success', `You have recieved the ${itemId} from ${location} ${check.split(location).join('')} (${locationType} Area)`);
}
function uploadSpoilerLog(obj) { // takes a spoiler log file and converts it into a usable format that the tracker can handle.
    const file = obj.files[0];
    const modal = $("#processModal");
    modal.find('h5[class="modal-title"]').text("Loading Spoiler Log...");
    const progress = modal.find('progress');
    progress.val(0);
    progress.attr("max", file.size);
    const status = modal.find("p");
    status.text(`Loaded 0 out of ${file.size} bytes.`);
    modal.modal('show');
    const fs = new FileReader();
    fs.addEventListener("loadend", e => {
        status.text("The tracker is now loading the contents of your spoiler log.")
        progress.removeAttr("value");
        progress.removeAttr("max");
        try {
            const json = jsyaml.load(e.target.result);
            clearTracker();
            if (json.layout && json.metrics) {
                if ((json.settings.logic_mode || json.settings.logic.logic_mode || json.settings.logic.mode) == "Normal") { 
                    // Only let the user choose their preferences when logic settings are set to normal to prevent inaccuracy with both methods.
                } else { // default to using the metrics if the logic mode settings are not set to normal.

                }
            } else if (json.layout) for (const locationType in json.layout) {
                for (const location in json.layout[locationType]) {
                    for (const check in json.layout[locationType][location]) {
                        if (trackerStuff.layout[locationType][location][check] && typeof trackerStuff.layout[locationType][location][check] == "object") {
                            if (trackerStuff.layout[locationType][location][check].completed) delete trackerStuff.layout[locationType][location][check].completed 
                            if (
                                trackerStuff.layout[locationType][location][check].unlocked 
                                && !trackerStuff.layout[locationType][location][check].unlockedByDefault
                            ) delete trackerStuff.layout[locationType][location][check].unlocked; 
                            const item = json.layout[locationType][location][check];
                            json.layout[locationType][location][check] = Object.assign(trackerStuff.layout[locationType][location][check], {
                                housesItem: item
                            });
                        }
                    }
                }
            } else {
                modal.modal('hide');
                displayAlert('warning', 'Your spoiler log does not contain a layout or the metrics that can be used by the tracker to help you accurately track your progress. Please upload a valid spoiler log file.');
            }
            json.itemLayout = trackerStuff.itemLayout;
            console.log(json)
            loadTracker(json, document.getElementById('tracker').getAttribute("data-mode"));
            modal.modal('hide');
            displayAlert('success', 'Your spoiler log was successfuly loaded! have fun tracking your progress!');
        } catch (e) {
            modal.modal('hide');
            displayAlert('danger', `${
                !file.name.endsWith(".json") && !file.name.endsWith(".yaml") ? 'Unspoorted file type!' : 'There was an error while loading your spoiler log.'
            }<br><br><strong>File Parsing Error</strong>: ${e.toString()}`);
        }
    });
    fs.addEventListener("progress", e => {
        if (!Number.isNaN(e.loaded)) {
            status.text(`Loaded ${e.loaded} out of ${file.size} bytes.`);
            progress.val(e.loaded);
        }
    })
    fs.readAsText(file);
}
function clearTracker() {
    for (const cat in trackerStuff.itemLayout) {
        if (typeof trackerStuff.itemLayout[cat] == "function") continue;
        for (const item in trackerStuff.itemLayout[cat]) {
            if (trackerStuff.itemLayout[cat][item].locatedInChecks) delete trackerStuff.itemLayout[cat][item].locatedInChecks
        }
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
                                    }, trackerStuff.layout[location] || {});
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
                    for (const l in trackerStuff.layout) {
                        const info = trackerStuff.layout[l][location];
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
    for (const i in trackerStuff.layout) if (trackerStuff.layout[i][f]) return {
        info: trackerStuff.layout[i][f],
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