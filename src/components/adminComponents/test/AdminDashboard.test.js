import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductsProvider } from '../../../context/ProductContext'; // Context provider
import AdminDashboard from '../AdminDashboard';
import fetchMock from 'jest-fetch-mock';

jest.mock('../Sidebar.js', () => () => <div>Mocked Sidebar</div>);
// Mock fetch globally
fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

describe('AdminDashboard Component', () => {
  it('renders without crashing', () => {
    render(
      
        <AdminDashboard />
      
    );
    expect(screen.getByText(/Product/i)).toBeInTheDocument();
  });

  it('fetches and displays products', async () => {
    fetch.mockResponseOnce(
      JSON.stringify([
        { _id: '1', title: 'Product 1', price: 100, totalrating: 4, ratings: [], description: 'Description 1', images: [{ url: 'image1.jpg' }] },
      ])
    )

    render(
      <ProductsProvider>
        <AdminDashboard />
      </ProductsProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
    });
  });

  it('opens the edit modal with correct product data', async () => {
    fetch.mockResponseOnce(
      JSON.stringify([
        { _id: '1', title: 'Product 1', price: 100, totalrating: 4, ratings: [], description: 'Description 1', images: [{ url: 'image1.jpg' }] },
      ])
    );

    render(
      <ProductsProvider>
        <AdminDashboard />
      </ProductsProvider>
    );

    await waitFor(() => {
      const editButton = screen.getAllByText(/Edit/i)[0];
      fireEvent.click(editButton);
      expect(screen.getByText(/Edit Product/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue('100')).toBeInTheDocument(); // Pre-filled price
    });
  });

  it('submits updated product data and optimistically updates UI', async () => {
    fetch.mockResponseOnce(
      JSON.stringify([
        { _id: '1', title: 'Product 1', price: 100, totalrating: 4, ratings: [], description: 'Description 1', images: [{ url: 'image1.jpg' }] },
      ])
    );

    fetch.mockResponseOnce(JSON.stringify({ success: true }));

    render(
      <ProductsProvider>
        <AdminDashboard />
      </ProductsProvider>
    );

    await waitFor(() => {
      const editButton = screen.getAllByText(/Edit/i)[0];
      fireEvent.click(editButton);
    });

    fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '200' } });
    fireEvent.click(screen.getByText(/Update Product/i));

    await waitFor(() => {
      expect(screen.queryByDisplayValue('200')).toBeInTheDocument(); // Optimistic update
    });
  });

  it('opens and closes the delete confirmation dialog', async () => {
    fetch.mockResponseOnce(
      JSON.stringify([
        { _id: '1', title: 'Product 1', price: 100, totalrating: 4, ratings: [], description: 'Description 1', images: [{ url: 'image1.jpg' }] },
      ])
    );

    render(
      <ProductsProvider>
        <AdminDashboard />
      </ProductsProvider>
    );

    await waitFor(() => {
      const deleteButton = screen.getAllByText(/Delete/i)[0];
      fireEvent.click(deleteButton);
      expect(screen.getByText(/Are you sure you want to delete this product/i)).toBeInTheDocument();
    });

    const cancelButton = screen.getByText(/Cancel/i);
    fireEvent.click(cancelButton);

    expect(screen.queryByText(/Are you sure you want to delete this product/i)).not.toBeInTheDocument();
  });

  it('makes a delete API call and updates the UI on success', async () => {
    fetch.mockResponseOnce(
      JSON.stringify([
        { _id: '1', title: 'Product 1', price: 100, totalrating: 4, ratings: [], description: 'Description 1', images: [{ url: 'image1.jpg' }] },
      ])
    );

    fetch.mockResponseOnce(JSON.stringify({ success: true }));

    render(
      <ProductsProvider>
        <AdminDashboard />
      </ProductsProvider>
    );

    await waitFor(() => {
      const deleteButton = screen.getAllByText(/Delete/i)[0];
      fireEvent.click(deleteButton);
      fireEvent.click(screen.getByText(/Delete/i)); // Confirm deletion
    });

    await waitFor(() => {
      expect(screen.queryByText(/Product 1/i)).not.toBeInTheDocument();
    });
  });
});
