import { render, screen, fireEvent } from '@testing-library/react';
import { BookCard } from '../components/BookCard';
import { Book } from '../types/book';

const mockBook: Book = {
  id: '1',
  title: 'Test Book',
  author: 'Test Author',
  description: 'Test Description',
  coverImage: 'test.jpg',
  status: 'available',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

describe('BookCard', () => {
  const mockOnView = jest.fn();
  const mockOnBorrow = jest.fn();
  const mockOnReturn = jest.fn();

  it('renders book information correctly', () => {
    render(
      <BookCard
        book={mockBook}
        onView={mockOnView}
        onBorrow={mockOnBorrow}
        onReturn={mockOnReturn}
      />
    );

    expect(screen.getByText(mockBook.title)).toBeInTheDocument();
    expect(screen.getByText(mockBook.author)).toBeInTheDocument();
    expect(screen.getByText(mockBook.description)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockBook.coverImage);
  });

  it('calls onView when View Details is clicked', () => {
    render(
      <BookCard
        book={mockBook}
        onView={mockOnView}
        onBorrow={mockOnBorrow}
        onReturn={mockOnReturn}
      />
    );

    fireEvent.click(screen.getByText('View Details'));
    expect(mockOnView).toHaveBeenCalledWith(mockBook);
  });

  it('shows Borrow button for available books', () => {
    render(
      <BookCard
        book={mockBook}
        onView={mockOnView}
        onBorrow={mockOnBorrow}
        onReturn={mockOnReturn}
      />
    );

    const borrowButton = screen.getByText('Borrow');
    expect(borrowButton).toBeInTheDocument();
    
    fireEvent.click(borrowButton);
    expect(mockOnBorrow).toHaveBeenCalledWith(mockBook);
  });

  it('shows Return button for borrowed books', () => {
    const borrowedBook = { ...mockBook, status: 'borrowed' as const };
    
    render(
      <BookCard
        book={borrowedBook}
        onView={mockOnView}
        onBorrow={mockOnBorrow}
        onReturn={mockOnReturn}
      />
    );

    const returnButton = screen.getByText('Return');
    expect(returnButton).toBeInTheDocument();
    
    fireEvent.click(returnButton);
    expect(mockOnReturn).toHaveBeenCalledWith(borrowedBook);
  });
});
