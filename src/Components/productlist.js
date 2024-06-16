import React, { useState, useEffect } from 'react';
import './productlist.css'; // Import custom styles for ProductList
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import UpdateProduct from './UpdateProduct';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products with authentication header
        const token = localStorage.getItem('token'); // Retrieve token from storage
        const response = await fetch('http://localhost:5000/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from storage
      const response = await fetch(`http://localhost:5000/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Remove the deleted product from the state
      setProducts(products.filter((product) => product._id !== productId));

      // Show success toast
      toast.success('Product deleted successfully.');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product. Please try again.');
    }
  };

  const handleUpdate = (productId) => {
    // Redirect to update-products route
    navigate(`/update-products/${productId}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Declare filteredProducts here
  let filteredProducts = [];
  if (products.length > 0) {
    filteredProducts = products.filter((product) =>
      (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.company && product.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.price && product.price.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="product-list-container">
      <h1>Our Products</h1>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {/* Example of a search button (optional) */}
        {/* <button className="search-button" onClick={handleSearch}>Search</button> */}
      </div>
      <table className="product-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Company</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length === 0 ? (
            <tr>
              <td colSpan="5">No products found</td>
            </tr>
          ) : (
            filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.company}</td>
                <td>{product.category}</td>
                <td>${product.price}</td>
                <td className="action-cell">
                  <button className="delete-button" onClick={() => handleDelete(product._id)}>Delete</button>
                  <button className="update-button" onClick={() => handleUpdate(product._id)}>Update</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default ProductList;
