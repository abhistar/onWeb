let injectedTabSearch = new Map();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const url = changeInfo.url // Ensure it's a URL change
    ? new URL(changeInfo.url)
    : null;

  if (url !== null) {
    const isGoogleSearch =
      url.hostname.includes(".google.") && // Ensure the changed url is of google
      url.pathname === "/search";

    const searchQuery = isGoogleSearch ? getSearchQuery(url) : null;

    const isNewSearch =
      !injectedTabSearch.has(tabId) ||
      searchQuery !== injectedTabSearch.get(tabId); // Ensure that either it's a new tab or change in search for the same tab

    if (isNewSearch) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          func: ({ origin, pathname, searchQuery }) => {
            window.location.replace(
              origin + pathname + "?udm=14&q=" + searchQuery
            );
          },
          args: [{ origin: url.origin, pathname: url.pathname, searchQuery }],
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
