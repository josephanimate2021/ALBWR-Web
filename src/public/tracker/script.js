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
  const drawer = tracker.getContext('2d');
  function drawMap() {
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
          drawer.fillStyle = info.unlockedByDefault ? 'lime' : 'red';
          drawer.fill();
          if (info.stroke) {
              if (!info.unlockedByDefault) drawer.strokeStyle = 'brown';
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
$("#archipelagoConnector").on("hidden.bs.modal", e => $(e.target).find("p").text(''));
function archipelagoConnector(obj) {
    if (connected2archipelago) jQuery(obj).trigger("archipelagoDisconnect");
    else {
        const tracker = document.getElementById('tracker');
        const marker = tracker.getContext('2d');
        let connectionSuccessful = false;
        $(obj).find("p").text('')
        connected2archipelago = true;
        const originalText = $(obj).find('button[type="submit"]').text();
        const originalText2 = $("#statusKindof").text();
        $("#statusKindof").html('<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status">Connecting To Archipelago...</span>')
        $(obj).find('button[type="submit"]').attr("disabled", "");
        $(obj).find('button[type="submit"]').html('<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status">Connecting To Archipelago...</span>');
        function handleError(e) {
            $("#statusKindof").text(originalText2);
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
                        if (info.position) {
                            const [x, y] = info.position.toString().split("x");
                            marker.beginPath();
                            const size = info.small ? 5 : 10
                            marker.rect(x, y, size, size);
                            marker.fillStyle = 'gray'
                            marker.fill();
                            if (info.stroke) {
                                marker.strokeStyle = 'grey';
                                marker.stroke();
                            }
                        }
                    }
                } else if (JSON.parse(e.data).connectionSuccessful) {
                    jQuery(obj).bind("archipelagoDisconnect", () => {
                        socket.close();
                        $(obj).find('button[type="submit"]').text(originalText);
                        $("#statusKindof").html(originalText2);
                        connected2archipelago= false;
                        $(obj).find("p").text('Successfully disconnected from the Archipelago Server')
                    })
                    connectionSuccessful = true;
                    $("#statusKindof").text("Connected To Archipelago")
                    $(obj).find("p").css("color", "lime");
                    $(obj).find('button[type="submit"]').attr("disabled", false);
                    $(obj).find('button[type="submit"]').text("Disconnect From Archipelago");
                    $(obj).find("p").text(`Successfully connected to the Archipelago server!`);
                }
            })
        } catch (e) {
            handleError(e);
        }
    }
}