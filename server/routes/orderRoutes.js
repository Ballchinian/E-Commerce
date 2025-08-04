const express = require('express');
const router = express.Router();
const db = require('../db/pool'); 
const { getCartId } = require('../services/CartService');

router.post('/cart-to-order', async (req, res) => {
    const { subtotal } = req.body;
    const userid = req.user.userId;
    const cartid = await getCartId({ userid }, db);
    const date = new Date().toISOString().split('T')[0];
    
    try {

        const cartItemsResult = await db.query('SELECT * FROM cartitems WHERE cartid = $1',
            [cartid]
        );
        //id, cartid, productid, qty
        const cartItems = cartItemsResult.rows;

        if (cartItems.length === 0) {
            console.log("hello!")
            return res.status(300).json({ message: 'There are no items in basket to add to order' });
        }

        const toGetOrderId = await db.query('INSERT INTO orders (status, userid, created, total) VALUES ($1, $2, $3, $4) RETURNING id',
            ["On its way", userid, date, subtotal]
        );
        const orderid = toGetOrderId.rows[0].id; 
        
        //Insert all the cartItems into the new orderitems list
        await Promise.all(cartItems.map(cartItem =>
        db.query(
            'INSERT INTO orderitems (orderid, qty, productid) VALUES ($1, $2, $3)',
            [orderid, cartItem.qty, cartItem.productid]
        )
        ));
        
        //Remove the carts as they have resolved
        await db.query(`DELETE FROM cartitems WHERE cartid = $1`, 
            [cartid])

        await db.query('DELETE FROM carts WHERE id = $1', 
            [cartid])

        res.json({ success: true, message: 'carts removed, orders have been added to' });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error fetching products' });
    }
    });



module.exports = router;

