import React from 'react';
import ReactDOM from 'react-dom/client';
import SidebarApp from './SidebarApp.tsx';
import './index.css';

const env = process.env.NODE_ENV;

renderSidebar();

function renderSidebar() {
  const id = "#amm-wapp-root-sidebar";

  if (env === "development") {
    const root = document.createElement("div");
    root.id = id
    root.style.position = 'relative';
    root.style.zIndex = '10000';
    document.body.appendChild(root);
  }

  document.querySelectorAll<HTMLDivElement>(id)
    .forEach(renderSidebarWithReact);
}

function renderSidebarWithReact(node: HTMLDivElement) {
  ReactDOM.createRoot(node).render(
    <React.StrictMode>
      <SidebarApp />
    </React.StrictMode>
  );
}

