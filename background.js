let injectedTabs = new Set();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(injectedTabs);
  const allowInjection =
    !injectedTabs.has(tabId) &&
    changeInfo.url && // Ensure it's a URL change
    new URL(changeInfo.url).hostname.includes("google.co");

  if (allowInjection) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        files: ["contentScript.js"],
      },
      () => chrome.runtime.lastError
    );
    if (new URL(changeInfo.url).search) injectedTabs.add(tabId);
  }
});
