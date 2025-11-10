import React from 'react';
import BookCard from './BookCard';

const BookList = ({ books, onBookSelect, onRemoveBook, isAdmin = false }) => {
  return (
    <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onSelect={onBookSelect}
          onRemove={isAdmin ? onRemoveBook : null}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
};

export default BookList;