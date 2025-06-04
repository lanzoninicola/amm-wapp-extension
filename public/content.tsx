
import React from "react";
import { createRoot } from "react-dom/client";
import AppAssistenteEscolha from "../src/AppAssistenteEscolha";

console.log("🚀 React content script iniciado");

const container = document.createElement("div");
container.id = "amodomio-root";
container.style.position = "fixed";
container.style.top = "0";
container.style.left = "0";
container.style.zIndex = "999999";
document.body.appendChild(container);

const root = createRoot(container);
root.render(<AppAssistenteEscolha />);
