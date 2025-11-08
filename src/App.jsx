import React, { useEffect, useState } from "react";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';

// Helpers
const isNonEmpty = (s) => typeof s === "string" && s.trim().length > 0;
const isFourDigitYear = (y) => /^\d{4}$/.test(String(y));

export default function App() {
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Add Author form state
  const [authorName, setAuthorName] = useState("");
  const [authorBio, setAuthorBio] = useState("");
  const [authorGenres, setAuthorGenres] = useState("");
  const [authorErrors, setAuthorErrors] = useState({});

  // Add Book form state
  const [bookAuthorId, setBookAuthorId] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [bookYear, setBookYear] = useState("");
  const [bookCategory, setBookCategory] = useState("");
  const [bookErrors, setBookErrors] = useState({});

  const [viewAuthorId, setViewAuthorId] = useState("");
  const [showAddAuthorModal, setShowAddAuthorModal] = useState(false);
  const [showAddBookModal, setShowAddBookModal] = useState(false);

  // Load data from Firebase
  useEffect(() => {
    setLoading(true);
    
    // Real-time listener for authors
    const authorsQuery = query(collection(db, 'authors'), orderBy('createdAt', 'desc'));
    const unsubscribeAuthors = onSnapshot(authorsQuery, (snapshot) => {
      const authorsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAuthors(authorsData);
    });

    // Real-time listener for books
    const booksQuery = query(collection(db, 'books'), orderBy('createdAt', 'desc'));
    const unsubscribeBooks = onSnapshot(booksQuery, (snapshot) => {
      const booksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBooks(booksData);
      setLoading(false);
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeAuthors();
      unsubscribeBooks();
    };
  }, []);

  // Add Author to Firebase
  const handleAddAuthor = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!isNonEmpty(authorName)) errors.name = "Author name is required.";
    setAuthorErrors(errors);
    if (Object.keys(errors).length) return;

    try {
      const newAuthor = {
        name: authorName.trim(),
        bio: authorBio.trim(),
        genres: authorGenres
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'authors'), newAuthor);
      
      setAuthorName("");
      setAuthorBio("");
      setAuthorGenres("");
      setBookAuthorId(docRef.id);
      setViewAuthorId(docRef.id);
      setShowAddAuthorModal(false);
    } catch (error) {
      console.error("Error adding author: ", error);
      alert("Error adding author. Please try again.");
    }
  };

  // Add Book to Firebase
  const handleAddBook = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!isNonEmpty(bookAuthorId)) errors.author = "Select an author.";
    if (!isNonEmpty(bookTitle)) errors.title = "Book title is required.";
    if (!isFourDigitYear(bookYear)) errors.year = "Year must be 4 digits (e.g. 1951).";
    setBookErrors(errors);
    if (Object.keys(errors).length) return;

    try {
      const newBook = {
        authorId: bookAuthorId,
        title: bookTitle.trim(),
        description: bookDescription.trim(),
        year: bookYear.trim(),
        category: bookCategory.trim() || "Uncategorized",
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(collection(db, 'books'), newBook);
      
      setBookTitle("");
      setBookDescription("");
      setBookYear("");
      setBookCategory("");
      setShowAddBookModal(false);
    } catch (error) {
      console.error("Error adding book: ", error);
      alert("Error adding book. Please try again.");
    }
  };

  // Remove Author from Firebase
  const removeAuthor = async (id) => {
    if (!confirm("Remove author and all their books?")) return;
    
    try {
      // Delete author
      await deleteDoc(doc(db, 'authors', id));
      
      // Delete all books by this author
      const authorBooks = books.filter(book => book.authorId === id);
      const deleteBookPromises = authorBooks.map(book => 
        deleteDoc(doc(db, 'books', book.id))
      );
      
      await Promise.all(deleteBookPromises);
      
      if (viewAuthorId === id) setViewAuthorId("");
    } catch (error) {
      console.error("Error removing author: ", error);
      alert("Error removing author. Please try again.");
    }
  };

  // Remove Book from Firebase
  const removeBook = async (id) => {
    if (!confirm("Remove this book?")) return;
    
    try {
      await deleteDoc(doc(db, 'books', id));
    } catch (error) {
      console.error("Error removing book: ", error);
      alert("Error removing book. Please try again.");
    }
  };

  // Handle author selection
  const handleAuthorSelect = (authorId) => {
    setViewAuthorId(authorId);
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  const booksForAuthor = (id) => books.filter((b) => b.authorId === id);
  const selectedAuthor = authors.find((a) => a.id === viewAuthorId);
  const authorBooks = booksForAuthor(viewAuthorId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">BookLibrary</h1>
            </div>
            <div className="flex gap-2 md:gap-3">
              <button
                onClick={() => setShowAddAuthorModal(true)}
                className="flex items-center gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-2 bg-indigo-600 text-white rounded-lg md:rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-sm md:text-base"
              >
                <span>+</span>
                <span className="hidden sm:inline">Add Author</span>
                <span className="sm:hidden">Author</span>
              </button>
              <button
                onClick={() => setShowAddBookModal(true)}
                className="flex items-center gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-2 bg-emerald-600 text-white rounded-lg md:rounded-xl hover:bg-emerald-700 transition-colors shadow-sm text-sm md:text-base"
              >
                <span>+</span>
                <span className="hidden sm:inline">Add Book</span>
                <span className="sm:hidden">Book</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 md:py-6">
        <div className="flex gap-4 md:gap-6">
          {/* Sidebar - Authors List */}
          <div className={`
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40
            w-80 lg:w-80 xl:w-96 flex-shrink-0 bg-white lg:bg-transparent
            transition-transform duration-300 ease-in-out lg:transition-none
            lg:block
          `}>
            {/* Mobile overlay */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 h-full lg:h-auto lg:max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Authors</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-2">
                {authors.length === 0 ? (
                  <div className="text-slate-500 text-center py-8">
                    <div className="text-4xl mb-2">📚</div>
                    <p>No authors yet</p>
                    <button
                      onClick={() => setShowAddAuthorModal(true)}
                      className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      Add your first author
                    </button>
                  </div>
                ) : (
                  authors.map((author) => {
                    const authorBookCount = booksForAuthor(author.id).length;
                    return (
                      <div
                        key={author.id}
                        className={`p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                          viewAuthorId === author.id
                            ? "bg-indigo-50 border border-indigo-200 shadow-sm"
                            : "bg-slate-50 hover:bg-slate-100 border border-transparent"
                        }`}
                        onClick={() => handleAuthorSelect(author.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-800 text-sm md:text-base">{author.name}</h3>
                            {author.genres && author.genres.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {author.genres.slice(0, 2).map((genre, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded-full"
                                  >
                                    {genre}
                                  </span>
                                ))}
                                {author.genres.length > 2 && (
                                  <span className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded-full">
                                    +{author.genres.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-2 text-xs md:text-sm text-slate-600">
                              <span>📖</span>
                              <span>{authorBookCount} book{authorBookCount !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeAuthor(author.id);
                            }}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded text-lg"
                            title="Remove author"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Books */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6">
              {!viewAuthorId ? (
                <div className="text-center py-8 md:py-12">
                  <div className="text-4xl md:text-6xl mb-3 md:mb-4">📖</div>
                  <h3 className="text-lg md:text-xl font-semibold text-slate-700 mb-2">
                    Welcome to BookLibrary
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto text-sm md:text-base">
                    {isSidebarOpen ? "Select an author to view their books" : "Select an author from the sidebar to view their books, or add a new author to get started."}
                  </p>
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    View Authors
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-bold text-slate-800">{selectedAuthor?.name}</h2>
                      {selectedAuthor?.bio && (
                        <p className="text-slate-600 mt-2 text-sm md:text-base">{selectedAuthor.bio}</p>
                      )}
                      {selectedAuthor?.genres && selectedAuthor.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {selectedAuthor.genres.map((genre, index) => (
                            <span
                              key={index}
                              className="px-2 md:px-3 py-1 bg-indigo-100 text-indigo-700 text-xs md:text-sm rounded-full font-medium"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setShowAddBookModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm w-full sm:w-auto justify-center"
                    >
                      <span>+</span>
                      <span>Add Book</span>
                    </button>
                  </div>

                  {authorBooks.length === 0 ? (
                    <div className="text-center py-8 md:py-12 border-2 border-dashed border-slate-200 rounded-xl">
                      <div className="text-4xl mb-3">📚</div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">No books yet</h3>
                      <p className="text-slate-500 mb-4 text-sm md:text-base">Add the first book for {selectedAuthor?.name}</p>
                      <button
                        onClick={() => setShowAddBookModal(true)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Add Book
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {authorBooks.map((book) => (
                        <div
                          key={book.id}
                          className="border border-slate-200 rounded-xl p-3 md:p-4 hover:shadow-md transition-shadow bg-white group"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-800 text-base md:text-lg">{book.title}</h3>
                              <div className="flex items-center gap-2 md:gap-3 mt-1 flex-wrap">
                                <span className="text-slate-500 text-xs md:text-sm">{book.year}</span>
                                <span className="text-slate-400 hidden md:inline">•</span>
                                <span className="text-slate-600 text-xs md:text-sm font-medium">{book.category}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeBook(book.id)}
                              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-1 rounded text-lg"
                              title="Remove book"
                            >
                              ×
                            </button>
                          </div>
                          {book.description && (
                            <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{book.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Author Modal */}
      {showAddAuthorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto mx-2">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Add New Author</h2>
                <button
                  onClick={() => setShowAddAuthorModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl p-1"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleAddAuthor} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Author Name *
                  </label>
                  <input
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Enter author name"
                  />
                  {authorErrors.name && (
                    <div className="text-red-500 text-sm mt-1">{authorErrors.name}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Short Bio (2–3 lines)
                  </label>
                  <textarea
                    value={authorBio}
                    onChange={(e) => setAuthorBio(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                    rows={3}
                    placeholder="Enter a short bio..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Genres (comma-separated)
                  </label>
                  <input
                    value={authorGenres}
                    onChange={(e) => setAuthorGenres(e.target.value)}
                    placeholder="Fiction, Sci-Fi, Mystery"
                    className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                <div className="flex gap-3 pt-2 flex-col sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setShowAddAuthorModal(false)}
                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm sm:text-base"
                  >
                    Add Author
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto mx-2">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Add New Book</h2>
                <button
                  onClick={() => setShowAddBookModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl p-1"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleAddBook} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Select Author *
                  </label>
                  <select
                    value={bookAuthorId}
                    onChange={(e) => setBookAuthorId(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">-- choose author --</option>
                    {authors.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                  {bookErrors.author && (
                    <div className="text-red-500 text-sm mt-1">{bookErrors.author}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Book Title *
                  </label>
                  <input
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Enter book title"
                  />
                  {bookErrors.title && (
                    <div className="text-red-500 text-sm mt-1">{bookErrors.title}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Short Description (2–3 lines)
                  </label>
                  <textarea
                    value={bookDescription}
                    onChange={(e) => setBookDescription(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                    rows={3}
                    placeholder="Enter a short description..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Year (4 digits) *
                    </label>
                    <input
                      value={bookYear}
                      onChange={(e) => setBookYear(e.target.value)}
                      placeholder="1951"
                      className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                    />
                    {bookErrors.year && (
                      <div className="text-red-500 text-sm mt-1">{bookErrors.year}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Category/Type
                    </label>
                    <input
                      value={bookCategory}
                      onChange={(e) => setBookCategory(e.target.value)}
                      placeholder="Novel, Short Stories"
                      className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2 flex-col sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setShowAddBookModal(false)}
                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm sm:text-base"
                  >
                    Add Book
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}