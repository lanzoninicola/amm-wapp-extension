export type ComposeMessageResult = "inserted" | "copied" | "failed";

function getWhatsAppComposer(): HTMLElement | null {
  const selectors = [
    "footer [contenteditable='true'][role='textbox']",
    "div[contenteditable='true'][role='textbox'][aria-label]",
    "footer p._aupe.copyable-text",
    "p._aupe.copyable-text",
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element instanceof HTMLElement) {
      const editableRoot = element.closest<HTMLElement>("[contenteditable='true']");
      return editableRoot ?? element;
    }
  }

  return null;
}

function readComposerText(editor: HTMLElement) {
  return (editor.textContent ?? "").trim();
}

function moveCaretToEnd(editor: HTMLElement) {
  const selection = window.getSelection();
  if (!selection) return false;

  const range = document.createRange();
  range.selectNodeContents(editor);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
  return true;
}

function tryPasteInComposer(editor: HTMLElement, text: string) {
  editor.focus();
  if (!moveCaretToEnd(editor)) return false;

  const transfer = new DataTransfer();
  transfer.setData("text/plain", text);

  const pasteEvent = new ClipboardEvent("paste", {
    bubbles: true,
    cancelable: true,
    clipboardData: transfer,
  });

  return editor.dispatchEvent(pasteEvent);
}

function insertTextInComposer(editor: HTMLElement, text: string) {
  editor.focus();
  const selection = window.getSelection();
  if (!selection) return false;

  if (!moveCaretToEnd(editor)) return false;
  if (selection.rangeCount === 0) return false;
  const range = selection.getRangeAt(0);

  const fragment = document.createDocumentFragment();
  const lines = text.replace(/\r\n/g, "\n").split("\n");

  lines.forEach((line, index) => {
    fragment.appendChild(document.createTextNode(line));
    if (index < lines.length - 1) {
      fragment.appendChild(document.createElement("br"));
    }
  });

  range.insertNode(fragment);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);

  editor.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
}

function copyWithTextarea(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  return copied;
}

async function copyContent(text: string) {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback below
  }

  return copyWithTextarea(text);
}

export async function composeMessage(text: string): Promise<ComposeMessageResult> {
  const editor = getWhatsAppComposer();
  if (editor) {
    const previous = readComposerText(editor);

    tryPasteInComposer(editor, text);
    if (readComposerText(editor) !== previous) return "inserted";

    if (insertTextInComposer(editor, text) && readComposerText(editor) !== previous) {
      return "inserted";
    }
  }

  const copied = await copyContent(text);
  return copied ? "copied" : "failed";
}
