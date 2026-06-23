# E-Commerce App

A full stack shopping website inspired by the feel of Amazon. Create an account
(or sign in with Google or Facebook), browse a product catalogue with fuzzy
search and price filtering, build a basket, and check out to turn it into an
order. An admin page allows new products to be added with an uploaded image.

## Features

* Account system with email/password, plus Google and Facebook sign-in
* Password reset by email with a single-use, time-limited link
* Product catalogue with a fuzzy search bar, price-range slider, and sorting
* Per-user basket with live quantity editing and a server-calculated subtotal
* Checkout that converts the basket into a saved order
* Admin product upload with image validation and storage
* JWT-protected API and route guarding on the client

## Documentation

* [API Endpoints](./ENDPOINTS.md)

---

# How the App Is Organised

The project is split into a React frontend (`/client`) and an Express + PostgreSQL
backend (`/server`).

The **server is the source of truth**. The client holds an access token and the
display state, but every price, quantity, and order total is recomputed on the
backend from the database, so a tampered request can't invent a cheaper subtotal
or a basket it doesn't own. Each protected request carries the user's id inside
its token, and the cart, order, and product queries are all scoped to that id.

Routes are layered in `server.js`:

1. **Public** — authentication (`/auth`) and the static product images (`/uploads`).
2. **The auth gate** — `verifyToken` rejects anything without a valid access token.
3. **Protected** — products, cart, orders, and the admin product upload all sit
   behind the gate.

---

# Authentication

Accounts use a single JSON Web Token as the access token.

* Passwords are hashed with **bcrypt** before they ever reach the database.
* On login the server returns a **JWT** signed with `JWT_SECRET` that carries the
  user id and email and expires after **one hour**. The client stores it and
  sends it as a `Bearer` token on every protected request.
* **Google** sign-in verifies the Google ID token's signature and audience
  (`GOOGLE_CLIENT_ID`) server-side, then links to an existing account with the
  same email or creates one.
* **Facebook** sign-in validates the user access token against the Graph API and
  links or creates an account the same way.
* **Password reset** emails a single-use token (via Nodemailer) that expires in
  one hour; completing the reset clears the token so the link can't be reused.

On the client, `ProtectedRoute` keeps unauthenticated visitors out of the
shopping, basket, and admin pages, and the server's `verifyToken` middleware is
the real enforcement behind it.

---

# Search, Filter & Sort

All catalogue filtering happens on the client once the products are fetched, so
typing and dragging the slider feel instant.

| Control       | Behaviour                                                                 |
| ------------- | ------------------------------------------------------------------------- |
| Search bar    | Fuzzy match using Levenshtein edit distance, tolerant of small typos       |
| Price slider  | Two-handle range; the upper handle at its max (`999`) means "no maximum"   |
| Sort dropdown | Price low-to-high, price high-to-low, or alphabetical                      |

The search tolerance scales with word length: tokens of two characters or fewer
must match exactly, short words allow one edit, and longer words allow two. A
product matches when the query is contained in its name or is within the allowed
edit distance of one of its words.

---

# Basket & Orders

## The basket

There is **one cart per user**, created on demand the first time something is
added. Adding a product that is already in the basket bumps its quantity instead
of duplicating the row.

Editing a quantity in the basket updates the backend and then asks the server for
a fresh subtotal, so the displayed total always reflects real product prices.
Setting a quantity to zero removes the item from the cart and from the view
without a full reload.

## Checkout

Checkout converts the current basket into an **order**: a new order row is created
with the subtotal and a status, every basket line is copied into the order's
items, and the now-resolved cart is cleared. An empty basket can't be checked out.

---

# Products & Images

Seed products are stored with a name, price, description, and an image URL.

New products are added through the admin **Add Product** page (`/addProduct`),
which is intended for the admin account and sits behind the auth gate. Uploads go
through **Multer** with a file filter that only accepts `.jpg`/`.png` images and a
2 MB size limit; the saved file is served back as a public URL under `/uploads`,
which is then stored on the product. This means catalogue images can come either
from the seeded URLs or from a real upload, rather than being hard-coded into the
frontend.

---

# Typical Flow

1. Register, or sign in with email, Google, or Facebook.
2. Browse the catalogue; search, filter by price, and sort.
3. Add products to your basket.
4. Open the basket, adjust quantities, and watch the subtotal update.
5. Check out to turn the basket into an order.
6. (Admin) Add new products with an uploaded image from `/addProduct`.

---

# Tech Stack

* **Frontend:** React 19, React Router, Bootstrap / React-Bootstrap, MUI (price
  slider), Formik + Yup (forms and validation), fastest-levenshtein (search),
  Google & Facebook sign-in. Hosted on **Netlify**.
* **Backend:** Node.js, Express 5, PostgreSQL (`pg`), JSON Web Tokens, bcrypt,
  Nodemailer, Multer, google-auth-library. Hosted on **Railway**.
* **Testing:** Jest and Supertest (backend).

---

# Running Locally

### Server

```
cd server
npm install
node setupDatabase.js   # creates the tables and a seed admin account
npm start               # starts the API (PORT defaults to 4000)
```

The server reads its configuration from a `.env` file (`DATABASE_URL`,
`JWT_SECRET`, `EMAIL_USERNAME`, `EMAIL_PASSWORD`, `GOOGLE_CLIENT_ID`, and the
Facebook app credentials). Set `API_BASE_URL` to this server's public URL so
uploaded image links resolve correctly.

### Client

```
cd client
npm install
npm start
```

Set `REACT_APP_API_BASE_URL` to point the client at your local server; otherwise
it falls back to the deployed backend.
