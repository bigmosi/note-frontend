import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CategoryList.css'; // Import the CSS file

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/v1/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        throw new Error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <div className="categories-container"> {/* Add className for styling */}
      <h2>Categories</h2>
      {categories.length > 0 ? (
        <ul>
          {categories.map((category) => (
            <li key={category._id} className="link-list">
              <Link to={`/category/${category._id}`}>{category.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No categories found.</p>
      )}
    </div>
  );
};

export default CategoryList;
