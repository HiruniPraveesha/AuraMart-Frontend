// Sidebar.tsx
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

const Sidebar = ({ onLinkClick }) => {
  const [activeLink, setActiveLink] = useState('products');

  const handleLinkClick = (link) => {
    setActiveLink(link);
    onLinkClick(link); // Pass the active link to parent component
  };

  const links = [
    { name: 'Products', link: 'products', icon: '🛍️' },
    { name: 'Add Product', link: 'add-product', icon: '➕' },
    { name: 'Orders', link: 'orders', icon: '📦' },
    { name: 'Users', link: 'users', icon: '👤' },
    { name: 'Statistics', link: 'statistics', icon: '📊' },
  ];

  const Item = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <Box
      sx={{
        width: '300px',
        backgroundColor: '#4A148C',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        padding: '20px',
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
      <List sx={{ flexGrow: 1 }}>
        {links.map((item, index) => (
          <ListItemButton
            key={index}
            onClick={() => handleLinkClick(item.link)}
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
        ))}
      </List>
      <Divider sx={{ backgroundColor: '#fff', opacity: 0.2, marginY: '20px' }} />
      <Box
        sx={{
          textAlign: 'center',
          padding: '10px',
          backgroundColor: '#6A1B9A',
          borderRadius: '8px',
          marginTop: 'auto',
        }}
      >
        Footer Info
      </Box>
    </Box>
  );
};

export default Sidebar;
