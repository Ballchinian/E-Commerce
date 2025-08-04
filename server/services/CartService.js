async function getCartId({ userid }, db) {
  const result = await db.query('SELECT id FROM carts WHERE userid = $1', [userid]);
  return result.rows[0]?.id || null;
}

async function checkCart({ userid }, db) {

    //Gets date for modified/created values (year, month, day notation)
    const date = new Date().toISOString().split('T')[0];
    const result = await db.query('SELECT * FROM carts WHERE userid = $1;', 
        [userid]);
    const cart = result.rows[0];
    
    //Create a new cart if there wasnt one already, then return id of the cart
    if (!cart) {
        const insertResult = await db.query(
            'INSERT INTO carts (userid, modified, created) VALUES ($1, $2, $3) RETURNING id;',
            [userid, date, date]
        );
        return insertResult.rows[0].id;
    }

    //Return id of cart while showing its been modified
    await db.query('UPDATE carts SET modified = $1 WHERE userid = $2;', 
        [date, userid]);
    return cart.id;
}

async function addToCart({ cartid, productid, qty = 1 }, db) {
    // Check if the product is already in the cart
    const checkResult = await db.query(
        `SELECT qty FROM cartitems WHERE cartid = $1 AND productid = $2`,
        [cartid, productid]
    );

    if (checkResult.rows.length > 0) {
        // Product exists, update quantity
        const currentQty = checkResult.rows[0].qty;
        await db.query(
            `UPDATE cartitems SET qty = $1 WHERE cartid = $2 AND productid = $3`,
            [currentQty + qty, cartid, productid]
        );
    } else {
        // Product doesn't exist, insert new item
        await db.query(
            `INSERT INTO cartitems (cartid, productid, qty) VALUES ($1, $2, $3)`,
            [cartid, productid, qty]
        );
    }
    return { success: true, message: 'Item added/updated in cart' };
}








module.exports = { addToCart, checkCart, getCartId };
