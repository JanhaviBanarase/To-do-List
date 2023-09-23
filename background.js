chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ tasks: [] });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getTasks") {
    chrome.storage.sync.get("tasks", (data) => {
      sendResponse(data.tasks || []);
    });
  } else if (message.action === "setTasks") {
    chrome.storage.sync.set({ tasks: message.tasks }); // Store the tasks array
  }
  return true;
});
