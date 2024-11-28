import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const env = process.env.NODE_ENV;

if (env === "development") {
  createRootAndRender();
} else {
  document.querySelectorAll<HTMLDivElement>('#react-amm-wapp-root')
    .forEach(renderWithReact);
}

function createRootAndRender() {

  const id = "react-amm-wapp-root"

  const root = document.createElement("div");
  root.id = id
  root.style.position = 'relative';
  root.style.zIndex = '10000';
  document.body.appendChild(root);

  document.querySelectorAll<HTMLDivElement>(`#${id}`)
    .forEach(renderWithReact);

}



function renderWithReact(node: HTMLDivElement) {
  ReactDOM.createRoot(node).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

