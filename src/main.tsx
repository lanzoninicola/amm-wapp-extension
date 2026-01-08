import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import tailwindStyles from "./index.css?inline";
import { Check, Copy } from "lucide-react";

console.log("🚀 React content script iniciado");

const CONTACT_HEADER_SELECTOR =
  "#app > div > div > div:nth-of-type(3) > div > div:nth-of-type(6) > span > div > span > div > div > section > div:nth-of-type(1) > div:nth-of-type(2)";
const PHONE_REGEX = /^\+?\d[\d ()+-]{6,}$/;
const COPY_BUTTON_ATTR = "data-ammodomio-copy-button";
const COPY_ICON_ATTR = "data-ammodomio-copy-icon";
const COPY_FEEDBACK_ATTR = "data-ammodomio-copy-feedback";
const COPY_INLINE_ATTR = "data-ammodomio-copy-inline";

function readCleanText(element: Element | null) {
  if (!element) return "";

  const parts: string[] = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let node: Node | null = walker.nextNode();

  while (node) {
    const parent = node.parentElement;
    if (!parent?.closest(`[${COPY_BUTTON_ATTR}], [${COPY_FEEDBACK_ATTR}], [${COPY_ICON_ATTR}]`)) {
      const value = node.textContent?.trim();
      if (value) parts.push(value);
    }
    node = walker.nextNode();
  }

  return parts.join(" ").trim();
}

