/**
 * A Script File for the ALBWR Tracker
 */

// Toggles an element to show and hide
let toggleStuff = {};
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
          drawer.rect(x, y, 10, 10);
          drawer.fillStyle = info.unlockedByDefault ? 'lime' : 'red';
          drawer.fill();
        }
      }
    }
  }
  function getItems() {

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