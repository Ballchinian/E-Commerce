import SubtotalContext from '../../../contexts/SubtotalContext';
import { Card, Button } from 'react-bootstrap';
import './Checkout.css';
import React, { useContext } from 'react';
import { API_BASE_URL } from '../../../config.js';

function Checkout({ setBasketItems }) {
  //Global subtotal values for ease of use. 
  const { subtotal, setSubtotal } = useContext(SubtotalContext);
  const token = localStorage.getItem('token');


  const cartToOrder = async () => {
    try {
      await fetch(`${API_BASE_URL}/order/cart-to-order`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
         },
        body: JSON.stringify({ subtotal }),
        
      });
      setBasketItems([])
      setSubtotal(0);
      
    } catch (err) {
      console.error('Failed to update the cart as an order:', err);
    }
  };


  
  return (
    <Card id="checkout" border="warning">
      <Card.Body id="main_checkout">
        <Card.Header>Subtotal: £{(subtotal || 0).toFixed(2)}</Card.Header>
        <Button variant="warning" onClick={cartToOrder}>Proceed to Checkout</Button>
      </Card.Body>
    </Card>
  );
}

export default Checkout;
