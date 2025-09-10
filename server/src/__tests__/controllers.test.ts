import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { beforeEach, describe, it, expect, jest } from '@jest/globals';
import { protect } from '../middleware/auth';

const prisma = new PrismaClient();

describe('Auth Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockReq = {
      headers: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('should authenticate valid JWT token', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10)
      }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key'
    );

    mockReq.headers = {
      authorization: `Bearer ${token}`
    };

    await protect(mockReq as any, mockRes as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockReq).toHaveProperty('user');
    expect((mockReq as any).user.id).toBe(user.id);
  });

  it('should reject request without token', async () => {
    await protect(mockReq as any, mockRes as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should reject invalid token', async () => {
    mockReq.headers = {
      authorization: 'Bearer invalid.token.here'
    };

    await protect(mockReq as any, mockRes as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });
});

describe('Error Handler', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('should handle errors in development mode', () => {
    const error = new Error('Test error');
    process.env.NODE_ENV = 'development';

    const { errorHandler } = require('../middleware/errorHandler');
    errorHandler(error, mockReq as Request, mockRes as Response, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'Test error',
        stack: expect.any(String)
      })
    );
  });

  it('should handle errors in production mode', () => {
    const error = new Error('Test error');
    process.env.NODE_ENV = 'production';

    const { errorHandler } = require('../middleware/errorHandler');
    errorHandler(error, mockReq as Request, mockRes as Response, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Test error'
    });
  });
});
