import React, { useContext, useState } from 'react';
import SubtotalContext from '../../../contexts/SubtotalContext'; // adjust path
import { Card, Form } from 'react-bootstrap';
import './BasketItem.css'

function BasketItem({ id, name, description, picture_url, price, qty, setBasketItems }) {
  const [quantity, setQuantity] = useState(qty);

  //Keep subtotal global with context (awkward to get data between files otherwise)
  const { setSubtotal } = useContext(SubtotalContext);
  const token = localStorage.getItem('token');

  //Upon the qty inside the basket changing, update the backend qty and the total cost of the cart
  const handleQtyChange = async (e) => {
    const newQty = Number(e.target.value);
    setQuantity(newQty);
    try {
      await fetch('http://localhost:4000/cart/update-cart-qty', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
         },
        body: JSON.stringify({ productid: id, qty: newQty}),
        
      });

      const subtotalRes = await fetch('http://localhost:4000/cart/update-cart-subtotal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        Authorization: `Bearer ${token}`
      });

      //Sets subtotal to the global value so it can be updated in checkout.js
      const { subtotal } = await subtotalRes.json();
      setSubtotal(subtotal || 0);
      
      //If no items are in basket via removal, then smartly filter it out without relogging back
      if (newQty === 0) {
        setBasketItems(prevItems => prevItems.filter(item => item.id !== id));
      }

    } catch (err) {
      console.error('Failed to update qty/subtotal:', err);
    }
  };

  return (
    <div className="basket_item">
      <Card border="light">
        <Card.Img variant="top" src={picture_url} />
        <Card.Body>
          <Card.Header>{name}</Card.Header>
          <Card.Text>{description}</Card.Text>
          <Card.Subtitle>£{price}</Card.Subtitle>
          <div className="number_of_items">
            <Form.Control
              type="number"
              min={0}
              max={20}
              value={quantity}
              onChange={handleQtyChange}
            />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default BasketItem;
