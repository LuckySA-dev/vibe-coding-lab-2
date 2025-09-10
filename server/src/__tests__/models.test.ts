import { PrismaClient } from '@prisma/client';
import { beforeEach, afterEach, describe, it, expect } from '@jest/globals';

const prisma = new PrismaClient();

describe('User Model', () => {
  beforeEach(async () => {
    await prisma.borrow.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should create a user', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword'
      }
    });

    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
    expect(user.name).toBe('Test User');
  });

  it('should enforce unique email constraint', async () => {
    await prisma.user.create({
      data: {
        name: 'Test User 1',
        email: 'test@example.com',
        password: 'hashedpassword'
      }
    });

    await expect(
      prisma.user.create({
        data: {
          name: 'Test User 2',
          email: 'test@example.com',
          password: 'hashedpassword'
        }
      })
    ).rejects.toThrow();
  });
});

describe('Book Model', () => {
  beforeEach(async () => {
    await prisma.borrow.deleteMany();
    await prisma.book.deleteMany();
  });

  it('should create a book', async () => {
    const book = await prisma.book.create({
      data: {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '1234567890',
        coverImage: 'test.jpg',
        description: 'Test description'
      }
    });

    expect(book).toBeDefined();
    expect(book.title).toBe('Test Book');
    expect(book.status).toBe('available');
  });

  it('should enforce unique ISBN constraint', async () => {
    await prisma.book.create({
      data: {
        title: 'Test Book 1',
        author: 'Test Author 1',
        isbn: '1234567890',
        coverImage: 'test1.jpg',
        description: 'Test description 1'
      }
    });

    await expect(
      prisma.book.create({
        data: {
          title: 'Test Book 2',
          author: 'Test Author 2',
          isbn: '1234567890',
          coverImage: 'test2.jpg',
          description: 'Test description 2'
        }
      })
    ).rejects.toThrow();
  });
});

describe('Borrow Model', () => {
  let user: any;
  let book: any;

  beforeEach(async () => {
    await prisma.borrow.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();

    user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword'
      }
    });

    book = await prisma.book.create({
      data: {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '1234567890',
        coverImage: 'test.jpg',
        description: 'Test description'
      }
    });
  });

  it('should create a borrow record', async () => {
    const borrow = await prisma.borrow.create({
      data: {
        userId: user.id,
        bookId: book.id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    });

    expect(borrow).toBeDefined();
    expect(borrow.userId).toBe(user.id);
    expect(borrow.bookId).toBe(book.id);
    expect(borrow.status).toBe('active');
  });

  it('should update borrow status on return', async () => {
    const borrow = await prisma.borrow.create({
      data: {
        userId: user.id,
        bookId: book.id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    });

    const updatedBorrow = await prisma.borrow.update({
      where: { id: borrow.id },
      data: {
        returnDate: new Date(),
        status: 'returned'
      }
    });

    expect(updatedBorrow.status).toBe('returned');
    expect(updatedBorrow.returnDate).toBeDefined();
  });
});
