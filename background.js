chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason == chrome.runtime.OnInstalledReason.INSTALL)
        chrome.storage.sync.set({enabled: true}) // enable darkmode after installing extension
});

chrome.tabs.onUpdated.addListener(function(_tabId, changeInfo, tab) {
    if (changeInfo.status != null && changeInfo.status == chrome.tabs.TabStatus.LOADING)
        updateTab(tab, false)
});

chrome.runtime.onMessage.addListener((request, _sender, _reply) => {
    if (request.msg == "darkmode" && request.tab != null)
        updateTab(request.tab, true)
    return true
});

function checkTabForDigicampus(tab) {
    return tab.url.startsWith("https://digicampus.uni-augsburg.de")
}

function applyExtraStylesheet(tabId) {
    chrome.scripting.insertCSS({files: ["darkmode.css"], target: {tabId: tabId}});
}

function removeExtraStylesheet(tabId) {
    chrome.scripting.removeCSS({files: ["darkmode.css"], target: {tabId: tabId}});
}

function updateTab(tab, update) {
    if (!checkTabForDigicampus(tab))
        return;
        
    chrome.storage.sync.get("enabled").then(data => {
        console.log(data)
        if (data.enabled)
            applyExtraStylesheet(tab.id)
        else if(update)
            removeExtraStylesheet(tab.id)
    })
}