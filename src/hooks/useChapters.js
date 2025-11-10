import { useState, useEffect } from 'react';
import { chapterService } from '../services/chapterService';

export const useChapters = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = chapterService.subscribeToChapters((chaptersData) => {
      setChapters(chaptersData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    chapters,
    loading,
    addChapter: chapterService.addChapter,
    updateChapter: chapterService.updateChapter,
    removeChapter: chapterService.removeChapter
  };
};