import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useAdminLogout } from "../../hooks/useAdminLogout";

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState('Users');
  const links = [
    { name: 'Products', link: '/admin-dashboard', icon: '🛍️' },
    { name: 'Add Product', link: '/addProduct', icon: '➕' },
    { name: 'Orders', link: '/AllOrders', icon: '📦' },
    { name: 'Users', link: '/Users', icon: '👤' },
    { name: 'Statistics', link: '/UsersChart', icon: '📊' },
  ];

  const { adminlogout } = useAdminLogout();

  const handleLogoutClick = () => {
    adminlogout();
  };

  return (
    <Box
      sx={{
        width: '270px',
        height: '100vh',
        backgroundColor: '#4A148C',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        top: 0,
        left: 0,
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          padding: '15px',
          borderRadius: '8px',
          backgroundColor: '#7B1FA2',
          fontSize: '20px',
          fontWeight: 'bold',
        }}
      >
        Admin Dashboard
      </Box>
      <Divider sx={{ backgroundColor: '#fff', opacity: 0.2, marginY: '20px' }} />
      <List sx={{ flexGrow: 1, overflowY: 'auto' }}> {/* Ensure the list can scroll if needed */}
        {links.map((item, index) => (
          <Link
            key={index}
            to={item.link} // Use Link to navigate
            style={{
              textDecoration: 'none',
              display: 'block',
            }}
          >
            <ListItemButton
              onClick={() => setActiveLink(item.link)} // Set active link on click
              sx={{
                backgroundColor: activeLink === item.link ? '#D1C4E9' : 'transparent',
                color: activeLink === item.link ? '#4A148C' : '#fff',
                '&:hover': {
                  backgroundColor: '#B39DDB',
                },
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                transition: 'background-color 0.3s ease',
              }}
            >
              <Box sx={{ marginRight: '10px', fontSize: '18px' }}>{item.icon}</Box>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </Link>
        ))}
      </List>
      <Divider sx={{ backgroundColor: '#fff', opacity: 0.2, marginY: '20px' }} />
      <Box
        onClick={handleLogoutClick}
        sx={{
          textAlign: 'center',
          padding: '12px',
          color: 'white',
          backgroundColor: '#6A1B9A',
          textDecoration: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '35px', // Add space at the bottom of the button
        }}
        component={Link}
        to="/"
      >
        Logout
      </Box>
    </Box>
  );
};

export default Sidebar;
