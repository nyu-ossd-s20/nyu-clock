(function() {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  let interval;

  function showTime(choice){
    let date;

    if (choice === "New York") {
      date = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
    }
    else if (choice === "Abu Dhabi") {
      date = new Date().toLocaleString("en-US", {timeZone: "Asia/Dubai"});
    }
    else if (choice ===  "Shanghai") {
      date = new Date().toLocaleString("en-US", {timeZone: "Asia/Shanghai"});
    } else {
      date = new Date();
    }

    date = new Date(date)

    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var session = "AM";

    if (h === 0){
      h = 12;
    }
    if (h > 12){
      h = h - 12;
      session = "PM"
    }
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    var time = h + ":" + m + ":" + s + " " + session;

    document.getElementById("container-id").innerText = time;
  }


  /**
   * Given a URL to a campus image, remove all existing clocks, then
   * create and style an IMG node pointing to
   * that image, then insert the node into the document.
   */
  function insertClocks(campusURL, choice) {
    removeExistingClocks();
    let a = "url(";
    let b = ")";
    let c = a.concat(campusURL);
    let d = c.concat(b);
    let campusDIV = document.createElement("div");
    campusDIV.style.height = "100vh";
    campusDIV.style.width = "100vw";
    campusDIV.style.display = "flex";
    campusDIV.style.alignItems = "center";
    campusDIV.style.justifyContent = "center";
    campusDIV.className = "campus-div";
    let container = document.createElement("div");
    container.style.height = "30vh";
    container.style.width = "50vw";
    container.style.display = "flex";
    container.style.backgroundImage = d;
    container.style.opacity = 0.85;
    container.style.backgroundRepeat = "no-repeat";
    container.style.backgroundSize = "cover";
    container.style.backgroundPosition = "center";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.color = "white";
    container.style.fontSize = "80px";
    container.style.border = "1px solid #ccc";
    container.style.padding = "0px 5px 0px 5px";
    container.style.textShadow = "6px 6px 0px rgba(0,0,0,0.3)";
    container.className = "container-div";
    container.id = "container-id";
    campusDIV.appendChild(container);
    document.body.appendChild(campusDIV);
    interval = setInterval(function() { showTime(choice); }, 1000);
  }

  /**
   * Remove all clocks from the page.
   */
  function removeExistingClocks() {
    let existingClocks = document.querySelectorAll(".campus-div");
    for (let clock of existingClocks) {
      clock.remove();
    }
  }

  /**
   * Listen for messages from the background script.
   * Call "clock()" or "reset()".
   */

  let curr;

  browser.runtime.onMessage.addListener((message) => {
    if (curr !== message.choice) {
      clearInterval(interval);
      removeExistingClocks();
    }

    if (message.command === "clock") {
      curr = message.choice;
      insertClocks(message.campusURL, curr);
    } else if (message.command === "reset") {
      removeExistingClocks();
    }
  });

})();