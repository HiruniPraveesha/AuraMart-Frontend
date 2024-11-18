import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(product);
        try {
            await axios.post('http://localhost:7005/api/seller', product);
            console.log('Product added successfully!');
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "images") {
            setProduct({
                ...product,
                images: [{ url: value }],
            });
        } else {
            setProduct({ ...product, [name]: value });
        }
    };

    return (
        <Box sx={{ overflowX: "hidden", display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
            <div className="content" style={{ width: '100%', maxWidth: '600px' }}>
                <h1 align="center">Add Product</h1>
                <form onSubmit={handleSubmit}>
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
                        <input
                            type="text"
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
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
            </div>
        </Box>
    );
};

export default AddProductForm;
