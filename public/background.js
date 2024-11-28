chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

chrome.runtine.onMessage.addListener((message, sender, sendResponse) => {
    console.log({ message, sender, sendResponse });

    if (message.action === "cardapio-pizza-taglio-upsert") {
        // do someting
    }



    return true
})