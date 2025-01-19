// Function to get the current tab's URL
function getCurrentTabUrl() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      const currentTab = tabs[0];
      const currentTabUrl = new URL(currentTab.url); // Get the URL of the current tab
      const isSearchPage =
        currentTabUrl.hostname.includes(".google.") &&
        currentTabUrl.pathname === "/search";

      // Display the URL in your popup (optional)
      const urlElement = document.getElementById("info-text");
      if (urlElement) {
        if (!isSearchPage) {
          urlElement.textContent = `You're not on Google search page`;
        } else {
          urlElement.textContent = `You're on Google search page`;
        }
      }
    } else {
      console.error("No active tab found.");
    }
  });
}

// Call the function when the popup is loaded
document.addEventListener("DOMContentLoaded", getCurrentTabUrl);
