E-Commerce APP

This Project was made to simulate a shopping website. The aim was to provide a similar feel to amazon with features such as;
- JWT (Authentication Token)
- bcrypt (Password Storage)
- fastest-levenshtein (Search bar logic)
- Nodemailer (Password Reset using email) 
- And many more smaller modules!

When building this I wanted to bring everything I know about website design into one place
- SQL database manipulation and access
- REACT
- Bootstrap
- Netlify (not on local download)

Ive tried my best to secure all the ends of the database with user input sanitation, url protection, Hashing and JWT usage and so on. If a vulnerability is detected I would appreciate a comment so I can fix it.

In order to replicate the database among other features here is a guide listed below (for localhost):
- A new .env file has to have all of its values filled. The EMAIL_PASSWORD has to be an App Password for gmail
for it to work.
- To download all the dependencies, npm install will need to be done in both client and server folders
- Now npm start will need to be done on both client and server folders
- To initialise the database, the file 'setupDatabase.js' will need to be run
- databaseDiagram, and graphics show some of the planning process
- http://localhost:3000/login as the url and it should work!

Some extra notes,
in server/public/images, these are local uploads for products, public/uploads are ones uploaded from 
/addProduct. This can only be accessed with the admin account admin@test.com (change to your email, then request a password reset)

Authentication with google and facebook doesnt work when in the local client and needs a public domain so Ive not made it working in this version


//Changed the database connection to use railway

old version:

const pool = new Pool({
  user: process.env.,
  host: process.env.,
  database: process.env.,
  password: process.env.,
  port: process.env.,
});

const resetUrl = `https://e-commercelive.netlify.app/resetPassword/${token}`;  in authRoutes (changed from localhost:3000)