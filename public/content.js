// public/content.js

function createRoot() {

    const body = document.querySelector('body')
    body.classList.add('relative')

    const root = document.createElement("div");
    root.id = "amm-wapp-root"
    root.style.position = 'relative';
    root.style.zIndex = '10000';
    document.body.appendChild(root);

    injectReactApp(root, 'amodomio-extension.js');
}


function injectReactApp(htmlRootElement, jsFileName) {
    // Inject the bundled React app
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(jsFileName);
    htmlRootElement.appendChild(script);
}

createRoot()