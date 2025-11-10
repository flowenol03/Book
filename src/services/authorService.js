import { ref, push, set, onValue, off, remove, update } from 'firebase/database';
import { db } from '../firebase';

export const authorService = {
  subscribeToAuthors(callback) {
    const authorsRef = ref(db, 'authors');
    onValue(authorsRef, (snapshot) => {
      const authorsData = snapshot.val();
      const authorsArray = authorsData 
        ? Object.keys(authorsData).map(key => ({
            id: key,
            ...authorsData[key]
          }))
        : [];
      authorsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      callback(authorsArray);
    });
    
    return () => off(authorsRef);
  },

  async addAuthor(authorData) {
    const newAuthor = {
      ...authorData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const authorsRef = ref(db, 'authors');
    const newAuthorRef = push(authorsRef);
    await set(newAuthorRef, newAuthor);
    return newAuthorRef.key;
  },

  async updateAuthor(id, authorData) {
    const authorRef = ref(db, `authors/${id}`);
    const updates = {
      ...authorData,
      updatedAt: new Date().toISOString()
    };
    await update(authorRef, updates);
  },

  async removeAuthor(id) {
    const authorRef = ref(db, `authors/${id}`);
    await remove(authorRef);
  }
};