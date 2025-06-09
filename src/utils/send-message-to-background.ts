/**
 *
 * @param action  The action to be performed in the background script.
 * @param payload  Optional payload to send with the action.
 * @returns
 */
export async function sendMessageToBackground<T = unknown>(
  action: string,
  payload: Record<string, unknown> = {}
): Promise<T> {
  return new Promise((resolve, reject) => {
    console.log("Enviando mensagem para o background:", { action, payload });

    // @ts-expect-error if (!chrome || !chrome.runtime || !chrome.runtime.lastError) {
    if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
      return reject(
        new Error("chrome.runtime.sendMessage não está disponível.")
      );
    }

    // @ts-expect-error if (!chrome || !chrome.runtime || !chrome.runtime.lastError) {
    chrome.runtime.sendMessage({ type: action, data: payload }, (response) => {
      // @ts-expect-error if (!chrome || !chrome.runtime || !chrome.runtime.lastError) {
      if (chrome.runtime.lastError) {
        console.error(
          "Erro ao enviar mensagem para o background script:",
          // @ts-expect-error if (!chrome || !chrome.runtime || !chrome.runtime.lastError) {
          chrome.runtime.lastError
        );
        // @ts-expect-error if (!chrome || !chrome.runtime || !chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError.message));
      }

      if (response?.error) {
        console.error("Erro na resposta do background script:", response.error);
        return reject(new Error(response.error));
      }

      console.log("Resposta recebida do background script:", response);
      resolve(response?.data as T);
    });
  });
}
