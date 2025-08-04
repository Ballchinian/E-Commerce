const express = require('express');
const router = express.Router();
const pool = require('../db/pool'); 
const { checkCart, addToCart, getCartId } = require('../services/CartService');



router.post('/add-to-cart', async (req, res) => {
    try {
        const userid = req.user.userId;
        const { productid } = req.body;
        if (!userid || !productid) {
            return res.status(400).json({ success: false, message: 'Missing userid or productid' });
        }
        
        //Check cart either gives the current cart or makes a new one and gives its id (one cart per user so userid is 1-1 with it)
        const cartid = await checkCart({ userid }, pool);
        const result = await addToCart({ cartid, productid }, pool);

        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


router.post('/productsForBasket', async (req, res) => {

  try {
  const userid = req.user.userId;
  //Checks the cart for all the productids and their qty's
  const cartid = await getCartId({ userid }, pool);
  const cartItemsResult = await pool.query(
      'SELECT productid, qty FROM cartitems WHERE cartid = $1',
      [cartid]
    );
  const cartItems = cartItemsResult.rows;

  //Empty cart check
  if (cartItems.length === 0) {
      return res.json([]); 
  }

  //Collects all the products into a list
  const productIds = cartItems.map(item => item.productid);
  const productResult = await pool.query(`
    SELECT * FROM products WHERE id = ANY($1)`, 
    [productIds]);


  //Returns products alongside the qty of them
  const productsWithQty = productResult.rows.map(product => {
    const item = cartItems.find(i => i.productid === product.id);
    return {
      ...product,
      qty: item.qty
    };
  });

  res.json(productsWithQty);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching products' });
  }
});


router.post('/update-cart-qty', async (req, res) => {
  try {
    const userid = req.user.userId;
    const { productid, qty } = req.body;
    if (!productid || qty === undefined || !userid) {
      return res.status(400).json({ message: 'Missing data' });
    }
  
    // Get cartid for user
    const cartid = await getCartId({ userid }, pool);
    if (!cartid) return res.status(404).json({ message: 'Cart not found' });

    if (qty === 0) {
      // Delete the item from the cart
      await pool.query(
        'DELETE FROM cartitems WHERE cartid = $1 AND productid = $2',
        [cartid, productid]
      );
      return res.json({ success: true, message: 'Item removed from cart' });
    }

    // Update qty in cartitems
    await pool.query(
      'UPDATE cartitems SET qty = $1 WHERE cartid = $2 AND productid = $3',
      [qty, cartid, productid]
    );

    res.json({ success: true, message: 'Quantity updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }

});

router.post('/update-cart-subtotal', async (req, res) => {
  try {
    const userid = req.user.userId;
    if (!userid) return res.status(400).json({ message: 'Missing userid' });

    const cartid = await getCartId({ userid }, pool);
    if (!cartid) return res.status(404).json({ message: 'Cart not found' });

    //Gather qty and id of products in cart
    const cartItemsResult = await pool.query(
      'SELECT productid, qty FROM cartitems WHERE cartid = $1',
      [cartid]
    );

    const cartItems = cartItemsResult.rows;

    if (cartItems.length === 0) {
      return res.json({ subtotal: 0, cartItems: [] });
    }

    //Get just the id's of the items, then using that, we get the price from the product SQL table and put it all in a list
    const productIds = cartItems.map(item => item.productid);
    const priceList = await pool.query(
      'SELECT id, price FROM products WHERE id = ANY($1)',
      [productIds]
    );

    //Maps each productid to its price
    const priceMap = {};
    priceList.rows.forEach(row => {
      priceMap[row.id] = row.price;
    });

    //Adds the entire object together with qty in mind. 
    const finalPrice = cartItems.reduce((acc, item) => {
      const price = priceMap[item.productid] || 0;
      return acc + price * item.qty;
    }, 0);

    return res.json({ subtotal: finalPrice  });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
