let injectedTabSearch = new Map();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const allowInjection =
    changeInfo.url && // Ensure it's a URL change
    new URL(changeInfo.url).hostname.includes("google.co") && // Ensure the changed url is of google
    (!injectedTabSearch.has(tabId) ||
      getSearchQuery(new URL(changeInfo.url)) !== injectedTabSearch.get(tabId)); // Ensure that either it's a new tab or change in search for the same tab

  if (allowInjection) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        files: ["contentScript.js"],
      },
      () => chrome.runtime.lastError
    );
    if (new URL(changeInfo.url).search) {
      injectedTabSearch.set(tabId, getSearchQuery(new URL(changeInfo.url)));
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
