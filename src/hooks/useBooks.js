import { useState, useEffect } from 'react';
import { bookService } from '../services/bookService';

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = bookService.subscribeToBooks((booksData) => {
      setBooks(booksData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    books,
    loading,
    addBook: bookService.addBook,
    removeBook: bookService.removeBook
  };
};