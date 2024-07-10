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
  root.style.position = 'fixed';
  root.style.right = '0';
  root.style.top = '0';
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

