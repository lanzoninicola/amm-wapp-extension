// public/content.js
function createSidebar() {

    const id = 'whatsapp-sidebar';

    const existingSidebar = document.getElementById(id);
    if (existingSidebar) {
        existingSidebar.remove();
    }

    const sidebar = document.createElement('div');
    sidebar.id = id;
    sidebar.style.position = 'fixed';
    sidebar.style.right = '0';
    sidebar.style.top = '0';
    sidebar.style.width = '300px';
    sidebar.style.height = '100%';
    sidebar.style.backgroundColor = '#ffffff';
    sidebar.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    sidebar.style.zIndex = '9999';
    document.body.appendChild(sidebar);

    // Create a root div for React to mount into
    const root = document.createElement("div");
    root.id = "sidebar-root"
    sidebar.appendChild(root);

    // Inject the React app
    injectReactApp(sidebar);

}

function injectReactApp(sidebar) {
    // Inject the bundled React app
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('sidebar.js');
    sidebar.appendChild(script);
}

function createButton() {
    const button = document.createElement('button');
    button.textContent = 'Templates';
    button.style.position = 'fixed';
    button.style.right = '10px';
    button.style.top = '10px';
    button.style.zIndex = '9999';
    button.onclick = createSidebar;
    document.body.appendChild(button);
}

createButton();
