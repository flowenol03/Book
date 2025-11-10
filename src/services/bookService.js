import { ref, push, set, onValue, off, remove } from 'firebase/database';
import { db } from '../firebase';

export const bookService = {
  // Read
  subscribeToBooks(callback) {
    const booksRef = ref(db, 'books');
    onValue(booksRef, (snapshot) => {
      const booksData = snapshot.val();
      const booksArray = booksData 
        ? Object.keys(booksData).map(key => ({
            id: key,
            ...booksData[key]
          }))
        : [];
      booksArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      callback(booksArray);
    });
    
    return () => off(booksRef);
  },

  // Create
  async addBook(bookData) {
    const newBook = {
      ...bookData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const booksRef = ref(db, 'books');
    const newBookRef = push(booksRef);
    await set(newBookRef, newBook);
    return newBookRef.key;
  },

  // Delete
  async removeBook(id) {
    const bookRef = ref(db, `books/${id}`);
    await remove(bookRef);
  }
};