function copyToClipboard(value: string) {
  const text = value.trim();
  if (!text) return;

  if (navigator?.clipboard?.writeText) {
    void navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function getInlineContainer(rowEl: HTMLElement | null) {
  if (!rowEl) return null;

  const strongTarget =
    rowEl.querySelector<HTMLElement>("span div div span") ||
    rowEl.querySelector<HTMLElement>("span div span") ||
    rowEl.querySelector<HTMLElement>("span");

  const container = strongTarget ?? rowEl;
  if (!container.hasAttribute(COPY_INLINE_ATTR)) {
    container.setAttribute(COPY_INLINE_ATTR, "true");
    container.style.display = "inline-flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.gap = "8px";
    container.style.verticalAlign = "middle";
  }

  return container;
}

function ensureCopyButton(rowEl: HTMLElement | null, type: "name" | "phone", value: string) {
  if (!rowEl) return;

  const inlineContainer = getInlineContainer(rowEl);
  if (!inlineContainer) return;

  const existing = inlineContainer.querySelector<HTMLButtonElement>(`button[${COPY_BUTTON_ATTR}="${type}"]`);
  if (!value) {
    if (existing) existing.remove();
    return;
  }

  if (existing) {
    existing.dataset.copyValue = value;
    return;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute(COPY_BUTTON_ATTR, type);
  button.dataset.copyValue = value;
  button.title = `Copiar ${type === "name" ? "nome" : "telefone"}`;
  button.setAttribute("aria-label", button.title);
  button.style.padding = "4px";
  button.style.border = "1px solid #e2e8f0";
  button.style.borderRadius = "999px";
  button.style.background = "#f8fafc";
  button.style.color = "#0f172a";
  button.style.cursor = "pointer";
  button.style.display = "inline-flex";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";
  button.style.verticalAlign = "middle";
  button.style.lineHeight = "1";
  button.style.boxShadow = "0 1px 2px rgba(15, 23, 42, 0.08)";
  button.style.transition = "background-color 150ms ease, border-color 150ms ease, transform 150ms ease";

  const iconHost = document.createElement("span");
  iconHost.setAttribute(COPY_ICON_ATTR, "true");
  iconHost.style.display = "inline-flex";
  iconHost.style.alignItems = "center";
  iconHost.style.justifyContent = "center";
  button.appendChild(iconHost);
  const iconRoot = ReactDOM.createRoot(iconHost);
  (iconHost as HTMLElement & { _ammodomioRoot?: typeof iconRoot })._ammodomioRoot = iconRoot;
  iconRoot.render(<Copy size={14} />);

  button.addEventListener("mouseenter", () => {
    button.style.background = "#eef2f7";
    button.style.borderColor = "#cbd5e1";
  });
  button.addEventListener("mouseleave", () => {
    button.style.background = "#f8fafc";
    button.style.borderColor = "#e2e8f0";
  });
  button.addEventListener("mousedown", () => {
    button.style.transform = "translateY(1px)";
  });
  button.addEventListener("mouseup", () => {
    button.style.transform = "translateY(0)";
  });

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const rawValue = button.dataset.copyValue ?? "";
    const copyValue =
      type === "phone"
        ? rawValue.replace(/\D/g, "").slice(-8)
        : rawValue.replace(/^~+/, "").trim();
    copyToClipboard(copyValue);

    const rootRef =
      (iconHost as HTMLElement & { _ammodomioRoot?: typeof iconRoot })._ammodomioRoot;
    rootRef?.render(<Check size={14} />);
    window.setTimeout(() => {
      rootRef?.render(<Copy size={14} />);
    }, 1200);

    let feedback = inlineContainer.querySelector<HTMLSpanElement>(`span[${COPY_FEEDBACK_ATTR}="${type}"]`);
    if (!feedback) {
      feedback = document.createElement("span");
      feedback.setAttribute(COPY_FEEDBACK_ATTR, type);
      feedback.style.fontSize = "10px";
      feedback.style.marginLeft = "10px";
      feedback.style.color = "#16a34a";
      feedback.style.fontWeight = "600";
      feedback.style.textTransform = "uppercase";
      feedback.style.opacity = "0";
      feedback.style.transition = "opacity 150ms ease";
      feedback.style.verticalAlign = "middle";
      inlineContainer.appendChild(feedback);
    }

    feedback.textContent = type === "phone" ? `Copiado: ${copyValue}` : "Copiado";
    feedback.style.opacity = "1";
    window.setTimeout(() => {
      if (feedback) feedback.style.opacity = "0";
    }, 1200);
  });

  inlineContainer.appendChild(button);
}

function updateContactCopyButtons() {
  const headerBlock = document.querySelector(CONTACT_HEADER_SELECTOR);
  if (!headerBlock) return;

  const row1El = headerBlock.querySelector<HTMLElement>("div:nth-child(1)");
  const row2El = headerBlock.querySelector<HTMLElement>("div:nth-child(2)");

  if (!row1El && !row2El) return;

  const row1 = readCleanText(row1El);
  const row2 = readCleanText(row2El);

  const nameSaved =
    readCleanText(row1El?.querySelector("span div div span") ?? null);
  const nameUnsaved =
    readCleanText(row2El?.querySelector("span div span") ?? null);

  const numberSaved =
    readCleanText(row2El?.querySelector("span div span") ?? null);
  const numberUnsaved =
    readCleanText(row1El?.querySelector("span div div span") ?? null);

  let name = "";
  let number = "";
  let nameEl: HTMLElement | null = null;
  let numberEl: HTMLElement | null = null;

  if (row1 && PHONE_REGEX.test(row1)) {
    number = row1;
    numberEl = row1El ?? null;
    name = row2;
    nameEl = row2El ?? null;
  } else if (row2 && PHONE_REGEX.test(row2)) {
    number = row2;
    numberEl = row2El ?? null;
    name = row1;
    nameEl = row1El ?? null;
  } else {
    name =
      nameSaved ||
      nameUnsaved ||
      (row1 && !PHONE_REGEX.test(row1) ? row1 : "") ||
      (row2 && !PHONE_REGEX.test(row2) ? row2 : "");

    number =
      (numberSaved && PHONE_REGEX.test(numberSaved) ? numberSaved : "") ||
      (numberUnsaved && PHONE_REGEX.test(numberUnsaved) ? numberUnsaved : "") ||
      (row1 && PHONE_REGEX.test(row1) ? row1 : "") ||
      (row2 && PHONE_REGEX.test(row2) ? row2 : "");

    if (number) {
      if (row1 && row1.includes(number)) numberEl = row1El ?? null;
      else if (row2 && row2.includes(number)) numberEl = row2El ?? null;
      else numberEl = row2El ?? row1El ?? null;
    }

    if (name) {
      if (row1 && row1.includes(name)) nameEl = row1El ?? null;
      else if (row2 && row2.includes(name)) nameEl = row2El ?? null;
      else nameEl = row1El ?? row2El ?? null;
    }
  }

  ensureCopyButton(nameEl, "name", name);
  ensureCopyButton(numberEl, "phone", number);
}

let updateTimeout: ReturnType<typeof setTimeout> | null = null;
const scheduleUpdate = () => {
  if (updateTimeout) clearTimeout(updateTimeout);
  updateTimeout = setTimeout(updateContactCopyButtons, 150);
};

const headerObserver = new MutationObserver(scheduleUpdate);
headerObserver.observe(document.body, { childList: true, subtree: true });
scheduleUpdate();

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
