'use strict';

import './popup.css';

(function () {
  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions
  const counterStorage = {
    get: (cb) => {
      chrome.storage.sync.get(['auto_continue_generate_enabled'], (result) => {
        cb(result.auto_continue_generate_enabled);
      });
    },
    set: (value, cb) => {
      chrome.storage.sync.set(
        {
          auto_continue_generate_enabled: value,
        },
        () => {
          cb();
        }
      );
    },
  };

  document.addEventListener('DOMContentLoaded', () => {
    counterStorage.get((auto_continue_generate_enabled) => {
      document.getElementById('enabled').innerText = auto_continue_generate_enabled ? '✅' : '❌';
    });

    // Add event listener to increment button
    document.getElementById('enabled').addEventListener('click', () => {
      const enabled = document.getElementById('enabled').innerText === '✅'
      counterStorage.set(!enabled, () => {
        // Update the UI
        document.getElementById('enabled').innerText = !enabled ? '✅' : '❌';

        // Send message to contentScript
        chrome.tabs.query({}).then(tabs => {
          for (const tab of tabs) {
            console.log(tab.url);

            chrome.tabs.sendMessage(
              tab.id,
              {
                type: 'UPDATE',
                status: !enabled,
              },
              (response) => {
                console.log('Current count value passed to contentScript file');
              }
            );
          }
        }, error => {
          console.error(error)
        });
      });
    });
  });
})();
