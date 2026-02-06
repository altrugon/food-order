import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import OrderStatusPage from "@/app/status/[id]/page";

// Mock the use hook to directly return the resolved params object
jest.mock("react", () => {
  const actual = jest.requireActual("react");
  return {
    ...actual,
    use: (promise: any) => {
      // Return the already-resolved params directly
      if (promise && typeof promise === "object" && "id" in promise) {
        return promise;
      }
      // For actual promises, we can't synchronously await in tests
      // so we'll return a default object
      return { id: "order123" };
    },
  };
});

describe("OrderStatusPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays loading message initially", () => {
    let messageHandler: ((event: any) => void) | null = null;

    const mockEventSource = {
      set onmessage(handler: (event: any) => void) {
        messageHandler = handler;
      },
      get onmessage(): ((event: any) => void) | null {
        return messageHandler;
      },
      close: jest.fn(),
    };

    global.EventSource = jest.fn(() => mockEventSource) as any;

    // Pass a plain object with id property
    render(<OrderStatusPage params={{ id: "order123" } as any} />);

    expect(screen.getByText(/Loading order/i)).toBeInTheDocument();
  });

  it("displays order details when data is received", async () => {
    let messageHandler: ((event: any) => void) | null = null;

    const mockEventSource = {
      set onmessage(handler: (event: any) => void) {
        messageHandler = handler;
      },
      get onmessage(): ((event: any) => void) | null {
        return messageHandler;
      },
      close: jest.fn(),
    };

    global.EventSource = jest.fn(() => mockEventSource) as any;

    const orderData = {
      id: "order123",
      status: "Preparing",
      customer: {
        name: "John Doe",
        address: "123 Main St",
        phone: "555-1234",
      },
      items: [
        { id: "1", name: "Pizza", qty: 2, price: 12 },
        { id: "2", name: "Burger", qty: 1, price: 10 },
      ],
      total: 34,
    };

    render(<OrderStatusPage params={{ id: "order123" } as any} />);

    if (messageHandler) {
      act(() => {
        (messageHandler as (event: any) => void)({
          data: JSON.stringify(orderData),
        });
      });
    }

    await waitFor(() => {
      expect(screen.getByText("Order Tracking")).toBeInTheDocument();
      expect(screen.getByText("Preparing")).toBeInTheDocument();
    });
  });

  it("displays customer information", async () => {
    let messageHandler: ((event: any) => void) | null = null;

    const mockEventSource = {
      set onmessage(handler: (event: any) => void) {
        messageHandler = handler;
      },
      get onmessage(): ((event: any) => void) | null {
        return messageHandler;
      },
      close: jest.fn(),
    };

    global.EventSource = jest.fn(() => mockEventSource) as any;

    const orderData = {
      id: "order123",
      status: "Out for Delivery",
      customer: {
        name: "Alice Smith",
        address: "456 Oak Ave",
        phone: "555-9876",
      },
      items: [{ id: "1", name: "Coffee", qty: 1, price: 5 }],
      total: 5,
    };

    render(<OrderStatusPage params={{ id: "order123" } as any} />);

    if (messageHandler) {
      act(() => {
        (messageHandler as (event: any) => void)({
          data: JSON.stringify(orderData),
        });
      });
    }

    await waitFor(() => {
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
      expect(screen.getByText("456 Oak Ave")).toBeInTheDocument();
      expect(screen.getByText("555-9876")).toBeInTheDocument();
    });
  });

  it("displays order items with quantities and prices", async () => {
    let messageHandler: ((event: any) => void) | null = null;

    const mockEventSource = {
      set onmessage(handler: (event: any) => void) {
        messageHandler = handler;
      },
      get onmessage(): ((event: any) => void) | null {
        return messageHandler;
      },
      close: jest.fn(),
    };

    global.EventSource = jest.fn(() => mockEventSource) as any;

    const orderData = {
      id: "order123",
      status: "Preparing",
      customer: {
        name: "John Doe",
        address: "123 Main St",
        phone: "555-1234",
      },
      items: [
        { id: "1", name: "Pizza", qty: 2, price: 12 },
        { id: "2", name: "Burger", qty: 1, price: 10 },
      ],
      total: 34,
    };

    render(<OrderStatusPage params={{ id: "order123" } as any} />);

    if (messageHandler) {
      act(() => {
        (messageHandler as (event: any) => void)({
          data: JSON.stringify(orderData),
        });
      });
    }

    await waitFor(() => {
      expect(screen.getByText(/Pizza × 2/)).toBeInTheDocument();
      expect(screen.getByText(/Burger × 1/)).toBeInTheDocument();
    });
  });

  it("displays correct total amount", async () => {
    let messageHandler: ((event: any) => void) | null = null;

    const mockEventSource = {
      set onmessage(handler: (event: any) => void) {
        messageHandler = handler;
      },
      get onmessage(): ((event: any) => void) | null {
        return messageHandler;
      },
      close: jest.fn(),
    };

    global.EventSource = jest.fn(() => mockEventSource) as any;

    const orderData = {
      id: "order123",
      status: "Delivered",
      customer: {
        name: "John Doe",
        address: "123 Main St",
        phone: "555-1234",
      },
      items: [
        { id: "1", name: "Pizza", qty: 2, price: 12 },
        { id: "2", name: "Burger", qty: 1, price: 10 },
      ],
      total: 34,
    };

    render(<OrderStatusPage params={{ id: "order123" } as any} />);

    if (messageHandler) {
      act(() => {
        (messageHandler as (event: any) => void)({
          data: JSON.stringify(orderData),
        });
      });
    }

    await waitFor(() => {
      expect(screen.getByText("€34.00")).toBeInTheDocument();
    });
  });

  it("closes EventSource on unmount", () => {
    const closeFunc = jest.fn();
    const mockEventSource = {
      set onmessage(handler: (event: any) => void) {},
      get onmessage(): ((event: any) => void) | null {
        return null;
      },
      close: closeFunc,
    };

    global.EventSource = jest.fn(() => mockEventSource) as any;

    const { unmount } = render(
      <OrderStatusPage params={{ id: "order123" } as any} />,
    );
    unmount();

    expect(closeFunc).toHaveBeenCalled();
  });
});
