import React, { useEffect, useState } from 'react';
import BasketItem from '../BasketItem/BasketItem';
import { API_BASE_URL } from '../../../config.js';

function Basket({basketItems, setBasketItems}) {
    
    //It is always loading until its loaded, then setProducts (local list of values from backend basket)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        async function fetchProducts() {

            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${API_BASE_URL}/cart/productsForBasket`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setBasketItems(data);
            } catch (err) {
                console.error('Failed to fetch products:', err);
            } finally {
                setLoading(false);
            }
        }
        
        
        fetchProducts();
    }, [setBasketItems]);

    if (loading) return <p>Loading products...</p>;
    if (!basketItems.length) return <p>No products in basket.</p>;

    return (
        <>
        {/* setBasketItems is given to basketItems for smart removal of item if user reduces qty of it to 0 */}
        {basketItems.map(product => (
            
            <BasketItem 
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                description={product.description}
                picture_url={product.picture_url}
                qty={product.qty}
                setBasketItems={setBasketItems} 

            />
        ))}
        </>
    );


 
};


export default Basket;

