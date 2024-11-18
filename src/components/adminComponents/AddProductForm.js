import React, { useState } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';

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

    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(''); // 'success' or 'error'

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
        <Box sx={{ overflowX: 'hidden', display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
            <div className="content" style={{ width: '100%', maxWidth: '600px' }}>
                <h1 align="center">Add Product</h1>

                <form
                    onSubmit={handleSubmit}
                    style={{
                        border: '2px solid #000',
                        borderRadius: '10px',
                        padding: '20px',
                        backgroundColor: '#f9f9f9',
                    }}
                >
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
                            <option value="Skin Care">Skin Care</option>
                            <option value="Hair Care">Hair Care</option>
                            <option value="Foot Care">Foot Care</option>
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
                        <button type="submit">Add Product</button>
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
            </div>
        </Box>
    );
};

export default AddProductForm;
