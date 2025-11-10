import { useState, useEffect } from 'react';
import { useAuthors } from './useAuthors';
import { useBooks } from './useBooks';
import { useChapters } from './useChapters';

export const useLibrary = () => {
  const {
    authors,
    loading: authorsLoading,
    addAuthor,
    removeAuthor
  } = useAuthors();

  const {
    books,
    loading: booksLoading,
    addBook,
    removeBook
  } = useBooks();

  const {
    chapters,
    loading: chaptersLoading,
    addChapter,
    removeChapter
  } = useChapters();

  const [viewAuthorId, setViewAuthorId] = useState("");
  const [viewBookId, setViewBookId] = useState("");
  const [activeTab, setActiveTab] = useState("books");

  const loading = authorsLoading || booksLoading || chaptersLoading;

  // Auto-select random author when authors load
  useEffect(() => {
    if (authors.length > 0 && !viewAuthorId && !loading) {
      // Select a random author
      const randomIndex = Math.floor(Math.random() * authors.length);
      setViewAuthorId(authors[randomIndex].id);
      setViewBookId("");
      setActiveTab("books");
    }
  }, [authors, loading, viewAuthorId]);

  const booksForAuthor = (authorId) => 
    books.filter((book) => book.authorId === authorId);

  const chaptersForBook = (bookId) => 
    chapters.filter((chapter) => chapter.bookId === bookId);

  const selectedAuthor = authors.find((a) => a.id === viewAuthorId);
  const selectedBook = books.find((b) => b.id === viewBookId);
  const authorBooks = booksForAuthor(viewAuthorId);
  const bookChapters = chaptersForBook(viewBookId);

  const handleAuthorSelect = (authorId, onCloseSidebar = null) => {
    setViewAuthorId(authorId);
    setViewBookId("");
    setActiveTab("books");
    
    // Close sidebar if callback provided (for mobile)
    if (onCloseSidebar && typeof onCloseSidebar === 'function') {
      onCloseSidebar();
    }
  };

  const handleBookSelect = (bookId) => {
    setViewBookId(bookId);
    setActiveTab("chapters");
  };

  const handleBackToBooks = () => {
    setViewBookId("");
    setActiveTab("books");
  };

  return {
    // Data
    authors,
    books,
    chapters,
    loading,
    
    // View state
    viewAuthorId,
    viewBookId,
    activeTab,
    selectedAuthor,
    selectedBook,
    authorBooks,
    bookChapters,
    
    // Filter functions
    booksForAuthor,
    chaptersForBook,
    
    // Actions
    addAuthor,
    removeAuthor,
    addBook,
    removeBook,
    addChapter,
    removeChapter,
    handleAuthorSelect,
    handleBookSelect,
    handleBackToBooks,
    setViewAuthorId,
    setViewBookId,
    setActiveTab
  };
};