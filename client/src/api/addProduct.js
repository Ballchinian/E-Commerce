import React, { useState } from 'react';
/**this pathway is not properly built or beautified as it would require an entire form process
 of being a trusted user to upload. Its left to show how an api would be added as a skeleton
 too add a product you first have to login through /login
**/
import './addProduct.css'
import { API_BASE_URL } from '../config';

function AddProduct() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('description', form.description);
    formData.append('image', form.image);

    try {
      const res = await fetch(`${API_BASE_URL}/api/add-product`, {
        method: 'POST',
        body: formData,
        headers: { 
          Authorization: `Bearer ${token}`
         },
      });
        
      const data = await res.json();
      if (res.ok) alert('Product added!');
      else alert(data.message);
    } catch (err) {
      console.error('Error uploading product:', err);
      alert('Upload failed');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="add-product-form">
      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={handleChange}
        required />
      <input
        type="number"
        name="price"
        placeholder="Price"
        onChange={handleChange}
        required />
      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
        required />
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleChange}
        required />
      <button type="submit">Add Product</button>
  </form>

  );
}

export default AddProduct;
