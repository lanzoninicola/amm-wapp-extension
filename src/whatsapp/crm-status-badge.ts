type CrmBadgePayload = {
  label: string;
  state: "checking" | "exists" | "success" | "needs_name" | "not_found" | "error" | "unknown";
  phoneKey: string;
};

const STORAGE_KEY = "amm-crm-status";
const PHONE_REGEX = /^\+?\d[\d ()+-]{6,}$/;
const HEADER_SELECTOR =
  "#app > div > div > div:nth-of-type(3) > div > div:nth-of-type(6) > span > div > span > div > div > section > div:nth-of-type(1) > div:nth-of-type(2)";
const PANEL_TITLE = "Dados do contato";
let cachedContainer: HTMLElement | null = null;

function readCleanText(element: Element | null) {
  if (!element) return null;

  const parts: string[] = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let node: Node | null = walker.nextNode();

  while (node) {
    const value = node.textContent?.trim();
    if (value) parts.push(value);
    node = walker.nextNode();
  }

  const text = parts.join(" ").trim();
  return text || null;
}

function readPanelPhoneDigits() {
  const headerBlock = document.querySelector(HEADER_SELECTOR);
  if (!headerBlock) return "";

  const row1El = headerBlock.querySelector<HTMLElement>("div:nth-child(1)");
  const row2El = headerBlock.querySelector<HTMLElement>("div:nth-child(2)");
  const row1 = readCleanText(row1El);
  const row2 = readCleanText(row2El);

  const candidates = [row1, row2].filter(Boolean) as string[];
  const phone = candidates.find((value) => PHONE_REGEX.test(value)) ?? "";
  return phone.replace(/\D/g, "");
}

function getBadgeContainer() {
  if (cachedContainer && cachedContainer.isConnected) {
    return cachedContainer;
  }

  const headers = Array.from(document.querySelectorAll("header"));
  const headerMatch = headers.find((header) =>
    header.textContent?.trim().includes(PANEL_TITLE)
  );

  if (headerMatch) {
    cachedContainer = headerMatch;
    return headerMatch;
  }

  const titleEl = Array.from(document.querySelectorAll("span, div, h1, h2, h3")).find(
    (node) => node.textContent?.trim() === PANEL_TITLE
  );
  if (!titleEl) return null;

  const container = (titleEl.closest("header") ?? titleEl.parentElement ?? titleEl) as HTMLElement;
  cachedContainer = container;
  return container;
}

function getStoredPayload(): CrmBadgePayload | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CrmBadgePayload;
  } catch {
    return null;
  }
}

function applyBadgeStyles(badge: HTMLElement, state: CrmBadgePayload["state"]) {
  let colors = { border: "#f5d58b", bg: "#fff4d6", text: "#9a6b00" };
  if (state === "checking") {
    colors = { border: "#b5d3ff", bg: "#e6f0ff", text: "#1d4ed8" };
  } else if (state === "exists" || state === "success") {
    colors = { border: "#a7f3d0", bg: "#ecfdf5", text: "#047857" };
  } else if (state === "error") {
    colors = { border: "#fecaca", bg: "#fef2f2", text: "#b91c1c" };
  }

  badge.style.borderColor = colors.border;
  badge.style.backgroundColor = colors.bg;
  badge.style.color = colors.text;
}

function ensureBadge(payload: CrmBadgePayload | null) {
  const container = getBadgeContainer();
  if (!container) return;

  let badge = container.querySelector<HTMLElement>("[data-amm-crm-badge]");
  if (!badge) {
    badge = document.createElement("span");
    badge.dataset.ammCrmBadge = "true";
    badge.style.display = "inline-flex";
    badge.style.alignItems = "center";
    badge.style.pointerEvents = "none";
    badge.style.border = "1px solid transparent";
    badge.style.borderRadius = "999px";
    badge.style.padding = "2px 6px";
    badge.style.marginLeft = "8px";
    badge.style.fontSize = "10px";
    badge.style.fontWeight = "600";
    badge.style.textTransform = "uppercase";
    badge.style.letterSpacing = "0.04em";
    badge.style.lineHeight = "1";
    container.appendChild(badge);
  }

  if (!payload) {
    badge.remove();
    return;
  }

  badge.textContent = payload.label;
  applyBadgeStyles(badge, payload.state);
}

export function initCrmStatusBadge() {
  let scheduled = false;

  const update = (payload?: CrmBadgePayload | null) => {
    const data = payload ?? getStoredPayload();
    const panelDigits = readPanelPhoneDigits();
    const phoneKey = panelDigits ? panelDigits.slice(-8) || panelDigits : "";
    if (!data || !phoneKey || data.phoneKey !== phoneKey) {
      ensureBadge(null);
      return;
    }
    ensureBadge(data);
  };

  const scheduleUpdate = (payload?: CrmBadgePayload | null) => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      update(payload);
    });
  };

  const observer = new MutationObserver(() => scheduleUpdate());
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener(STORAGE_KEY, (event) => {
    const detail = (event as CustomEvent).detail as CrmBadgePayload | null;
    scheduleUpdate(detail ?? null);
  });

  update();
}
