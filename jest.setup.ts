import { PrismaClient } from '@prisma/client';
import { afterAll, beforeAll } from '@jest/globals';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Connect to the test database
  await prisma.$connect();
});

afterAll(async () => {
  // Clean up and disconnect from the test database
  await prisma.$disconnect();
});
