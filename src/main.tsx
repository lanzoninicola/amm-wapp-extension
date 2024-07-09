import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const env = process.env.NODE_ENV;

if (env === "development") {
  createButton();
} else {
  document.querySelectorAll<HTMLDivElement>('#sidebar-root')
    .forEach(renderWithReact);
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


function renderWithReact(node: HTMLDivElement) {
  ReactDOM.createRoot(node).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

function createSidebar() {
  const existingSidebar = document.getElementById('whatsapp-sidebar');
  if (existingSidebar) {
    existingSidebar.remove();
  }

  const sidebar = document.createElement('div');
  sidebar.id = 'whatsapp-sidebar';
  sidebar.style.position = 'fixed';
  sidebar.style.right = '0';
  sidebar.style.top = '0';
  sidebar.style.width = '300px';
  sidebar.style.height = '100%';
  sidebar.style.backgroundColor = '#ffffff';
  sidebar.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
  sidebar.style.zIndex = '9999';
  document.body.appendChild(sidebar);

  const root = document.createElement("div");
  root.id = "sidebar-root"

  sidebar.appendChild(root);

  document.querySelectorAll<HTMLDivElement>('#sidebar-root')
    .forEach(renderWithReact);

}