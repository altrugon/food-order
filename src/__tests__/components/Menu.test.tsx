import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Menu from "@/components/Menu/Menu";
import { useCart } from "@/lib/store";

jest.mock("@/lib/store");
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

const mockAdd = jest.fn();
const mockRemove = jest.fn();

describe("Menu Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCart as unknown as jest.Mock).mockReturnValue({
      add: mockAdd,
      remove: mockRemove,
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              id: "1",
              name: "Pizza",
              description: "Cheese pizza",
              price: 12,
              image: "/menu-images/pizza.svg",
            },
            {
              id: "2",
              name: "Burger",
              description: "Beef burger",
              price: 10,
              image: "/menu-images/burger.svg",
            },
          ]),
      }),
    ) as jest.Mock;
  });

  it("fetches and displays menu items", async () => {
    render(<Menu />);

    await waitFor(() => {
      expect(screen.getByText("Pizza")).toBeInTheDocument();
      expect(screen.getByText("Burger")).toBeInTheDocument();
    });
  });

  it("displays item prices", async () => {
    render(<Menu />);

    await waitFor(() => {
      expect(screen.getByText("€12")).toBeInTheDocument();
      expect(screen.getByText("€10")).toBeInTheDocument();
    });
  });

  it("calls add when add button is clicked", async () => {
    render(<Menu />);

    await waitFor(() => {
      expect(screen.getByText("Pizza")).toBeInTheDocument();
    });

    const addButtons = screen.getAllByRole("button", { name: /add/i });
    fireEvent.click(addButtons[0]);

    expect(mockAdd).toHaveBeenCalled();
  });

  it("calls remove when remove button is clicked", async () => {
    render(<Menu />);

    await waitFor(() => {
      expect(screen.getByText("Pizza")).toBeInTheDocument();
    });

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    fireEvent.click(removeButtons[0]);

    expect(mockRemove).toHaveBeenCalled();
  });
});
