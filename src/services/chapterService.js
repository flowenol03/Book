import { ref, push, set, onValue, off, remove } from 'firebase/database';
import { db } from '../firebase';

export const chapterService = {
  // Read
  subscribeToChapters(callback) {
    const chaptersRef = ref(db, 'chapters');
    onValue(chaptersRef, (snapshot) => {
      const chaptersData = snapshot.val();
      const chaptersArray = chaptersData 
        ? Object.keys(chaptersData).map(key => ({
            id: key,
            ...chaptersData[key]
          }))
        : [];
      chaptersArray.sort((a, b) => a.chapterNumber - b.chapterNumber);
      callback(chaptersArray);
    });
    
    return () => off(chaptersRef);
  },

  // Create
  async addChapter(chapterData) {
    const newChapter = {
      ...chapterData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const chaptersRef = ref(db, 'chapters');
    const newChapterRef = push(chaptersRef);
    await set(newChapterRef, newChapter);
    return newChapterRef.key;
  },

  // Delete
  async removeChapter(id) {
    const chapterRef = ref(db, `chapters/${id}`);
    await remove(chapterRef);
  }
};