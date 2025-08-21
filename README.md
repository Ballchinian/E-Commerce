E-Commerce APP

This Project was made to simulate a shopping website. The aim was to provide a similar feel to amazon with features such as;
- JWT (Authentication Token)
- bcrypt (Password Storage)
- fastest-levenshtein (Search bar logic)
- Nodemailer (Password Reset using email) 
- Googe/Facebook authentication
- And many more smaller modules!


When building this I wanted to bring everything I know about website design into one place
- SQL database manipulation and access
- REACT
- Bootstrap
- Netlify (Frontend host)
- Railway (Backend host)

Ive tried my best to secure all the ends of the database with user input sanitation, url protection, Hashing and JWT usage and so on. If a vulnerability is detected I would appreciate a comment so I can fix it.

Some extra notes,
in server/public/images, these are local uploads for products, public/uploads are ones uploaded from 
/addProduct. This can only be accessed with the admin account admin@test.com (change to your email, then request a password reset)

All the Routes are as such;
- /Login
- /resetPassword
- /register
- /shopping
- /basket
- /addProduct [seperated from main website]

