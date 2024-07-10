// public/content.js

function createRoot() {
    const root = document.createElement("div");
    root.id = "react-amm-wapp-root"
    root.style.position = 'fixed';
    root.style.right = '0';
    root.style.top = '0';
    root.style.zIndex = '9999';
    document.body.appendChild(root);

    injectReactApp(root);
}


function injectReactApp(sidebar) {
    // Inject the bundled React app
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('sidebar.js');
    sidebar.appendChild(script);
}

createRoot()