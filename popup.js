let toggleDarkMode = document.getElementById("darkmodeToggle")
let isEnabled = false

chrome.storage.sync.get("enabled", (data) => {
    isEnabled = data.enabled
    updateToggleButton(isEnabled)
});

function updateToggleButton(enabled) {
    toggleDarkMode.innerText = enabled ? "Day" : "Night"
}

toggleDarkMode.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab.url.startsWith("https://digicampus.uni-augsburg.de")) {
        isEnabled = !isEnabled
        chrome.storage.sync.set({enabled: isEnabled}).then(() => {
            updateToggleButton(isEnabled)
            chrome.runtime.sendMessage({msg: "darkmode", tab: tab})
        })
    }
});