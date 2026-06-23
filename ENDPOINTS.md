# API Endpoints

This document describes the E-Commerce App backend API.

## Authentication

Endpoints marked with 🔒 require a **Bearer access token** in the `Authorization`
header (`Authorization: Bearer <token>`). The token is obtained from
`/auth/login` (or the Google/Facebook sign-in routes) and is a JWT that expires
one hour after it is issued.

Everything under `/auth` is public. Everything else — products, cart, orders, and
the admin product upload — sits behind the `verifyToken` gate. Uploaded product
images served from `/uploads` are public.

---

# Authentication & Account — `/auth`

## POST `/auth/register`

Create a new account.

### Input

* First name
* Last name
* Email
* Password

### Returns

* `success` and a message

### Notes

* An email that already has an account is rejected with a friendly message rather
  than a database error.

---

## POST `/auth/login`

Authenticate with email and password.

### Input

* Email
* Password

### Returns

* `success`
* `token` — the JWT access token (expires in one hour)
* `email`

### Errors

* `404` if no account has that email.
* `401` if the password is incorrect.

---

## POST `/auth/google`

Sign in with Google. The client obtains a Google ID token (via the Google sign-in
button) and posts it here.

### Input

* `credential` — the Google ID token (JWT)

### Effects

* Verifies the token's signature and audience (`GOOGLE_CLIENT_ID`) server-side.
* Links to an existing account with the same email, or creates a new one.

### Returns

* `success`
* `token`
* `user` (first name, email)

---

## POST `/auth/facebook`

Sign in with Facebook. The client obtains a Facebook user access token (via the
Facebook JS SDK) and posts it here.

### Input

* `accessToken` — the Facebook user access token

### Effects

* Validates the token against the Facebook Graph API and reads the profile.
* Requires an email from Facebook; links to an existing account with the same
  email, or creates a new one.

### Returns

* `token`
* `user` (first name, email)

---

## POST `/auth/password-reset`

Request a password-reset email.

### Input

* Email

### Effects

* Generates a single-use reset token that expires in one hour and emails a reset
  link (via Nodemailer).

### Errors

* `404` if no account has that email.

---

## POST `/auth/reset-password`

Complete a password reset.

### Input

* `token` — the reset token from the email link
* `newPassword`

### Effects

* Hashes and stores the new password and clears the reset token so the link
  cannot be reused.

---

# Products

## GET `/product/products` 🔒

Retrieve every product in the catalogue (id, name, price, description, image URL).
Searching, filtering, and sorting are all applied on the client.

---

## POST `/api/add-product` 🔒

Add a new product with an uploaded image. Intended for the admin account.

### Input (multipart/form-data)

* `name`
* `price`
* `description`
* `image` — an image file (`.jpg` or `.png`, up to 2 MB)

### Effects

* Validates and stores the image, then saves the product with a public
  `/uploads/...` image URL.

### Errors

* `400` if no image is supplied or the file type is rejected.

---

# Cart 🔒

All cart routes resolve the caller's cart from the user id inside the access
token, creating one on demand.

## POST `/cart/add-to-cart`

Add a product to the basket, or increment its quantity if it is already there.

### Input

* `productid`

---

## POST `/cart/productsForBasket`

Return the full product details for everything in the basket, each annotated with
its quantity. Returns an empty list for an empty basket.

---

## POST `/cart/update-cart-qty`

Set the quantity of a basket item. A quantity of `0` removes the item.

### Input

* `productid`
* `qty`

---

## POST `/cart/update-cart-subtotal`

Recalculate and return the basket subtotal from current product prices.

### Returns

* `subtotal`

---

# Orders 🔒

## POST `/order/cart-to-order`

Convert the current basket into an order.

### Input

* `subtotal`

### Effects

* Creates an order with the subtotal and a status, copies every basket line into
  the order's items, then clears the cart.

### Errors

* `400` if the basket is empty.
