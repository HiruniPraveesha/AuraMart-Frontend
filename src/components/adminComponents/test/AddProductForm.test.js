import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AddProductForm from '../AddProductForm'; // Update with the correct path if necessary
import axios from 'axios';

// Mock the axios requests
jest.mock('axios');

jest.mock('../Sidebar.js', () => () => <div>Mocked Sidebar</div>);

test('renders Add Product button after API call', async () => {
    // Mock the API response for categories
    axios.get.mockResolvedValue({
        data: [
            { _id: '1', name: 'Category 1', slug: 'category-1' },
            { _id: '2', name: 'Category 2', slug: 'category-2' },
        ],
    });

    render(<AddProductForm />);

    // Wait for the categories to be fetched and the button to be rendered
    await waitFor(() => {
        const addProductButton = screen.getByRole('button', { name: /Add Product/i });
        expect(addProductButton).toBeInTheDocument();
    });
});

test('displays success message after successfully adding product', async () => {
    // Mock the API responses
    axios.get.mockResolvedValue({
        data: [
            { _id: '1', name: 'Category 1', slug: 'category-1' },
            { _id: '2', name: 'Category 2', slug: 'category-2' },
        ],
    });

    axios.post.mockResolvedValue({});

    render(<AddProductForm />);

    // Wait for the categories to load
    await waitFor(() => {
        expect(screen.getByText('Category 1')).toBeInTheDocument();
        expect(screen.getByText('Category 2')).toBeInTheDocument();
    });

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: 'Test Product' } });
    fireEvent.change(screen.getByLabelText(/Description:/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText(/Price:/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Category:/i), { target: { value: 'category-1' } });
    fireEvent.change(screen.getByLabelText(/Brand:/i), { target: { value: 'Test Brand' } });
    fireEvent.change(screen.getByLabelText(/Quantity:/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Image URL:/i), { target: { value: 'http://example.com/image.jpg' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Add Product/i }));

    // Wait for the success message
    await waitFor(() => {
        const successMessage = screen.getByText(/Product added successfully!/i);
        expect(successMessage).toBeInTheDocument();
        expect(successMessage).toHaveStyle('color: green');
    });
});

test('clears the form after a successful submission', async () => {
    // Mock the API responses
    axios.get.mockResolvedValue({
        data: [
            { _id: '1', name: 'Category 1', slug: 'category-1' },
            { _id: '2', name: 'Category 2', slug: 'category-2' },
        ],
    });

    axios.post.mockResolvedValue({});

    render(<AddProductForm />);

    // Wait for the categories to load
    await waitFor(() => {
        expect(screen.getByText('Category 1')).toBeInTheDocument();
        expect(screen.getByText('Category 2')).toBeInTheDocument();
    });

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: 'Test Product' } });
    fireEvent.change(screen.getByLabelText(/Description:/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText(/Price:/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Category:/i), { target: { value: 'category-1' } });
    fireEvent.change(screen.getByLabelText(/Brand:/i), { target: { value: 'Test Brand' } });
    fireEvent.change(screen.getByLabelText(/Quantity:/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Image URL:/i), { target: { value: 'http://example.com/image.jpg' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Add Product/i }));

    // Wait for the success message and form reset
    await waitFor(() => {
        const successMessage = screen.getByText(/Product added successfully!/i);
        expect(successMessage).toBeInTheDocument();
        expect(successMessage).toHaveStyle('color: green');

        // Check if form fields are reset
        expect(screen.getByLabelText(/Title:/i).value).toBe('');
        expect(screen.getByLabelText(/Description:/i).value).toBe('');
        expect(screen.getByLabelText(/Price:/i).value).toBe('');
        expect(screen.getByLabelText(/Category:/i).value).toBe('');
        expect(screen.getByLabelText(/Brand:/i).value).toBe('');
        expect(screen.getByLabelText(/Quantity:/i).value).toBe('');
        expect(screen.getByLabelText(/Image URL:/i).value).toBe('');
    });
});

test('form fields are empty when the user first visits the page', async () => {
    // Mock the API response for categories
    axios.get.mockResolvedValue({
        data: [
            { _id: '1', name: 'Category 1', slug: 'category-1' },
            { _id: '2', name: 'Category 2', slug: 'category-2' },
        ],
    });

    render(<AddProductForm />);

    // Wait for the categories to load
    await waitFor(() => {
        expect(screen.getByText('Category 1')).toBeInTheDocument();
        expect(screen.getByText('Category 2')).toBeInTheDocument();
    });

    // Check if form fields are initially empty
    expect(screen.getByLabelText(/Title:/i).value).toBe('');
    expect(screen.getByLabelText(/Description:/i).value).toBe('');
    expect(screen.getByLabelText(/Price:/i).value).toBe('');
    expect(screen.getByLabelText(/Category:/i).value).toBe('');
    expect(screen.getByLabelText(/Brand:/i).value).toBe('');
    expect(screen.getByLabelText(/Quantity:/i).value).toBe('');
    expect(screen.getByLabelText(/Image URL:/i).value).toBe('');
});

test('displays error message on API failure', async () => {
    // Mock the API response for categories and simulate POST failure
    axios.get.mockResolvedValue({
        data: [
            { _id: '1', name: 'Category 1', slug: 'category-1' },
            { _id: '2', name: 'Category 2', slug: 'category-2' },
        ],
    });
    axios.post.mockRejectedValue(new Error('Failed to add product'));

    render(<AddProductForm />);

    // Wait for categories to load
    await waitFor(() => {
        expect(screen.getByText('Category 1')).toBeInTheDocument();
    });

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: 'Test Product' } });
    fireEvent.change(screen.getByLabelText(/Description:/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText(/Price:/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Category:/i), { target: { value: 'category-1' } });

    // Attempt to submit the form
    fireEvent.click(screen.getByRole('button', { name: /Add Product/i }));

    // Wait for the error message to appear
    await waitFor(() => {
        expect(screen.getByText(/Failed to add product. Please try again./i)).toBeInTheDocument();
    });
});

