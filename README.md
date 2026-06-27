# E-Commerce App

A full stack shopping site with the feel of Amazon. Make an account (or sign in with Google or Facebook), browse a catalogue with fuzzy search and price filtering, build a basket, and check out to turn it into an order. There's an admin page for adding new products with an uploaded image.

## Features

- Accounts with email/password, plus Google and Facebook sign-in
- Password reset by email, with a single-use, time limited link
- A product catalogue with fuzzy search, a price range slider, and sorting
- One basket per user, with live quantity editing and a server calculated subtotal
- Checkout that turns the basket into a saved order
- Admin product upload with image validation and storage
- A JWT protected API, with route guarding on the client

Endpoint docs live in [ENDPOINTS.md](./ENDPOINTS.md).

## How it works

The project splits into a React frontend (`/client`) and an Express + PostgreSQL backend (`/server`).

The **server is the source of truth**. The client holds an access token and the display state, but every price, quantity, and order total is recomputed on the backend from the database, so a tampered request can't invent a cheaper subtotal or a basket it doesn't own. Each protected request carries the user's id inside its token, and the cart, order, and product queries are all scoped to that id.

Routes are layered in `server.js`:

1. **Public** - authentication (`/auth`) and the static product images (`/uploads`).
2. **The auth gate** - `verifyToken` rejects anything without a valid access token.
3. **Protected** - products, cart, orders, and the admin product upload all sit behind the gate.

## Authentication

Accounts use a single JSON Web Token as the access token.

- Passwords are hashed with **bcrypt** before they ever reach the database.
- On login the server returns a **JWT** signed with `JWT_SECRET` that carries the user id and email and expires after **one hour**. The client stores it and sends it as a `Bearer` token on every protected request.
- **Google** sign in verifies the Google ID token's signature and audience (`GOOGLE_CLIENT_ID`) server side, then links to an existing account with the same email or creates one.
- **Facebook** sign in validates the user access token against the Graph API and links or creates an account the same way.
- **Password reset** emails a single use token (via Nodemailer) that expires in one hour; completing the reset clears the token so the link can't be reused.

On the client, `ProtectedRoute` keeps unauthenticated visitors out of the shopping, basket, and admin pages, and the server's `verifyToken` middleware is the real enforcement behind it.

## Search, filter, and sort

All catalogue filtering happens on the client once the products are fetched, so typing and dragging the slider feel instant.

| Control | Behaviour |
| --- | --- |
| Search bar | Fuzzy match using Levenshtein edit distance, tolerant of small typos |
| Price slider | Two-handle range; the upper handle at its max (`999`) means "no maximum" |
| Sort dropdown | Price low-to-high, price high-to-low, or alphabetical |

The search tolerance scales with word length: tokens of two characters or fewer must match exactly, short words allow one edit, and longer words allow two. A product matches when the query is contained in its name, or is within the allowed edit distance of one of its words.

## Basket and orders

There's **one cart per user**, created on demand the first time something is added. Adding a product that's already in the basket bumps its quantity instead of duplicating the row.

Editing a quantity updates the backend and then asks the server for a fresh subtotal, so the displayed total always reflects real product prices. Setting a quantity to zero removes the item from the cart and from the view without a full reload.

Checkout turns the current basket into an **order**: a new order row is created with the subtotal and a status, every basket line is copied into the order's items, and the now-resolved cart is cleared. An empty basket can't be checked out.

## Products and images

Seed products are stored with a name, price, description, and an image URL.

New products are added through the admin **Add Product** page (`/addProduct`), which is meant for the admin account and sits behind the auth gate. Uploads go through **Multer** with a file filter that only accepts `.jpg`/`.png` images and a 2 MB size limit; the saved file is served back as a public URL under `/uploads`, which is then stored on the product. So catalogue images can come either from the seeded URLs or from a real upload, rather than being hard coded into the frontend.

## Tech stack

- **Frontend:** React 19, React Router, Bootstrap / React-Bootstrap, MUI (price slider), Formik + Yup (forms and validation), fastest-levenshtein (search), Google & Facebook sign-in. Hosted on **Netlify**.
- **Backend:** Node.js, Express 5, PostgreSQL (`pg`), JSON Web Tokens, bcrypt, Nodemailer, Multer, google-auth-library. Hosted on **Railway**.
- **Testing:** Jest and Supertest (backend).

## A typical order

1. Register, or sign in with email, Google, or Facebook.
2. Browse the catalogue; search, filter by price, and sort.
3. Add products to your basket.
4. Open the basket, adjust quantities, and watch the subtotal update.
5. Check out to turn the basket into an order.
6. (Admin) Add new products with an uploaded image from `/addProduct`.

## Running locally

### Server

You need a local PostgreSQL instance running, with an empty database whose name matches `PG_DB` below.

```
cd server
npm install
node setupDatabase.js   # creates the tables and a seed admin account
npm start               # starts the API (PORT defaults to 4000)
```

The server reads its config from a `server/.env` file. Two pieces connect to Postgres in different ways, so both sets of vars are needed:

- `setupDatabase.js` (table + seed creation) uses the discrete `PG_USER`, `PG_HOST`, `PG_DB`, `PG_PASS`, `PG_PORT` vars.
- The running API (`db/pool.js`) connects with a single `DATABASE_URL` (SSL enabled), pointing at the same database.

```
# Used by setupDatabase.js
PG_USER=postgres
PG_HOST=localhost
PG_DB=ecommerce_project
PG_PASS=your_local_password
PG_PORT=5432

# Used by the running server (db/pool.js)
DATABASE_URL=postgresql://postgres:your_local_password@localhost:5432/ecommerce_project

JWT_SECRET=any_secret_string
EMAIL_USERNAME=you@gmail.com          # Gmail address for password-reset emails
EMAIL_PASSWORD=your_gmail_app_password
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=...              # Facebook app credentials too, if testing FB login
```

Optionally set `API_BASE_URL` to this server's public URL so uploaded image links resolve correctly.

> Note: `setupDatabase.js` runs `DELETE FROM users` to reset the ID sequence, so it clears existing accounts, run it only when initialising a local database.

### Client

```
cd client
npm install
npm start
```

Set `REACT_APP_API_BASE_URL` to point the client at your local server; otherwise it falls back to the deployed backend.