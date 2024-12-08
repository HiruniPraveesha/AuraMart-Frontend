import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AllOrders from "../AllOrders"; // Adjust path as needed
import { AdminAuthContext } from "../../../context/AdminAuthContext"; // Adjust path as needed
import axios from "axios";
import "@testing-library/jest-dom"; // Ensure this import is present

jest.mock('../Sidebar.js', () => () => <div>Mocked Sidebar</div>);
jest.mock("axios");

describe("AllOrders Component", () => {
  const mockDispatch = jest.fn(); // Mock the dispatch function

  const mockAdmin = {
    token: "mock-token", // Add any properties your component expects
    name: "Admin User",
  };

  const mockOrders = [
    {
      _id: "12345abcde",
      createdAt: "2023-12-01T00:00:00.000Z",
      orderStatus: "Pending",
    },
    {
      _id: "67890fghij",
      createdAt: "2023-12-02T00:00:00.000Z",
      orderStatus: "Confirm",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the total orders count", async () => {
    axios.get.mockResolvedValueOnce({ data: mockOrders });
  
    render(
      <AdminAuthContext.Provider value={{ admin: mockAdmin, dispatch: mockDispatch }}>
        <AllOrders />
      </AdminAuthContext.Provider>
    );
  
    // Wait for the total orders count to be updated
    await waitFor(() => {
      expect(screen.getByText(/Total Orders/i)).toBeInTheDocument();
      expect(screen.getByText(mockOrders.length.toString())).toBeInTheDocument();
    });
  });

  test("handles errors gracefully", async () => {
    axios.get.mockRejectedValueOnce(new Error("API Error"));

    render(
      <AdminAuthContext.Provider value={{ admin: mockAdmin, dispatch: mockDispatch }}>
        <AllOrders />
      </AdminAuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Total Orders/i)).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument(); // Total orders should be 0 on error
    });
  });
  

  test("renders the orders table", async () => {
    axios.get.mockResolvedValueOnce({ data: mockOrders });
  
    render(
      <AdminAuthContext.Provider value={{ admin: mockAdmin, dispatch: mockDispatch }}>
        <AllOrders />
      </AdminAuthContext.Provider>
    );
  
    // Wait for the orders table to be populated
    await waitFor(() => {
      // Verify that the order IDs are rendered in the table rows
      const orderIdCell1 = screen.getByText("12345abcde"); // Exact match
      const orderIdCell2 = screen.getByText("67890fghij"); // Exact match
  
      expect(orderIdCell1).toBeInTheDocument();
      expect(orderIdCell2).toBeInTheDocument();
    });
  });
  
  test("updates the order status on change", async () => {
    axios.get.mockResolvedValueOnce({ data: mockOrders });
    axios.put.mockResolvedValueOnce({ status: 200 });
  
    render(
      <AdminAuthContext.Provider value={{ admin: mockAdmin, dispatch: mockDispatch }}>
        <AllOrders />
      </AdminAuthContext.Provider>
    );
  
    // Ensure `waitFor` and `await` are used within an `async` function
    await waitFor(async () => {
      const statusSelectButton = screen.getByRole('button'); // Get the dropdown button
      fireEvent.mouseDown(statusSelectButton); // Open the select dropdown
  
      // Wait for the option and click
      const confirmOption = await screen.findByText(/Confirm/i);
      fireEvent.click(confirmOption);
  
      // Assert that the PUT request was made with the correct data
      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith(
          "http://localhost:7003/api/order/update-order/12345abcde",
          { status: "Confirm" }
        );
      });
    });
  });  
  
});

