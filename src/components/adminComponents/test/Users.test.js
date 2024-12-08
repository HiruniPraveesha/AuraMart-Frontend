import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import '@testing-library/jest-dom';
import Users from "../Users";
import { useAdminAuthContext } from "../../../hooks/useAdminAuthContext";

// Mocking the useAdminAuthContext hook
jest.mock("../../../hooks/useAdminAuthContext");
jest.mock('../Sidebar.js', () => () => <div>Mocked Sidebar</div>);

beforeEach(() => {
    // Mock admin authentication
    useAdminAuthContext.mockReturnValue({ admin: true });
});

// Mock fetch for API calls
global.fetch = jest.fn();

describe("Users Component", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders Total Users count correctly", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { _id: "1", email: "test@example.com", firstName: "John", lastName: "Doe", mobile: "1234567890", isBlocked: false },
                { _id: "2", email: "jane@example.com", firstName: "Jane", lastName: "Smith", mobile: "0987654321", isBlocked: true },
            ],
        });
    
        render(<Users />);
    
        // Wait for the user count to appear
        await waitFor(() => {
            expect(screen.getByText("Total Users:")).toBeInTheDocument();
            expect(screen.getByText("2")).toBeInTheDocument();
        });
    
        // Optionally, log the DOM to debug
        console.log(screen.debug());
    });

    test("displays user data in the table", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { _id: "1", email: "test@example.com", firstName: "John", lastName: "Doe", mobile: "1234567890", isBlocked: false },
            ],
        });

        render(<Users />);

        // Wait for the user data to be fetched and rendered
        await waitFor(() => screen.getByText("test@example.com"));

        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("1234567890")).toBeInTheDocument();
    });

    test("handles user blocking and unblocking", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { _id: "1", email: "test@example.com", firstName: "John", lastName: "Doe", mobile: "1234567890", isBlocked: false },
            ],
        });
    
        render(<Users />);
    
        // Wait for the user data to load
        await waitFor(() => screen.getByText("test@example.com"));
    
        // Find the user row and use within to get the correct button
        const userRow = screen.getByText("test@example.com").closest("tr");
    
        // Check for the block button within this row
        const blockButton = within(userRow).getByRole('button', { name: /Block/i });
    
        // Mock PUT fetch call for blocking
        fetch.mockResolvedValueOnce({ ok: true });
    
        // Click Block button
        fireEvent.click(blockButton);
    
        // Confirm the block action in the dialog
        fireEvent.click(screen.getByText("Block"));
    
        // Wait for fetchUsers to be called again
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    
        expect(fetch).toHaveBeenCalledWith("http://localhost:7002/api/user/block-user/1", { method: "PUT" });
    });

    test("handles user deletion", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { _id: "1", email: "test@example.com", firstName: "John", lastName: "Doe", mobile: "1234567890", isBlocked: false },
            ],
        });

        render(<Users />);

        // Wait for the user data to load
        await waitFor(() => screen.getByText("test@example.com"));

        // Mock DELETE fetch call
        fetch.mockResolvedValueOnce({ ok: true });

        // Click Delete button
        fireEvent.click(screen.getByText("Delete"));

        // Confirm the deletion in the dialog
        fireEvent.click(screen.getByText("Delete"));

        // Wait for fetchUsers to be called again
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

        expect(fetch).toHaveBeenCalledWith("http://localhost:7002/api/user/1", { method: "DELETE" });
    });
    
});
