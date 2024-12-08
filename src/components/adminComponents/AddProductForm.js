import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';

const AddProductForm = () => {
    const [product, setProduct] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        brand: '',
        quantity: '',
        images: [{ url: '' }],
    });

    const [categories, setCategories] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(''); // 'success' or 'error'

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:7005/api/product/categories');
                setCategories(response.data); // Set the fetched categories
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:7005/api/product', product);
            setAlertMessage('Product added successfully!');
            setAlertType('success');
            setProduct({
                title: '',
                description: '',
                price: '',
                category: '',
                brand: '',
                quantity: '',
                images: [{ url: '' }],
            }); // Reset form

            // Hide the alert after 9 seconds
            setTimeout(() => {
                setAlertMessage('');
                setAlertType('');
            }, 2000);
        } catch (error) {
            setAlertMessage('Failed to add product. Please try again.');
            setAlertType('error');

            // Hide the alert after 9 seconds
            setTimeout(() => {
                setAlertMessage('');
                setAlertType('');
            }, 2000);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'images') {
            setProduct({
                ...product,
                images: [{ url: value }],
            });
        } else {
            setProduct({ ...product, [name]: value });
        }
    };

    return (
        <Box sx={{ display: 'flex'}}>
            <Sidebar />
       
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                flexGrow: 1,
                marginLeft: '300px', // Matches sidebar width
                padding: '20px',
                overflowY: 'auto',
                boxSizing: 'border-box',
                
                }}
            >
            
            

                <form
                    onSubmit={handleSubmit}
                    style={{
                        border: '2px solid #D3C1EB',
                        borderRadius: '10px',
                        padding: '20px',
                        width: '50%',
                        backgroundColor: '#f9f9f9',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <h1 style={{ textAlign: 'center', color: '#7B1FA2' }}>
                Add Product
            </h1>
                    <label>
                        Title:
                        <input
                            type="text"
                            name="title"
                            value={product.title}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                    </label>
                    <br />
                    <label>
                        Description:
                        <textarea
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                    </label>
                    <br />
                    <label>
                        Price:
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                    </label>
                    <br />
                    <label>
                        Category:
                        <select
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                marginTop: '8px',
                                padding: '10px',
                                borderRadius: '5px',
                                border: '2px solid #ccc',
                                backgroundColor: '#fff',
                                fontSize: '16px',
                                cursor: 'pointer',
                                outline: 'none',
                            }}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category.slug}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <br />
                    <label>
                        Brand:
                        <input
                            type="text"
                            name="brand"
                            value={product.brand}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                    </label>
                    <br />
                    <label>
                        Quantity:
                        <input
                            type="number"
                            name="quantity"
                            value={product.quantity}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                    </label>
                    <br />
                    <label>
                        Image URL:
                        <input
                            type="text"
                            name="images"
                            value={product.images[0]?.url}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', marginBottom: '20px' }}
                        />
                    </label>
                    <br />
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <button type="submit" style={{ backgroundColor: '#7B1FA2' }}>Add Product</button>
                    </Box>
                </form>

                {/* Alert Message */}
                {alertMessage && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                        <div
                            style={{
                                padding: '10px',
                                color: alertType === 'success' ? 'green' : 'red',
                                border: `1px solid ${alertType === 'success' ? 'green' : 'red'}`,
                                borderRadius: '5px',
                                textAlign: 'center',
                                backgroundColor: alertType === 'success' ? '#d4edda' : '#f8d7da',
                            }}
                        >
                            {alertMessage}
                        </div>
                    </Box>
                )}
            
            </Box>
            
        
        </Box>
    );
};

export default AddProductForm;
