import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../middleware/auth';
import { Request, Response, NextFunction } from 'express';

const router = Router();
const prisma = new PrismaClient();

// Get all books
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await prisma.book.findMany();
    res.json(books);
  } catch (error) {
    next(error);
  }
});

// Get single book
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await prisma.book.findUnique({
      where: { id: req.params.id },
      include: { borrows: true }
    });
    
    if (!book) {
      throw new AppError('Book not found', 404);
    }
    
    res.json(book);
  } catch (error) {
    next(error);
  }
});

// Create book (protected route)
router.post('/', protect, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const book = await prisma.book.create({
      data: req.body
    });
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
});

// Update book (protected route)
router.put('/:id', protect, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const book = await prisma.book.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(book);
  } catch (error) {
    next(error);
  }
});

// Delete book (protected route)
router.delete('/:id', protect, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.book.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Borrow book
router.post('/:id/borrow', protect, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const book = await prisma.book.findUnique({
      where: { id: req.params.id }
    });

    if (!book) {
      throw new AppError('Book not found', 404);
    }

    if (book.status !== 'available') {
      throw new AppError('Book is not available', 400);
    }

    const borrow = await prisma.borrow.create({
      data: {
        userId: req.user!.id,
        bookId: req.params.id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
      }
    });

    await prisma.book.update({
      where: { id: req.params.id },
      data: { status: 'borrowed' }
    });

    res.status(201).json(borrow);
  } catch (error) {
    next(error);
  }
});

// Return book
router.post('/:id/return', protect, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const borrow = await prisma.borrow.findFirst({
      where: {
        bookId: req.params.id,
        userId: req.user!.id,
        status: 'active'
      }
    });

    if (!borrow) {
      throw new AppError('No active borrow found for this book', 404);
    }

    await prisma.borrow.update({
      where: { id: borrow.id },
      data: {
        returnDate: new Date(),
        status: 'returned'
      }
    });

    await prisma.book.update({
      where: { id: req.params.id },
      data: { status: 'available' }
    });

    res.status(200).json({ message: 'Book returned successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
