import React from 'react';
import ReactDOM from 'react-dom/client';
import AppSidebar from './AppSidebar.tsx';
import './index.css';
import AppAssistenteEscolha from './AppAssistenteEscolha.tsx';

const env = process.env.NODE_ENV;

render();

function render() {
  const id = "#amm-wapp-root";

  if (env === "development") {
    const root = document.createElement("div");
    root.id = id
    root.style.position = 'relative';
    root.style.zIndex = '10000';
    document.body.appendChild(root);
  }

  document.querySelectorAll<HTMLDivElement>(id)
    .forEach(runReact);


}

function runReact(node: HTMLDivElement) {
  ReactDOM.createRoot(node).render(
    <React.StrictMode>
      <AppSidebar />
      <AppAssistenteEscolha />
    </React.StrictMode>
  );
}



