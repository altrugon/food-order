import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Cart from "@/components/Cart/Cart";
import { useCart } from "@/lib/store";
import { useRouter } from "next/navigation";

jest.mock("@/lib/store");
jest.mock("next/navigation");

const mockClear = jest.fn();
const mockPush = jest.fn();

describe("Cart Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays empty cart message when no items", () => {
    (useCart as unknown as jest.Mock).mockReturnValue({
      items: [],
      total: 0,
      clear: mockClear,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    render(<Cart />);

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  it("displays cart items with quantities and prices", () => {
    (useCart as unknown as jest.Mock).mockReturnValue({
      items: [
        { id: "1", name: "Pizza", qty: 2, price: 12 },
        { id: "2", name: "Burger", qty: 1, price: 10 },
      ],
      total: 34,
      clear: mockClear,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    render(<Cart />);

    expect(screen.getByText(/Pizza × 2/)).toBeInTheDocument();
    expect(screen.getByText(/Burger × 1/)).toBeInTheDocument();
    expect(screen.getByText("€34.00")).toBeInTheDocument();
  });

  it("clears cart when Clear Cart button is clicked", () => {
    (useCart as unknown as jest.Mock).mockReturnValue({
      items: [{ id: "1", name: "Pizza", qty: 1, price: 12 }],
      total: 12,
      clear: mockClear,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    render(<Cart />);

    const clearButton = screen.getByRole("button", { name: /Clear Cart/i });
    fireEvent.click(clearButton);

    expect(mockClear).toHaveBeenCalled();
  });

  it("disables Place Order button when cart is empty", () => {
    (useCart as unknown as jest.Mock).mockReturnValue({
      items: [],
      total: 0,
      clear: mockClear,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    render(<Cart />);

    const placeOrderButton = screen.getByRole("button", {
      name: /Place Order/i,
    });
    expect(placeOrderButton).toBeDisabled();
  });

  it("enables Place Order button when cart has items", () => {
    (useCart as unknown as jest.Mock).mockReturnValue({
      items: [{ id: "1", name: "Pizza", qty: 1, price: 12 }],
      total: 12,
      clear: mockClear,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    render(<Cart />);

    const placeOrderButton = screen.getByRole("button", {
      name: /Place Order/i,
    });
    expect(placeOrderButton).not.toBeDisabled();
  });

  it("navigates to checkout when Place Order is clicked", () => {
    (useCart as unknown as jest.Mock).mockReturnValue({
      items: [{ id: "1", name: "Pizza", qty: 1, price: 12 }],
      total: 12,
      clear: mockClear,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    render(<Cart />);

    const placeOrderButton = screen.getByRole("button", {
      name: /Place Order/i,
    });
    fireEvent.click(placeOrderButton);

    expect(mockPush).toHaveBeenCalledWith("/checkout");
  });
});
