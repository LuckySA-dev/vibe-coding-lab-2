import { PrismaClient } from '@prisma/client';
import { beforeEach, afterEach, describe, it, expect } from '@jest/globals';

const prisma = new PrismaClient();

describe('Database Schema Tests', () => {
  beforeEach(async () => {
    await prisma.$connect();
    // Clean the database before each test
    await prisma.borrow.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('should create a user', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword123'
      }
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Test User');
    expect(user.email).toBe('test@example.com');
  });

  it('should create a book', async () => {
    const book = await prisma.book.create({
      data: {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '1234567890',
        coverImage: 'test-cover.jpg',
        description: 'Test description'
      }
    });

    expect(book).toHaveProperty('id');
    expect(book.title).toBe('Test Book');
    expect(book.status).toBe('available');
  });

  it('should create a borrow record', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword123'
      }
    });

    const book = await prisma.book.create({
      data: {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '1234567890',
        coverImage: 'test-cover.jpg',
        description: 'Test description'
      }
    });

    const borrow = await prisma.borrow.create({
      data: {
        userId: user.id,
        bookId: book.id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
      }
    });

    expect(borrow).toHaveProperty('id');
    expect(borrow.status).toBe('active');
    expect(borrow.userId).toBe(user.id);
    expect(borrow.bookId).toBe(book.id);
  });
});
