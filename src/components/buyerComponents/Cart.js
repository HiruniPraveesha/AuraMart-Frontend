import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import { 
    Box, Button, Card, CardContent, Grid, IconButton, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress 
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const { user } = useAuthContext();
    const [cart, setCart] = useState(null);
    const [textFieldValue, setTextFieldValue] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = user?.token;
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get("http://localhost:7001/api/checkout/cart", config);
                setCart(response.data);
            } catch (error) {
                console.error("Error fetching cart:", error.message);
            }
        };

        fetchCart();
    }, [user]);

    const handleRemove = async (productId) => {
        try {
            const token = user?.token;
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.put(
                `http://localhost:7001/api/checkout/cart/${productId}`,
                {},
                config
            );
            if (response?.data?.updatedCart) {
                setCart(response.data.updatedCart);
            }
        } catch (error) {
            console.error("Error removing item:", error.message);
        }
    };

    const handleRemoveAll = async () => {
        try {
            const token = user?.token;
            await axios.delete("http://localhost:7001/api/checkout/empty-cart", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setCart(null);
        } catch (error) {
            console.error("Error clearing cart:", error.message);
        }
    };

    const handleApplyCoupon = async () => {
        try {
            const token = user?.token;
            const response = await axios.post(
                "http://localhost:7001/api/checkout/cart/applycoupon",
                { coupon: textFieldValue },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response?.data) {
                setCouponApplied(true);
                setTimeout(() => window.location.reload(), 2000);
            }
        } catch (error) {
            console.error("Error applying coupon:", error.message);
        }
    };

    const calculateNetTotal = () => {
        if (!cart) return 0;
        const { cartTotal, totalAfterDiscount } = cart;
        return totalAfterDiscount || cartTotal || 0;
    };

    return (
        <Grid container sx={{ mt: 5 }}>
            {/* Cart Table */}
            <Grid item md={8} xs={12} px={3}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="h5" sx={{ fontWeight: "bold" }}>Shopping Cart</Typography>
                            <Button color="error" onClick={handleRemoveAll}>Remove All</Button>
                        </Box>
                        {cart && cart.products ? (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Image</TableCell>
                                            <TableCell>Product</TableCell>
                                            <TableCell>Unit Price</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Total</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cart.products.map((item) => (
                                            <TableRow key={item?.product?._id}>
                                                <TableCell>
                                                    <img
                                                        src={item?.product?.images?.[0]?.url || "placeholder.jpg"}
                                                        alt={item?.product?.title || "No Image"}
                                                        style={{ width: "50px" }}
                                                    />
                                                </TableCell>
                                                <TableCell>{item?.product?.title || "Unknown"}</TableCell>
                                                <TableCell>Rs.{item?.product?.price || 0}.00</TableCell>
                                                <TableCell>{item?.count || 0}</TableCell>
                                                <TableCell>
                                                    Rs.{(item?.product?.price || 0) * (item?.count || 0)}.00
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => handleRemove(item.product._id)}>
                                                        <DeleteIcon color="error" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <CircularProgress />
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Order Summary */}
            <Grid item md={4} xs={12} px={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>Order Summary</Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                            <Typography>Items Total</Typography>
                            <Typography>Rs.{cart?.cartTotal - cart?.tax || 0}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                            <Typography>Discount</Typography>
                            <Typography color="error">- Rs.{cart?.cartTotal - cart?.totalAfterDiscount || 0}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                            <Typography>Tax</Typography>
                            <Typography>+ Rs.{cart?.tax || 0}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                            <Typography sx={{ fontWeight: "bold" }}>Net Total</Typography>
                            <Typography sx={{ fontWeight: "bold" }}>Rs.{calculateNetTotal()}</Typography>
                        </Box>
                        <Button 
                            fullWidth 
                            variant="contained" 
                            color="success" 
                            component={Link} 
                            to={`/payment/${cart?._id || ""}`}
                            sx={{ mt: 3 }}
                        >
                            Pay Now
                        </Button>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default CartPage;
