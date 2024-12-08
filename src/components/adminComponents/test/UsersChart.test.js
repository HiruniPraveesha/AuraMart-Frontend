import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import UsersChart from "../UsersChart"; // Adjust the import as needed
import { AdminAuthContext } from "../../../context/AdminAuthContext"; // Adjust path as needed

// Mocking fetch globally
global.fetch = jest.fn();

describe("UsersChart Component", () => {
  const mockUsersResponse = [
    { createdAt: "2024-01-15T12:00:00Z" },
    { createdAt: "2024-02-20T12:00:00Z" },
    { createdAt: "2024-03-10T12:00:00Z" },
  ];

  const mockOrdersResponse = [
    { createdAt: "2024-01-05T12:00:00Z" },
    { createdAt: "2024-02-15T12:00:00Z" },
    { createdAt: "2024-03-25T12:00:00Z" },
  ];

  beforeEach(() => {
    fetch.mockClear();
  });

  test("renders correctly and fetches data", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsersResponse,
    });
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockOrdersResponse,
    });
  
    // Mock admin context
    const mockAdminContext = {
      admin: { id: 1, name: "Admin" },
      dispatch: jest.fn(),
    };
  
    render(
      <BrowserRouter>
        <AdminAuthContext.Provider value={mockAdminContext}>
          <UsersChart />
        </AdminAuthContext.Provider>
      </BrowserRouter>
    );
  
    await waitFor(() => screen.getByText("Total Users"));
    screen.debug(); // Output the rendered HTML to check the structure
  
    // Ensure the fetch was called twice (once for users, once for orders)
    expect(fetch).toHaveBeenCalledTimes(2);
  
    // Check if the "Total Users" and "Total Orders" values are rendered
    const totalUsersText = await screen.findByText(mockUsersResponse.length.toString());
    expect(totalUsersText).toBeInTheDocument();
  
    const totalOrdersText = await screen.findByText(mockOrdersResponse.length.toString());
    expect(totalOrdersText).toBeInTheDocument();
  });
  

});
