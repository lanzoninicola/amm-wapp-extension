import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CrmDialog } from "./crm-dialog";
import { useWhatsappContactInfo } from "../../../hooks/use-whatsapp-contact-info";

vi.mock("../../../hooks/use-whatsapp-contact-info", () => ({
  useWhatsappContactInfo: vi.fn(),
}));

vi.mock("../../../utils/send-message-to-background", () => ({
  sendMessageToBackground: vi.fn(),
}));

describe("CrmDialog", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("loads contact data and sends when configured", async () => {
    vi.useFakeTimers();

    const mockedUseWhatsappContactInfo = vi.mocked(useWhatsappContactInfo);
    mockedUseWhatsappContactInfo.mockReturnValue({
      name: "Ana",
      number: "+55 11 9999-8888",
    });

    localStorage.setItem(
      "crmConfig",
      JSON.stringify({
        crmConfig: {
          baseUrl: "https://crm.example.com",
          endpoint: "/api/crm/contato",
          apiKey: "",
          checkEndpoint: "/api/crm/customers",
        },
      })
    );

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    globalThis.fetch = fetchMock as typeof fetch;

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(<CrmDialog />);

    const triggerButton = screen.getByRole("button");
    await user.click(triggerButton);

    await vi.runAllTimersAsync();

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Nome do contato")).toHaveValue("Ana");
    });

    const sendButton = screen.getByRole("button", { name: "Enviar" });
    await waitFor(() => expect(sendButton).toBeEnabled());

    await user.click(sendButton);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));

    const lastCall = fetchMock.mock.calls[fetchMock.mock.calls.length - 1];
    expect(lastCall?.[0]).toBe("https://crm.example.com/api/crm/contato");
    expect(lastCall?.[1]).toMatchObject({ method: "POST" });
    expect(JSON.parse(String(lastCall?.[1]?.body))).toMatchObject({
      name: "Ana",
      phone: "+55 11 9999-8888",
      source: "whatsapp-web",
    });
  });
});
