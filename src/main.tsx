import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import tailwindStyles from "./index.css?inline";
import { initContactCopyButtons } from "./whatsapp/contact-copy";
import { initCrmStatusBadge } from "./whatsapp/crm-status-badge";

console.log("🚀 React content script iniciado");

initContactCopyButtons();
initCrmStatusBadge();

// Cria container host
const host = document.createElement("div");
host.id = "amodomio-root";
host.style.position = "fixed";
host.style.top = "0";
host.style.left = "0";
host.style.zIndex = "999999";
host.style.width = "100vw";
host.style.height = "100vh";
host.style.pointerEvents = "none"; // evita bloquear cliques fora do app

// Usa Shadow DOM para isolar CSS do WhatsApp e garantir carregamento das classes em produção
const shadow = host.attachShadow({ mode: "open" });
const styleTag = document.createElement("style");
styleTag.textContent = tailwindStyles;
shadow.appendChild(styleTag);

const shadowAppRoot = document.createElement("div");
shadowAppRoot.style.pointerEvents = "auto";
shadow.appendChild(shadowAppRoot);

// Portal root para componentes que usam Portal (ex.: Dialog)
const portalRoot = document.createElement("div");
portalRoot.id = "ammodomio-portal";
portalRoot.style.pointerEvents = "auto";
shadow.appendChild(portalRoot);

// Insere logo após o primeiro DIV do body, ou fallback no body
const bodyDivs = Array.from(document.body.children).filter((el) => el.tagName === "DIV");
if (bodyDivs.length > 0) {
  bodyDivs[0].insertAdjacentElement("afterend", host);
} else {
  document.body.appendChild(host);
}

ReactDOM.createRoot(shadowAppRoot).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
