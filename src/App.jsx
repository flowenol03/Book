import React, { useEffect, useState } from "react";
import {
  ref,
  push,
  set,
  onValue,
  off,
  remove
} from 'firebase/database';
import { db } from './firebase';

const isNonEmpty = (s) => typeof s === "string" && s.trim().length > 0;
const isFourDigitYear = (y) => /^\d{4}$/.test(String(y));

export default function App() {
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [authorName, setAuthorName] = useState("");
  const [authorBio, setAuthorBio] = useState("");
  const [authorGenres, setAuthorGenres] = useState("");
  const [authorErrors, setAuthorErrors] = useState({});

  const [bookAuthorId, setBookAuthorId] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [bookYear, setBookYear] = useState("");
  const [bookCategory, setBookCategory] = useState("");
  const [bookErrors, setBookErrors] = useState({});

  const [chapterBookId, setChapterBookId] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");
  const [chapterErrors, setChapterErrors] = useState({});

  const [viewAuthorId, setViewAuthorId] = useState("");
  const [viewBookId, setViewBookId] = useState("");
  const [showAddAuthorModal, setShowAddAuthorModal] = useState(false);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [activeTab, setActiveTab] = useState("books");

  useEffect(() => {
    setLoading(true);

    const authorsRef = ref(db, 'authors');
    const unsubscribeAuthors = onValue(authorsRef, (snapshot) => {
      const authorsData = snapshot.val();
      const authorsArray = authorsData ? Object.keys(authorsData).map(key => ({
        id: key,
        ...authorsData[key]
      })) : [];
      authorsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAuthors(authorsArray);
    });

    const booksRef = ref(db, 'books');
    const unsubscribeBooks = onValue(booksRef, (snapshot) => {
      const booksData = snapshot.val();
      const booksArray = booksData ? Object.keys(booksData).map(key => ({
        id: key,
        ...booksData[key]
      })) : [];
      booksArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBooks(booksArray);
    });

    const chaptersRef = ref(db, 'chapters');
    const unsubscribeChapters = onValue(chaptersRef, (snapshot) => {
      const chaptersData = snapshot.val();
      const chaptersArray = chaptersData ? Object.keys(chaptersData).map(key => ({
        id: key,
        ...chaptersData[key]
      })) : [];
      chaptersArray.sort((a, b) => a.chapterNumber - b.chapterNumber);
      setChapters(chaptersArray);
      setLoading(false);
    });

    return () => {
      off(authorsRef);
      off(booksRef);
      off(chaptersRef);
    };
  }, []);

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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const authorsRef = ref(db, 'authors');
      const newAuthorRef = push(authorsRef);
      await set(newAuthorRef, newAuthor);

      setAuthorName("");
      setAuthorBio("");
      setAuthorGenres("");
      setBookAuthorId(newAuthorRef.key);
      setViewAuthorId(newAuthorRef.key);
      setShowAddAuthorModal(false);
    } catch (error) {
      console.error("Error adding author: ", error);
      alert("Error adding author. Please try again.");
    }
  };

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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const booksRef = ref(db, 'books');
      const newBookRef = push(booksRef);
      await set(newBookRef, newBook);

      setBookTitle("");
      setBookDescription("");
      setBookYear("");
      setBookCategory("");
      setShowAddBookModal(false);

      setChapterBookId(newBookRef.key);
      setShowAddChapterModal(true);
    } catch (error) {
      console.error("Error adding book: ", error);
      alert("Error adding book. Please try again.");
    }
  };

  const handleAddChapter = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!isNonEmpty(chapterBookId)) errors.book = "Select a book.";
    if (!isNonEmpty(chapterTitle)) errors.title = "Chapter title is required.";
    if (!chapterNumber || chapterNumber < 1) errors.number = "Chapter number must be at least 1.";
    setChapterErrors(errors);
    if (Object.keys(errors).length) return;

    try {
      const newChapter = {
        bookId: chapterBookId,
        title: chapterTitle.trim(),
        content: chapterContent.trim(),
        chapterNumber: parseInt(chapterNumber),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const chaptersRef = ref(db, 'chapters');
      const newChapterRef = push(chaptersRef);
      await set(newChapterRef, newChapter);

      setChapterTitle("");
      setChapterContent("");
      setChapterNumber("");
      setShowAddChapterModal(false);
    } catch (error) {
      console.error("Error adding chapter: ", error);
      alert("Error adding chapter. Please try again.");
    }
  };

  const removeAuthor = async (id) => {
    if (!confirm("Remove author and all their books?")) return;

    try {
      const authorRef = ref(db, `authors/${id}`);
      await remove(authorRef);

      const authorBooks = books.filter(book => book.authorId === id);
      const deleteBookPromises = authorBooks.map(book => {
        const bookRef = ref(db, `books/${book.id}`);
        return remove(bookRef);
      });

      await Promise.all(deleteBookPromises);

      if (viewAuthorId === id) setViewAuthorId("");
    } catch (error) {
      console.error("Error removing author: ", error);
      alert("Error removing author. Please try again.");
    }
  };

  const removeBook = async (id) => {
    if (!confirm("Remove this book and all its chapters?")) return;

    try {
      const bookRef = ref(db, `books/${id}`);
      await remove(bookRef);

      const bookChapters = chapters.filter(chapter => chapter.bookId === id);
      const deleteChapterPromises = bookChapters.map(chapter => {
        const chapterRef = ref(db, `chapters/${chapter.id}`);
        return remove(chapterRef);
      });

      await Promise.all(deleteChapterPromises);

      if (viewBookId === id) {
        setViewBookId("");
        setActiveTab("books");
      }
    } catch (error) {
      console.error("Error removing book: ", error);
      alert("Error removing book. Please try again.");
    }
  };

  const removeChapter = async (id) => {
    if (!confirm("Remove this chapter?")) return;

    try {
      const chapterRef = ref(db, `chapters/${id}`);
      await remove(chapterRef);
    } catch (error) {
      console.error("Error removing chapter: ", error);
      alert("Error removing chapter. Please try again.");
    }
  };

  const handleAuthorSelect = (authorId) => {
    setViewAuthorId(authorId);
    setViewBookId("");
    setActiveTab("books");
    setIsSidebarOpen(false);
  };

  const handleBookSelect = (bookId) => {
    setViewBookId(bookId);
    setActiveTab("chapters");
  };

  const handleBackToBooks = () => {
    setViewBookId("");
    setActiveTab("books");
  };

  const booksForAuthor = (id) => books.filter((b) => b.authorId === id);
  const chaptersForBook = (id) => chapters.filter((c) => c.bookId === id);
  const selectedAuthor = authors.find((a) => a.id === viewAuthorId);
  const selectedBook = books.find((b) => b.id === viewBookId);
  const authorBooks = booksForAuthor(viewAuthorId);
  const bookChapters = chaptersForBook(viewBookId);

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
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
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
              {/* Only Add Author button remains */}
              <button
                onClick={() => setShowAddAuthorModal(true)}
                className="flex items-center gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-2 bg-indigo-600 text-white rounded-lg md:rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-sm md:text-base"
              >
                <span>+</span>
                <span className="hidden sm:inline">Add Author</span>
                <span className="sm:hidden">Author</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 md:py-6">
        <div className="flex gap-4 md:gap-6">
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <div className={`
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50
            w-80 lg:w-80 xl:w-96 flex-shrink-0 bg-white lg:bg-transparent
            transition-transform duration-300 ease-in-out lg:transition-none
            lg:block
          `}>
            <div className="bg-white rounded-2xl lg:rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 h-full lg:h-auto lg:max-h-[calc(100vh-200px)] overflow-y-auto">
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
                        className={`p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-200 ${viewAuthorId === author.id
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

          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 h-[calc(100vh-180px)] flex flex-col">
              {!viewAuthorId ? (
                <div className="flex-1 flex items-center justify-center">
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
                </div>
              ) : activeTab === "books" ? (
                <div className="flex flex-col h-full">
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
                      onClick={() => {
                        setBookAuthorId(viewAuthorId); // Set the current author as default
                        setShowAddBookModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm w-full sm:w-auto justify-center"
                    >
                      <span>+</span>
                      <span>Add Book</span>
                    </button>
                  </div>

                  {authorBooks.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl">
                      <div className="text-center py-8 md:py-12">
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
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto pr-2">
                      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {authorBooks.map((book) => {
                          const bookChapterCount = chaptersForBook(book.id).length;
                          return (
                            <div
                              key={book.id}
                              className="border border-slate-200 rounded-xl p-3 md:p-4 hover:shadow-md transition-shadow bg-white group"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <h3
                                    className="font-semibold text-slate-800 text-base md:text-lg cursor-pointer hover:text-indigo-600"
                                    onClick={() => handleBookSelect(book.id)}
                                  >
                                    {book.title}
                                  </h3>
                                  <div className="flex items-center gap-2 md:gap-3 mt-1 flex-wrap">
                                    <span className="text-slate-500 text-xs md:text-sm">{book.year}</span>
                                    <span className="text-slate-400 hidden md:inline">•</span>
                                    <span className="text-slate-600 text-xs md:text-sm font-medium">{book.category}</span>
                                    <span className="text-slate-400 hidden md:inline">•</span>
                                    <span className="text-slate-500 text-xs md:text-sm">{bookChapterCount} chapters</span>
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
                                <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-3 line-clamp-3">{book.description}</p>
                              )}
                              <button
                                onClick={() => handleBookSelect(book.id)}
                                className="w-full text-center py-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                              >
                                View Chapters
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Chapters View with scrollbar
                <div className="flex flex-col h-full">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                    <div className="flex-1">
                      <button
                        onClick={handleBackToBooks}
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-3 text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Books
                      </button>
                      <h2 className="text-xl md:text-2xl font-bold text-slate-800">{selectedBook?.title}</h2>
                      <p className="text-slate-600 mt-1 text-sm md:text-base">by {selectedAuthor?.name}</p>
                      {selectedBook?.description && (
                        <p className="text-slate-600 mt-2 text-sm md:text-base">{selectedBook.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setChapterBookId(viewBookId);
                        setShowAddChapterModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors shadow-sm w-full sm:w-auto justify-center"
                    >
                      <span>+</span>
                      <span>Add Chapter</span>
                    </button>
                  </div>

                  {bookChapters.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl">
                      <div className="text-center py-8 md:py-12">
                        <div className="text-4xl mb-3">📑</div>
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">No chapters yet</h3>
                        <p className="text-slate-500 mb-4 text-sm md:text-base">Add the first chapter for {selectedBook?.title}</p>
                        <button
                          onClick={() => {
                            setChapterBookId(viewBookId);
                            setShowAddChapterModal(true);
                          }}
                          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                        >
                          Add Chapter
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto pr-2">
                      <div className="space-y-4">
                        {bookChapters.map((chapter) => (
                          <div
                            key={chapter.id}
                            className="border border-slate-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow bg-white group"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                                    Chapter {chapter.chapterNumber}
                                  </span>
                                </div>
                                <h3 className="font-semibold text-slate-800 text-lg md:text-xl">{chapter.title}</h3>
                              </div>
                              <button
                                onClick={() => removeChapter(chapter.id)}
                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-1 rounded text-lg"
                                title="Remove chapter"
                              >
                                ×
                              </button>
                            </div>
                            {chapter.content && (
                              <div className="prose prose-sm max-w-none">
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{chapter.content}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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

      {showAddChapterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto mx-2">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Add New Chapter</h2>
                <button
                  onClick={() => setShowAddChapterModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl p-1"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleAddChapter} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Select Book *
                  </label>
                  <select
                    value={chapterBookId}
                    onChange={(e) => setChapterBookId(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">-- choose book --</option>
                    {books.map((book) => (
                      <option key={book.id} value={book.id}>
                        {book.title} by {authors.find(a => a.id === book.authorId)?.name}
                      </option>
                    ))}
                  </select>
                  {chapterErrors.book && (
                    <div className="text-red-500 text-sm mt-1">{chapterErrors.book}</div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Chapter Number *
                    </label>
                    <input
                      type="number"
                      value={chapterNumber}
                      onChange={(e) => setChapterNumber(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="1"
                      min="1"
                    />
                    {chapterErrors.number && (
                      <div className="text-red-500 text-sm mt-1">{chapterErrors.number}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Chapter Title *
                    </label>
                    <input
                      value={chapterTitle}
                      onChange={(e) => setChapterTitle(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Chapter title"
                    />
                    {chapterErrors.title && (
                      <div className="text-red-500 text-sm mt-1">{chapterErrors.title}</div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Chapter Content
                  </label>
                  <textarea
                    value={chapterContent}
                    onChange={(e) => setChapterContent(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                    rows={5}
                    placeholder="Enter chapter content..."
                  />
                </div>

                <div className="flex gap-3 pt-2 flex-col sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setShowAddChapterModal(false)}
                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors text-sm sm:text-base"
                  >
                    Add Chapter
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