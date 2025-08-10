import './BasketPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_BASE_URL } from '../../config.js';
import React, { useEffect, useContext, useState } from 'react';
import Basket from '../../components/BasketPage/Basket/Basket';
import Checkout from '../../components/BasketPage/Checkout/Checkout';
import SubtotalContext from '../../contexts/SubtotalContext';


function BasketPage() {
  const token = localStorage.getItem('token');

  //Sets global subtotal when the page loads
  const { setSubtotal } = useContext(SubtotalContext);
  //Sets the scope of basketItems to the top so multiple modules can change it
  const [basketItems, setBasketItems] = useState([]);

  //UseEffect stops program from executing this every re-render to save lag
  useEffect(() => {
    const fetchSubtotal = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cart/update-cart-subtotal`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
           },

        });

        const data = await response.json();
        setSubtotal(data.subtotal || 0);
      } catch (err) {
        console.error('Failed to fetch subtotal on load:', err);
        setSubtotal(0);
      }
    };

    fetchSubtotal();

    //only run this when either setSubtotal or userid are changed (dependency array)
  }, [setSubtotal, token]);

  return (
    <div id="basket_page">
      <div className="basket_items">
        <Basket 
          basketItems = {basketItems}
          setBasketItems= {setBasketItems} 
        />
      </div>
      <Checkout 
        setBasketItems={setBasketItems} 
      />
    </div>
  );
}

export default BasketPage;
