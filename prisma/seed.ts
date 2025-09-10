import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.borrow.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword123' // In production, this should be properly hashed
    }
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'hashedpassword456'
    }
  });

  // Create sample books
  const book1 = await prisma.book.create({
    data: {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '9780743273565',
      coverImage: '/books/great-gatsby.jpg',
      description: 'A story of decadence and excess.'
    }
  });

  const book2 = await prisma.book.create({
    data: {
      title: '1984',
      author: 'George Orwell',
      isbn: '9780451524935',
      coverImage: '/books/1984.jpg',
      description: 'A dystopian social science fiction novel.'
    }
  });

  const book3 = await prisma.book.create({
    data: {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      isbn: '9780141439518',
      coverImage: '/books/pride-prejudice.jpg',
      description: 'A romantic novel of manners.'
    }
  });

  // Create a sample borrow record
  await prisma.borrow.create({
    data: {
      userId: user1.id,
      bookId: book1.id,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    }
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
