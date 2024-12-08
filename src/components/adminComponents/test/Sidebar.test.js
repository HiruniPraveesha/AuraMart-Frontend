import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';
import '@testing-library/jest-dom';

// Mock the useAdminLogout hook
jest.mock('../../../hooks/useAdminLogout', () => ({
  useAdminLogout: () => ({
    adminlogout: jest.fn(),
  }),
}));

describe('Sidebar Component', () => {
  const renderSidebar = () =>
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

  test('renders sidebar with all links', () => {
    renderSidebar();

    const links = ['Products', 'Add Product', 'Orders', 'Users', 'Statistics'];
    links.forEach((link) => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });
  
  test('renders admin dashboard heading', () => {
    renderSidebar();

    const heading = screen.getByText('Admin Dashboard');
    expect(heading).toBeInTheDocument();
  });

  test('navigates to the correct link on click', () => {
    renderSidebar();

    const ordersLink = screen.getByText('Orders').closest('a');
    expect(ordersLink).toHaveAttribute('href', '/AllOrders');
  });
   
  test('calls adminlogout on logout click', () => {
    const mockLogout = jest.fn();
    jest.spyOn(require('../../../hooks/useAdminLogout'), 'useAdminLogout').mockReturnValue({
      adminlogout: mockLogout,
    });
  
    renderSidebar();
  
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
  
    expect(mockLogout).toHaveBeenCalled();
  });

});
