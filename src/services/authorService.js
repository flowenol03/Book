import { ref, push, set, onValue, off, remove } from 'firebase/database';
import { db } from '../firebase';

export const authorService = {
  // Read
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

  // Create
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

  // Delete
  async removeAuthor(id) {
    const authorRef = ref(db, `authors/${id}`);
    await remove(authorRef);
  }
};