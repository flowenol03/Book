import { useState, useEffect } from 'react';
import { authorService } from '../services/authorService';

export const useAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = authorService.subscribeToAuthors((authorsData) => {
      setAuthors(authorsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    authors,
    loading,
    addAuthor: authorService.addAuthor,
    removeAuthor: authorService.removeAuthor
  };
};