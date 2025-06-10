console.log("Running background.js")

typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined'

const REST_API_BASE_URL = "http://localhost:300022/api";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message in background.js:", request);

  if (request.type === "FETCH_ORCAMENTO") {
    fetch(`${REST_API_BASE_URL}/orcamento`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "3PjN!u9g@r5XzE1fQw7H", // Use the API key from the request
      },
    })
      .then(res => {

        console.log("Response received from server:", res);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status} ${res.statusText} - body: ${JSON.stringify(res.body)}`);
        }
        return res;
      }
      )
      .then(res => res.json())
      .then(data => sendResponse({ data }))
      .catch(error => {
        console.error("Error fetching orcamento:", error);
        sendResponse({ error: error.message });
      });

    return true;
  }
});
