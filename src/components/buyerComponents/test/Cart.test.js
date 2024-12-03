import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import CartPage from '../Cart';
import { AuthContext } from '../../hooks/useAuthContext';

test('renders CartPage with loading indicator', () => {
  render(
    <AuthContext.Provider value={{ user: { token: 'mockToken' } }}>
      <CartPage />
    </AuthContext.Provider>
  );

  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});