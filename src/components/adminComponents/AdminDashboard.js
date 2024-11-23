import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import { Box, Card, CardMedia, CardContent, Typography, Rating, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Button } from '@mui/material';
import { useProductsContext } from '../../hooks/useProductsContext';
import { useAdminLogout } from '../../hooks/useAdminLogout'
import { useAdminAuthContext } from '../../hooks/useAdminAuthContext';

const AdminDashboard = () => {

    const { products, dispatch } = useProductsContext()
    const { admin } = useAdminAuthContext()

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch('http://localhost:7005/api/product')
            const json = await response.json()

            if (response.ok) {
                dispatch({ type: 'SET_PRODUCTS', payload: json })
            }
        }

        fetchProducts()
    }, [dispatch]);

    const handleDelete = async (productId) => {
        const response = await fetch('http://localhost:7005/api/product/' + productId, {
            method: 'DELETE'
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({ type: 'DELETE_PRODUCT', payload: json })
        }
    }

    const { adminlogout } = useAdminLogout()

    const handleClick = () => {
        adminlogout()
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <div className="container">
            <div className="sidebar">
                <div className="logo">
                <h1>AuraMart</h1>
                </div>
                <div className="menu">
                <Link to="/admin-dashboard">Admin Dashboard</Link>
                <Link to="/addProduct">Add Product</Link>
                {!admin && (
                    <div>
                        <Link to="/adminLogin">Login</Link>
                        <Link to="/adminrSignup">Signup</Link>
                    </div>
                )}
                {admin && (
                    <div>
                        <Button onClick={handleClick}>Log Out</Button>
                        <span>{admin.email}</span>
                        </div>
                )}
                </div>
            </div>
            <div className="content">
            <Box sx={{ overflowX: "hidden", marginTop: "96px", marginLeft: "200px" }}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontSize: '18px', fontWeight: 'bold' }}>Product</TableCell>
                            <TableCell style={{ fontSize: '18px', fontWeight: 'bold' }}>Price</TableCell>
                            <TableCell style={{ fontSize: '18px', fontWeight: 'bold' }}>Total Ratings</TableCell>
                            <TableCell style={{ fontSize: '18px', fontWeight: 'bold' }}>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products && products.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell>
                                    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                                        {product.images && product.images.length > 0 && (
                                            <Card sx={{
                                                display: "flex",
                                                py: 2,
                                                flexDirection: "column",
                                                height: "100%",
                                                maxWidth: "250px",
                                                transition: "transform 0.2s ease-in-out",
                                                "&:hover": {
                                                    transform: "scale(1.02)",
                                                    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)"
                                                }
                                            }}>
                                                <CardMedia component="img" height="auto" image={product.images[0].url} alt={product.title} sx={{ pb: 1, width: '30%', margin: "0 auto" }} />
    
    
                                                <CardContent sx={{ flex: 1 , margin: "0 auto"}}>
                                                    <Box>
                                                        <Typography variant="h6" gutterBottom style={{ fontWeight: 600 }} >
                                                            {product.title}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </Link>
                                </TableCell>
                                <TableCell>Rs.{product.price}.00</TableCell>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Rating name="totalrating" value={product.totalrating} readOnly />
                                        <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                                            ({product.ratings.length} ratings)
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body1" color="textSecondary" paragraph={true}>
                                        {product.description}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Button style={{ backgroundColor: '#BE2308', color: 'white' }} onClick={() => handleDelete(product._id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    </div>
    </div>
    </Box>
    )  
}

export default AdminDashboard;

