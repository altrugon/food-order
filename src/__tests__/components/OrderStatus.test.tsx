import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import OrderStatus from "@/components/OrderStatus/OrderStatus";

describe("OrderStatus Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders null when orderId is not provided", () => {
    const { container } = render(<OrderStatus orderId="" />);
    expect(container.firstChild).toBeNull();
  });

  it("initializes EventSource with correct URL", () => {
    const mockEventSource = jest.fn(() => ({
      onmessage: null,
      close: jest.fn(),
    }));

    global.EventSource = mockEventSource as any;

    render(<OrderStatus orderId="order123" />);

    expect(mockEventSource).toHaveBeenCalledWith("/api/status/order123");
  });

  it("displays status from EventSource message", async () => {
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

    render(<OrderStatus orderId="order123" />);

    if (messageHandler) {
      act(() => {
        (messageHandler as (event: any) => void)({
          data: JSON.stringify({ status: "Preparing" }),
        });
      });
    }

    await waitFor(() => {
      expect(screen.getByText("Preparing")).toBeInTheDocument();
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

    const { unmount } = render(<OrderStatus orderId="order123" />);
    unmount();

    expect(closeFunc).toHaveBeenCalled();
  });

  it("displays order status in correct styling", async () => {
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

    const { container } = render(<OrderStatus orderId="order123" />);

    if (messageHandler) {
      act(() => {
        (messageHandler as (event: any) => void)({
          data: JSON.stringify({ status: "Out for Delivery" }),
        });
      });
    }

    await waitFor(() => {
      const statusDiv = container.querySelector(".bg-green-100");
      expect(statusDiv).toBeInTheDocument();
    });
  });
});
