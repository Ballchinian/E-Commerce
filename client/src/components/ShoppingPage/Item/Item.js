import React from "react";
import './Item.css';


import { Button, Card } from 'react-bootstrap';

function Item({picture_url, description, price, name, productid}) {

    function handleAddToCart() {
        const token = localStorage.getItem('token');


        fetch('http://localhost:4000/cart/add-to-cart', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
             },
            body: JSON.stringify({productid}),
            

        })
        //parses the response as JSON
        .then(res => res.json())
        //Gives user feedback
        .then(() => {
            alert('Item added to cart');
        })
        .catch(err => console.error('Error:', err));
        }

    

    return (
        <div class="item_display ">
            <Card border="light">
                <Card.Img  variant="top"  src={picture_url} alt="Item display"  />
                <Card.Body>
                    <Card.Header>{name}</Card.Header>
                    <Card.Text >{description}</Card.Text>
                    <Card.Subtitle>£{price}</Card.Subtitle>
                    <div class="basket">

                        <Button type="button" class="btn btn-success" onClick={handleAddToCart}>
                            Add to basket
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};


export default Item;