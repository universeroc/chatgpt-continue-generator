'use strict';

let __auto_continue_generate_enabled__ = true

chrome.storage.sync.get(['auto_continue_generate_enabled'], (result) => {
  __auto_continue_generate_enabled__ = !!result.auto_continue_generate_enabled
});

// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'UPDATE') {
      console.log(`get update request: ${request.status}`)
      __auto_continue_generate_enabled__ = request.status
    }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});

(function () {
  const observer = new MutationObserver(() => {
    if (!__auto_continue_generate_enabled__)
      return

    // Find the button of 'Continue generating'
    [...document.querySelectorAll("button.btn")].forEach((btn) => {
      if (btn.innerText.includes("Continue generating")) {
        console.log("Found the button of 'Continue generating'");
        setTimeout(() => {
          console.log("Clicked it to continue generating after 1 second");
          btn.click();
        }, 1000);
      }
    });
  });

  // Start observing the dom change of the form
  observer.observe(document.forms[0], {
    attributes: false,
    childList: true,
    subtree: true,
  });
})()
