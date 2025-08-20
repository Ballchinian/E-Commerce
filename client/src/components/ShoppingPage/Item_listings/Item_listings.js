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

  const [minPrice, maxPrice] = priceRange;

  //From searchQuerry (told to update from banner.js) we can make a list of filteredProducts for user
  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase();
    const name = product.name.toLowerCase();
    
    //Matches the result with the products within one letter for flexible searching
    const nameMatches = 
    name.includes(query) || distance(name, query) <= 2;

    //HasNoMax allows for price range to go beyond 999
    const hasNoMax = maxPrice >= 999;
    const priceMatches =
    product.price >= minPrice && (hasNoMax || product.price <= maxPrice);


    return nameMatches && priceMatches;
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
