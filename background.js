let injectedTabSearch = new Map();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const url = changeInfo.url // Ensure it's a URL change
    ? new URL(changeInfo.url)
    : null;
  if (url !== null) {
    const searchQuery = getSearchQuery(url);
    const allowInjection =
      url.hostname.includes("www.google.co") && // Ensure the changed url is of google
      url.pathname === "/search" &&
      (!injectedTabSearch.has(tabId) ||
        searchQuery !== injectedTabSearch.get(tabId)); // Ensure that either it's a new tab or change in search for the same tab

    if (allowInjection) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          files: ["contentScript.js"],
        },
        () => chrome.runtime.lastError
      );
      if (url.search) {
        injectedTabSearch.set(tabId, searchQuery);
      }
    }
  }
});

function getSearchQuery(url) {
  const searchQuery = url.search
    .slice(1)
    .split("&")
    .filter((str) => str.startsWith("q="));
  return searchQuery.length > 0 ? searchQuery.at(0).substring(2) : null;
}
