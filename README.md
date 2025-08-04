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
- The .env file has to have all of its values redone. The EMAIL_PASSWORD has to be an App Password for gmail
for it to work.
- To initialise the database, the file '' will need to be run
- databaseDiagram, and graphics show some of the planning process
- Lots of modules will need to be installed, such as

"cors": "^2.8.5",
"crypto": "^1.0.1",
"dotenv": "^17.2.0",
"express": "^5.1.0",
"jsonwebtoken": "^9.0.2",
"multer": "^2.0.2",
"nodemailer": "^7.0.5",
"pg": "^8.16.3"
"bootstrap": "^5.3.7",
"fastest-levenshtein": "^1.0.16",
"formik": "^2.4.6",
"react": "^19.1.0",
"react-bootstrap": "^2.10.10",
"react-dom": "^19.1.0",
"react-router-dom": "^7.6.3",
"yup": "^1.6.1",
"bcrypt": "^6.0.0"

But there may be some ive missed.

Some extra notes,
in server/public/images, these are local uploads for products, public/uploads are ones uploaded from 
/addProduct. This can only be accessed with the admin account admin@test.com (change password with email on downloading for security) this is due to its id being 1 which gives its authority. 
