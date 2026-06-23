import React from "react";
import './Item.css';
import { API_BASE_URL } from '../../../config.js';

import { Button, Card } from 'react-bootstrap';

function Item({picture_url, description, price, name, productid}) {

    function handleAddToCart() {
        const token = localStorage.getItem('token');


        fetch(`${API_BASE_URL}/cart/add-to-cart`, {
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

    

    //Split into pounds and pence so the pence can sit small, like a storefront price tag
    const [pounds, pence] = Number(price).toFixed(2).split('.');

    return (
        <div className="item_display ">
            <Card border="light">
                <Card.Img  variant="top"  src={picture_url} alt={name}  />
                <Card.Body>
                    <Card.Header>{name}</Card.Header>
                    <Card.Text >{description}</Card.Text>
                    <Card.Subtitle className="price_tag">
                        <span className="price_symbol">£</span>
                        <span className="price_pounds">{pounds}</span>
                        <span className="price_pence">{pence}</span>
                    </Card.Subtitle>
                    <div className="basket">

                        <Button type="button" className="btn btn-success" onClick={handleAddToCart}>
                            Add to basket
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};


export default Item;