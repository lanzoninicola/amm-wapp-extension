import { describe, it, expect, vi, afterEach } from "vitest";
import { initContactCopyButtons } from "./contact-copy";

function buildHeader(row1Text: string, row2Text: string) {
  const app = document.createElement("div");
  app.id = "app";
  document.body.appendChild(app);

  const level1 = document.createElement("div");
  const level2 = document.createElement("div");
  app.appendChild(level1);
  level1.appendChild(level2);

  const level3a = document.createElement("div");
  const level3b = document.createElement("div");
  const level3c = document.createElement("div");
  level2.append(level3a, level3b, level3c);

  const level4 = document.createElement("div");
  level3c.appendChild(level4);

  const level5: HTMLDivElement[] = [];
  for (let i = 0; i < 6; i += 1) {
    const item = document.createElement("div");
    level4.appendChild(item);
    level5.push(item);
  }

  const span6 = document.createElement("span");
  level5[5].appendChild(span6);
  const div7 = document.createElement("div");
  span6.appendChild(div7);
  const span8 = document.createElement("span");
  div7.appendChild(span8);
  const div9 = document.createElement("div");
  span8.appendChild(div9);
  const div10 = document.createElement("div");
  div9.appendChild(div10);
  const section11 = document.createElement("section");
  div10.appendChild(section11);
  const div12 = document.createElement("div");
  section11.appendChild(div12);
  const headerBlock = document.createElement("div");
  div12.appendChild(headerBlock);

  const row1 = document.createElement("div");
  row1.textContent = row1Text;
  const row2 = document.createElement("div");
  row2.textContent = row2Text;
  headerBlock.append(row1, row2);

  return headerBlock;
}

afterEach(() => {
  document.body.innerHTML = "";
  vi.useRealTimers();
});

describe("contact copy buttons", () => {
  it("adds buttons and copies sanitized values", async () => {
    vi.useFakeTimers();

    buildHeader("~Maria", "+55 11 9999-8888");

    const writeText = vi.fn();
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    initContactCopyButtons();
    await vi.runAllTimersAsync();

    const nameButton = document.querySelector(
      'button[data-ammodomio-copy-button="name"]'
    ) as HTMLButtonElement | null;
    const phoneButton = document.querySelector(
      'button[data-ammodomio-copy-button="phone"]'
    ) as HTMLButtonElement | null;

    expect(nameButton).toBeTruthy();
    expect(phoneButton).toBeTruthy();

    nameButton?.click();
    phoneButton?.click();

    expect(writeText).toHaveBeenCalledWith("Maria");
    expect(writeText).toHaveBeenCalledWith("99998888");

    const phoneFeedback = document.querySelector(
      'span[data-ammodomio-copy-feedback="phone"]'
    );
    expect(phoneFeedback?.textContent).toBe("Copiado: 99998888");
  });
});
