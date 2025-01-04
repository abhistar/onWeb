const tabs = document.querySelectorAll(".YmvwI");
tabs.forEach((tab) => {
  if (tab.textContent.trim() === "Web") {
    tab.click();
  }
});
