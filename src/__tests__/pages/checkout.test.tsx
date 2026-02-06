import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CheckoutPage from "@/app/checkout/page";
import { useCart } from "@/lib/store";
import { useRouter } from "next/navigation";

jest.mock("@/lib/store");
jest.mock("next/navigation");

const mockClear = jest.fn();
const mockPush = jest.fn();

describe("CheckoutPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useCart as jest.Mock).mockReturnValue({
      items: [{ id: "1", name: "Pizza", qty: 1, price: 12 }],
      total: 12,
      clear: mockClear,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ id: "order123" }),
      }),
    ) as jest.Mock;
  });

  it("renders delivery details form", () => {
    render(<CheckoutPage />);

    expect(screen.getByText("Delivery Details")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Full name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Delivery address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Phone number")).toBeInTheDocument();
  });

  it("disables checkout button when form is empty", () => {
    render(<CheckoutPage />);

    const checkoutButton = screen.getByRole("button", { name: /Checkout/i });
    expect(checkoutButton).toBeDisabled();
  });

  it("enables checkout button when all fields are filled", async () => {
    render(<CheckoutPage />);

    const nameInput = screen.getByPlaceholderText(
      "Full name",
    ) as HTMLInputElement;
    const addressInput = screen.getByPlaceholderText(
      "Delivery address",
    ) as HTMLInputElement;
    const phoneInput = screen.getByPlaceholderText(
      "Phone number",
    ) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(addressInput, { target: { value: "123 Main St" } });
    fireEvent.change(phoneInput, { target: { value: "123456789" } });

    const checkoutButton = screen.getByRole("button", { name: /Checkout/i });

    await waitFor(() => {
      expect(checkoutButton).not.toBeDisabled();
    });
  });

  it("submits order with correct data", async () => {
    render(<CheckoutPage />);

    const nameInput = screen.getByPlaceholderText("Full name");
    const addressInput = screen.getByPlaceholderText("Delivery address");
    const phoneInput = screen.getByPlaceholderText("Phone number");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(addressInput, { target: { value: "123 Main St" } });
    fireEvent.change(phoneInput, { target: { value: "123456789" } });

    const checkoutButton = screen.getByRole("button", { name: /Checkout/i });
    fireEvent.click(checkoutButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/orders",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            items: [{ id: "1", name: "Pizza", qty: 1, price: 12 }],
            total: 12,
            customer: {
              name: "John Doe",
              address: "123 Main St",
              phone: "123456789",
            },
          }),
        }),
      );
    });
  });

  it("clears cart and navigates to status page after successful order", async () => {
    render(<CheckoutPage />);

    const nameInput = screen.getByPlaceholderText("Full name");
    const addressInput = screen.getByPlaceholderText("Delivery address");
    const phoneInput = screen.getByPlaceholderText("Phone number");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(addressInput, { target: { value: "123 Main St" } });
    fireEvent.change(phoneInput, { target: { value: "123456789" } });

    const checkoutButton = screen.getByRole("button", { name: /Checkout/i });
    fireEvent.click(checkoutButton);

    await waitFor(() => {
      expect(mockClear).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/status/order123");
    });
  });

  it("updates form fields on input change", () => {
    render(<CheckoutPage />);

    const nameInput = screen.getByPlaceholderText(
      "Full name",
    ) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "Alice" } });

    expect(nameInput.value).toBe("Alice");
  });
});
