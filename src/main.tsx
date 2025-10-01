import "./content-style.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./App";

console.log("🚀 React content script iniciado");


// const env = process.env.NODE_ENV;

const container = document.createElement("div");
container.id = "amodomio-root";
container.style.position = "fixed";
container.style.top = "0";
container.style.left = "0";
container.style.zIndex = "999999";

// append the container after the first div child element located after the body element

const bodyDivs = Array.from(document.body.children).filter(el => el.tagName === "DIV");

if (bodyDivs.length > 0) {
  // Insert after the first div
  const firstDiv = bodyDivs[0];
  firstDiv.insertAdjacentElement('afterend', container);
} else {
  // Fallback if no div found
  document.body.appendChild(container);
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
