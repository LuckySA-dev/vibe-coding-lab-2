import request from 'supertest';
import app from '../server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('API Tests', () => {
  let authToken: string;
  let testUserId: string;
  let testBookId: string;

  beforeAll(async () => {
    // Clean up database
    await prisma.borrow.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
      }
    });
    testUserId = user.id;
  });

  describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'new@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
    });

    it('should login user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      authToken = res.body.token;
    });
  });

  describe('Book Endpoints', () => {
    it('should create a new book', async () => {
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Book',
          author: 'Test Author',
          isbn: '1234567890',
          coverImage: 'test.jpg',
          description: 'Test description'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      testBookId = res.body.id;
    });

    it('should get all books', async () => {
      const res = await request(app)
        .get('/api/books');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should get a single book', async () => {
      const res = await request(app)
        .get(`/api/books/${testBookId}`);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Test Book');
    });

    it('should borrow a book', async () => {
      const res = await request(app)
        .post(`/api/books/${testBookId}/borrow`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
    });

    it('should return a book', async () => {
      const res = await request(app)
        .post(`/api/books/${testBookId}/return`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Book returned successfully');
    });
  });

  afterAll(async () => {
    await prisma.borrow.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });
});
