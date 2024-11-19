import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import { Box, Card, CardMedia, CardContent, Typography, Rating, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Button } from '@mui/material';
import { useProductsContext } from '../../hooks/useProductsContext';
// import { useSellerLogout } from '../../hooks/useSellerLogout';
// import { useSellerAuthContext } from '../../hooks/useSellerAuthContext';

const SellerDashboard = () => {
  const { products, dispatch } = useProductsContext();
  // const { seller } = useSellerAuthContext();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('http://localhost:7005/api/seller');
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_PRODUCTS', payload: json });
      }
    };

    fetchProducts();
  }, [dispatch]);

  const handleDelete = async (productId) => {
    const response = await fetch('http://localhost:7005/api/product/' + productId, {
      method: 'DELETE',
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_PRODUCT', payload: json });
    }
  };

  // const { sellerlogout } = useSellerLogout();

  // const handleClick = () => {
  //   sellerlogout();
  // };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginBottom: '20px', marginTop: '20px' }}
        component={Link}
        to="/addProduct"
      >
        Add Product
      </Button>

      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#6200EA' }}>
              <TableCell style={{ fontSize: '18px', fontWeight: 'bold', color: '#FFFFFF' }}>Product</TableCell>
              <TableCell style={{ fontSize: '18px', fontWeight: 'bold', color: '#FFFFFF' }}>Price</TableCell>
              <TableCell style={{ fontSize: '18px', fontWeight: 'bold', color: '#FFFFFF' }}>Total Ratings</TableCell>
              <TableCell style={{ fontSize: '18px', fontWeight: 'bold', color: '#FFFFFF' }}>Description</TableCell>
              <TableCell style={{ fontSize: '18px', fontWeight: 'bold', color: '#FFFFFF' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products &&
              products.map((product) => (
                <TableRow key={product._id} sx={{ '&:hover': { backgroundColor: '#F0F0F0' } }}>
                  <TableCell>
                    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                      {product.images && product.images.length > 0 && (
                        <Card
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            maxWidth: '250px',
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'scale(1.02)',
                              boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
                            },
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="auto"
                            image={product.images[0].url}
                            alt={product.title}
                            sx={{ pb: 1, width: '100%', height: '150px', objectFit: 'cover' }}
                          />
                          <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
                              {product.title}
                            </Typography>
                          </CardContent>
                        </Card>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Rs. {product.price}.00
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating name="totalrating" value={product.totalrating} readOnly />
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                        ({product.ratings.length} ratings)
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {product.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#D32F2F',
                        color: '#FFFFFF',
                        '&:hover': { backgroundColor: '#B71C1C' },
                      }}
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SellerDashboard;
