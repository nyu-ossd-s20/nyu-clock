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

  function showTime(choice){

    switch (choice) {
      case "New York":
        var date = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
        date = new Date(date);
      case "Abu Dhabi":
        var date = new Date().toLocaleString("en-US", {timeZone: "Asia/Dubai"});
        date = new Date(date);
      case "Shanghai":
        var date = new Date().toLocaleString("en-US", {timeZone: "Asia/Shanghai"});
        date = new Date(date);
    }

    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var session = "AM";

    if (h == 0){
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
    document.getElementsById("container-id").textContent = time;

    setTimeout(showTime, 1000);
  }


  /**
   * Given a URL to a beast image, remove all existing beasts, then
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
    container.style.backgroundRepeat = "no-repeat";
    container.style.backgroundSize = "cover";
    container.style.backgroundPosition = "center";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.color = "white";
    container.style.fontSize = "80px";
    container.style.border = "1px solid #ccc";
    container.style.padding = "0px 5px 0px 5px";
    container.className = "container-div";
    container.id = "container-id";
    // let campusImage = document.createElement("img");
    // campusImage.setAttribute("src", campusURL);
    // campusImage.style.height = "100vh";
    // campusImage.className = "campus-image";
    campusDIV.appendChild(container);
    document.body.appendChild(campusDIV);
    setInterval(function() { showTime(choice); }, 1000);
    // document.getElementsByClassName("campus-div").appendChild(campusImage);
  }

  /**
   * Remove every beast from the page.
   */
  function removeExistingClocks() {
    let existingClocks = document.querySelectorAll(".campus-div");
    for (let clock of existingClocks) {
      clock.remove();
    }
  }

  /**
   * Listen for messages from the background script.
   * Call "beastify()" or "reset()".
  */
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "clock") {
      insertClocks(message.campusURL, message.choice);
    } else if (message.command === "reset") {
      removeExistingClocks();
    }
  });

})();
