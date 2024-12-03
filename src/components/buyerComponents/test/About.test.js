import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutUsPage from '../About';
import '@testing-library/jest-dom'; 

test('renders "Our Story" section', async () => {
  render(<AboutUsPage />);
  const linkElement = await screen.findByText(/Our Story/i); 
  expect(linkElement).toBeInTheDocument();
});

test('checks if the "Our Story" image is loaded', () => {
    render(<AboutUsPage />);
    
   
    const image = screen.getByAltText('Our Story');
  
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://img.freepik.com/free-photo/young-woman-pharmacist-pharmacy_1303-25532.jpg?size=626&ext=jpg');
  });