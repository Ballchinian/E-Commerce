import React, { useEffect, useState } from 'react';
import Item from '../Item/Item'; 
//This allows for filtering in searchbar
import { distance } from 'fastest-levenshtein'; 
import { API_BASE_URL } from '../../../config.js';

function ItemListings({searchQuery, priceRange, sortType}) {
  //Allows for ease of access to varables for list of products loaded. 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${API_BASE_URL}/product/products`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  

  //From searchQuerry (told to update from banner.js) we can make a list of filteredProducts for user
  const filteredProducts = products.filter(product => {
  const query = searchQuery.toLowerCase().trim();
  if (!query) return true; // no query = all products

  const name = product.name.toLowerCase();
  const words = name.split(/\s+/);
  const queryTokens = query.split(/\s+/);

  // allow max edit distance depending on length
  const allowedEdits = (len) => {
    if (len <= 2) return 0; // tiny tokens must match exactly
    if (len <= 4) return 1;
    return 2;
  };

  const matchesQuery = queryTokens.every(token => {
    const edits = allowedEdits(token.length);
    return (
      name.includes(token) || 
      words.some(word => distance(word, token) <= edits)
    );
  });

  const [minPrice, maxPrice] = priceRange;
  const hasNoMax = maxPrice >= 999;
  const priceMatches =
    product.price >= minPrice && (hasNoMax || product.price <= maxPrice);

  return matchesQuery && priceMatches;
});


  //After filtering, we can sort the products based on the filter
  let sortedProducts = [...filteredProducts];
  if (sortType === 'Price-low') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortType === 'Price-high') {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortType === 'Alphabetical') {
    sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
  }


  if (loading) return <p>Loading products...</p>;
  if (!sortedProducts.length) return <p>No products match your search.</p>;

  return (
    <>
      {sortedProducts.map(product => (
        <Item
          key={product.id}
          productid={product.id}
          name={product.name}
          price={product.price}
          description={product.description}
          picture_url={product.picture_url}
        />
      ))}
    </>
  );
}

export default ItemListings;
