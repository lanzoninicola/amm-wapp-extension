import { useEffect, useRef, useState } from "react";

export type ContactInfo = { name: string | null; number: string | null };

const phoneRegex = /^\+?\d[\d ()+-]{6,}$/;

function readContact(): ContactInfo | null {
  const getHeaderInfoFromRightPanel = () => {
    const container = document.querySelector(
      "#app > div > div > div:nth-of-type(3) > div > div:nth-of-type(6) > span > div > span > div > div > section > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > span > div"
    );

    if (!container)
      return { name: null as string | null, number: null as string | null };

    // Seletores específicos enviados para nome
    const row1 =
      container.querySelector("div span")?.textContent?.trim() || null;
    const row2 = container.querySelector("span")?.textContent?.trim() || null;

    let name: string | null = null;
    let number: string | null = null;

    if (row1 && phoneRegex.test(row1)) {
      number = row1;
      name = row2 || null;
    } else if (row2 && phoneRegex.test(row2)) {
      number = row2;
      name = row1 || null;
    }

    return { name, number };
  };

  const panelInfo = getHeaderInfoFromRightPanel();

  return { name: panelInfo.name, number: panelInfo.number };
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
