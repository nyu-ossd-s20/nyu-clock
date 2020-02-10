/**
 * CSS to hide everything on the page,
 * except for elements that have the "campus-div" class.
 */
const hidePage = `body > :not(.campus-div) {
                    display: none;
                  }`;

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {

    /**
     * Given the name of a campus, get the URL to the corresponding image.
     */
    function campusNameToURL(campusName) {
      switch (campusName) {
        case "New York":
          return browser.extension.getURL("campus/NY.jpg");
        case "Abu Dhabi":
          return browser.extension.getURL("campus/AD.jpg");
        case "Shanghai":
          return browser.extension.getURL("campus/SH.jpg");
      }
    }

    /**
     * Insert the page-hiding CSS into the active tab,
     * then get the campus URL and
     * send a "clock" message to the content script in the active tab.
     */
    function clock(tabs) {
      browser.tabs.insertCSS({code: hidePage}).then(() => {
        let url = campusNameToURL(e.target.textContent);
        browser.tabs.sendMessage(tabs[0].id, {
          command: "clock",
          campusURL: url,
          choice: e.target.textContent
        });
      });
    }

    /**
     * Remove the page-hiding CSS from the active tab,
     * send a "reset" message to the content script in the active tab.
     */
    function reset(tabs) {
      browser.tabs.removeCSS({code: hidePage}).then(() => {
        browser.tabs.sendMessage(tabs[0].id, {
          command: "reset",
        });
      });
    }

    /**
     * Just log the error to the console.
     */
    function reportError(error) {
      console.error(`Could not insert clock: ${error}`);
    }

    /**
     * Get the active tab,
     * then call "clock()" or "reset()" as appropriate.
     */
    if (e.target.classList.contains("campus")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(clock)
        .catch(reportError);
    }
    else if (e.target.classList.contains("reset")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(reset)
        .catch(reportError);
    }
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute clock content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({file: "/content_scripts/clock.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);
