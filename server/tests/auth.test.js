const request = require('supertest');
const app = require('../server'); 
const pool = require('../db/pool'); 

describe('POST /login', () => {
  
  it('should login successfully with valid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.co.uk',
        password: 'password123456'
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('user'); 
  });

  it('should fail with invalid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'wrong@example.com',
        password: 'wrongpassword'
      });
    expect(response.statusCode).toBe(404); 
    expect(response.body).toHaveProperty('message');
  });

  it('should fail with a invalid password', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.co.uk',
        password: 'wrongpassword'
      });
    expect(response.statusCode).toBe(401); 
    expect(response.body).toHaveProperty('message');
  });
});


const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: '123456'
};

describe('POST /register', () => {

  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE email = $1', [testUser.email]);
    await pool.end();
  });

  it('should register a user successfully', async () => {
    const response = await request(app)
      .post('/register')
      .send(testUser);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
  });

  it('should fail to register duplicate user', async () => {
    // Register first time
    await request(app)
      .post('/register')
      .send(testUser);

    // Register again
    const response = await request(app).post('/register')
      .send(testUser);
    expect(response.statusCode).toBe(400); // or whatever your logic uses
    expect(response.body).toHaveProperty('message');
  });
});



