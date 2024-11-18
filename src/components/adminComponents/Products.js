import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Box, Card, CardMedia, CardContent, Typography, Rating, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Button, Modal, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useProductsContext } from '../../hooks/useProductsContext';
import { useSellerAuthContext } from '../../hooks/useSellerAuthContext';

const Products = () => {
  const { products, dispatch } = useProductsContext();
  const { seller } = useSellerAuthContext();

  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState({ price: '', quantity: '', description: '' });
  
  // State for confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('http://localhost:7005/api/product');
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_PRODUCTS', payload: json });
      }
    };

    fetchProducts();
  }, [dispatch]);

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    const response = await fetch('http://localhost:7005/api/product/' + productToDelete, {
      method: 'DELETE',
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_PRODUCT', payload: json });
      setOpenDeleteDialog(false); // Close the confirmation dialog
    }
  };

  const handleUpdate = async (productId) => {
    const response = await fetch('http://localhost:7005/api/product/' + productId, {
      method: 'PUT',
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: json });
    }
  };

  const { sellerlogout } = useSellerLogout();

  const handleClick = () => {
    sellerlogout();
  };

  const handleOpen = (product) => {
    setCurrentProduct(product);
    setEditedProduct({ price: product.price, quantity: product.quantity, description: product.description });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmitEdit = async () => {
    const { price, quantity, description } = editedProduct;
    const updatedProduct = { price, quantity, description };
    
    // Optimistically update the products state
    const updatedProductList = products.map((product) =>
      product._id === currentProduct._id
        ? { ...product, price, quantity, description }
        : product
    );
    dispatch({ type: 'SET_PRODUCTS', payload: updatedProductList }); // Update state optimistically
  
    const response = await fetch(`http://localhost:7005/api/product/${currentProduct._id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedProduct),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
  
    if (response.ok) {
      handleClose();  // Close the modal
    } else {
      // Handle any error if the update failed (optional)
      alert('Update failed');
    }
  };
  

  // Open delete confirmation dialog
  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setOpenDeleteDialog(true);
  };

  // Close delete confirmation dialog
  const handleCancelDelete = () => {
    setProductToDelete(null);
    setOpenDeleteDialog(false);
  };

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
                      onClick={() => handleDeleteClick(product._id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#1976D2',
                        color: '#FFFFFF',
                        '&:hover': { backgroundColor: '#388E3C' },
                        marginTop: '10px',
                      }}
                      onClick={() => handleOpen(product)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for editing product */}
      <Modal
  open={open}
  onClose={handleClose}
  sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 2, width: '400px' }}>
    <Typography variant="h6" sx={{ marginBottom: 2 }}>Edit Product</Typography>
    <TextField
      label="Price"
      variant="outlined"
      fullWidth
      name="price"
      value={editedProduct.price}
      onChange={handleEditChange}
      sx={{ marginBottom: 2 }}
    />
    <TextField
      label="Quantity"
      variant="outlined"
      fullWidth
      name="quantity"
      value={editedProduct.quantity}
      onChange={handleEditChange}
      sx={{ marginBottom: 2 }}
    />
    <TextField
      label="Description"
      variant="outlined"
      fullWidth
      name="description"
      value={editedProduct.description}
      onChange={handleEditChange}
      sx={{ marginBottom: 2 }}
    />
    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleClose}
        sx={{ width: '48%' }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmitEdit}
        sx={{ width: '48%' }}
      >
        Update Product
      </Button>
    </Box>
  </Box>
</Modal>


      {/* Delete confirmation dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this product?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
