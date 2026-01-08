import { useEffect, useRef, useState } from "react";

export type ContactInfo = { name: string | null; number: string | null };

const phoneRegex = /^\+?\d[\d ()+-]{6,}$/;
const COPY_BUTTON_ATTR = "data-ammodomio-copy-button";
const COPY_ICON_ATTR = "data-ammodomio-copy-icon";
const COPY_FEEDBACK_ATTR = "data-ammodomio-copy-feedback";

function readCleanText(element: Element | null) {
  if (!element) return null;

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

  const text = parts.join(" ").trim();
  return text || null;
}

function readContact(): ContactInfo | null {
  const getHeaderInfoFromRightPanel = () => {
    const headerBlock = document.querySelector(
      "#app > div > div > div:nth-of-type(3) > div > div:nth-of-type(6) > span > div > span > div > div > section > div:nth-of-type(1) > div:nth-of-type(2)"
    );

    if (!headerBlock) return { name: null, number: null };

    const row1El = headerBlock.querySelector<HTMLElement>("div:nth-child(1)");
    const row2El = headerBlock.querySelector<HTMLElement>("div:nth-child(2)");

    const row1 = readCleanText(row1El);
    const row2 = readCleanText(row2El);

    // Seletores específicos para nome
    const nameSaved = readCleanText(row1El?.querySelector("span div div span") ?? null);
    const nameUnsaved = readCleanText(row2El?.querySelector("span div span") ?? null);

    // Seletores específicos para número
    const numberSaved = readCleanText(row2El?.querySelector("span div span") ?? null);
    const numberUnsaved = readCleanText(row1El?.querySelector("span div div span") ?? null);

    let name: string | null = null;
    let number: string | null = null;

    if (row1 && phoneRegex.test(row1)) {
      number = row1;
      name = row2 || null;
    } else if (row2 && phoneRegex.test(row2)) {
      number = row2;
      name = row1 || null;
    } else {
      name =
        nameSaved ||
        nameUnsaved ||
        (row1 && !phoneRegex.test(row1) ? row1 : null) ||
        (row2 && !phoneRegex.test(row2) ? row2 : null);

      number =
        (numberSaved && phoneRegex.test(numberSaved) ? numberSaved : null) ||
        (numberUnsaved && phoneRegex.test(numberUnsaved) ? numberUnsaved : null) ||
        (row1 && phoneRegex.test(row1) ? row1 : null) ||
        (row2 && phoneRegex.test(row2) ? row2 : null);
    }

    return { name, number };
  };

  const panelInfo = getHeaderInfoFromRightPanel();
  const sanitizedName =
    panelInfo.name?.replace(/~/g, "").trim() || null;

  return { name: sanitizedName, number: panelInfo.number };
}

export function useWhatsappContactInfo() {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const lastKey = useRef<string | null>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const update = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        const info = readContact();
        const key = info ? `${info.number ?? ""}|${info.name ?? ""}` : null;
        if (key && key !== lastKey.current) {
          lastKey.current = key;
          setContact(info);
        }
      }, 120);
    };

    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true, subtree: true });
    update();

    return () => {
      if (timeout) clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  return contact;
}
