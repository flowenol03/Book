import React, { useState } from "react";
import { useLibrary } from "./hooks/useLibrary";
import { useAuth } from "./contexts/AuthContext";
import AuthorList from "./components/authors/AuthorList";
import AuthorForm from "./components/authors/AuthorForm";
import BookForm from "./components/books/BookForm";
import ChapterForm from "./components/chapters/ChapterForm";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Modal from "./components/common/Modal";
import Sidebar from "./components/common/Sidebar";
import MainContent from "./components/common/MainContent";
import AdminLogin from "./components/admin/AdminLogin";
import AdminControls from "./components/admin/AdminControls";
import { isNonEmpty, isFourDigitYear } from "./utils/validators";
import "../styles/App.css";

export default function App() {
  const {
    authors,
    books,
    chapters,
    loading,
    viewAuthorId,
    viewBookId,
    activeTab,
    selectedAuthor,
    selectedBook,
    authorBooks,
    bookChapters,
    booksForAuthor,
    addAuthor,
    removeAuthor,
    addBook,
    removeBook,
    addChapter,
    removeChapter,
    handleAuthorSelect,
    handleBookSelect,
    handleBackToBooks,
    setViewAuthorId
  } = useLibrary();

  const { isAdmin, isLoading: authLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Form handlers with validation (same as before)
  const handleAddAuthor = async (authorData) => {
    const errors = {};
    if (!isNonEmpty(authorData.name)) errors.name = "Author name is required.";
    setFormErrors(errors);
    if (Object.keys(errors).length) return false;

    try {
      const newAuthorId = await addAuthor({
        name: authorData.name.trim(),
        bio: authorData.bio.trim(),
        genres: authorData.genres.split(",").map((g) => g.trim()).filter(Boolean),
      });

      setViewAuthorId(newAuthorId);
      setActiveModal(null);
      setFormErrors({});
      return true;
    } catch (error) {
      console.error("Error adding author: ", error);
      alert("Error adding author. Please try again.");
      return false;
    }
  };

  const handleAddBook = async (bookData) => {
    const errors = {};
    if (!isNonEmpty(bookData.authorId)) errors.author = "Select an author.";
    if (!isNonEmpty(bookData.title)) errors.title = "Book title is required.";
    if (!isFourDigitYear(bookData.year)) errors.year = "Year must be 4 digits (e.g. 1951).";
    setFormErrors(errors);
    if (Object.keys(errors).length) return false;

    try {
      await addBook({
        authorId: bookData.authorId,
        title: bookData.title.trim(),
        description: bookData.description.trim(),
        year: bookData.year.trim(),
        category: bookData.category.trim() || "Uncategorized",
      });

      setActiveModal(null);
      setFormErrors({});
      return true;
    } catch (error) {
      console.error("Error adding book: ", error);
      alert("Error adding book. Please try again.");
      return false;
    }
  };

  const handleAddChapter = async (chapterData) => {
    const errors = {};
    if (!isNonEmpty(chapterData.bookId)) errors.book = "Select a book.";
    if (!isNonEmpty(chapterData.title)) errors.title = "Chapter title is required.";
    if (!chapterData.number || chapterData.number < 1) errors.number = "Chapter number must be at least 1.";
    setFormErrors(errors);
    if (Object.keys(errors).length) return false;

    try {
      await addChapter({
        bookId: chapterData.bookId,
        title: chapterData.title.trim(),
        content: chapterData.content.trim(),
        chapterNumber: parseInt(chapterData.number),
      });

      setActiveModal(null);
      setFormErrors({});
      return true;
    } catch (error) {
      console.error("Error adding chapter: ", error);
      alert("Error adding chapter. Please try again.");
      return false;
    }
  };

  const handleRemoveAuthor = (id) => {
    if (window.confirm("Remove author and all their books?")) {
      removeAuthor(id);
    }
  };

  const handleRemoveBook = (id) => {
    if (window.confirm("Remove this book and all its chapters?")) {
      removeBook(id);
    }
  };

  const handleRemoveChapter = (id) => {
    if (window.confirm("Remove this chapter?")) {
      removeChapter(id);
    }
  };

  if (loading || authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
              {/* Admin Login Button - Show when not admin */}
              {!isAdmin && (
                <button
                  onClick={() => setShowAdminLogin(true)}
                  className="flex items-center gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-2 bg-gray-600 text-white rounded-lg md:rounded-xl hover:bg-gray-700 transition-colors shadow-sm text-sm md:text-base"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="hidden sm:inline">Admin</span>
                </button>
              )}
              {/* Add Author Button - Only show for admin */}
              {isAdmin && (
                <button
                  onClick={() => setActiveModal('ADD_AUTHOR')}
                  className="flex items-center gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-2 bg-indigo-600 text-white rounded-lg md:rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-sm md:text-base"
                >
                  <span>+</span>
                  <span className="hidden sm:inline">Add Author</span>
                  <span className="sm:hidden">Author</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Admin Controls */}
      <AdminControls />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 md:py-6">
        <div className="flex gap-4 md:gap-6">
          {/* Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          >
            <AuthorList
              authors={authors}
              booksForAuthor={booksForAuthor}
              selectedAuthorId={viewAuthorId}
              onAuthorSelect={handleAuthorSelect}
              onRemoveAuthor={isAdmin ? handleRemoveAuthor : null} // Only pass if admin
              onAddAuthor={isAdmin ? () => setActiveModal('ADD_AUTHOR') : null}
              isAdmin={isAdmin}
            />
          </Sidebar>

          {/* Main Content Area */}
          <MainContent
            viewAuthorId={viewAuthorId}
            activeTab={activeTab}
            selectedAuthor={selectedAuthor}
            selectedBook={selectedBook}
            authorBooks={authorBooks}
            bookChapters={bookChapters}
            onAddBook={isAdmin ? () => setActiveModal('ADD_BOOK') : null}
            onAddChapter={isAdmin ? () => setActiveModal('ADD_CHAPTER') : null}
            onBookSelect={handleBookSelect}
            onBackToBooks={handleBackToBooks}
            onRemoveBook={isAdmin ? handleRemoveBook : null}
            onRemoveChapter={isAdmin ? handleRemoveChapter : null}
            isSidebarOpen={isSidebarOpen}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            isAdmin={isAdmin}
          />
        </div>
      </div>

      {/* Modals - Only show for admin */}
      {isAdmin && (
        <>
          <Modal
            isOpen={activeModal === 'ADD_AUTHOR'}
            onClose={() => {
              setActiveModal(null);
              setFormErrors({});
            }}
            title="Add New Author"
          >
            <AuthorForm
              onSubmit={handleAddAuthor}
              onCancel={() => {
                setActiveModal(null);
                setFormErrors({});
              }}
              errors={formErrors}
            />
          </Modal>

          <Modal
            isOpen={activeModal === 'ADD_BOOK'}
            onClose={() => {
              setActiveModal(null);
              setFormErrors({});
            }}
            title="Add New Book"
          >
            <BookForm
              authors={authors}
              defaultAuthorId={viewAuthorId}
              onSubmit={handleAddBook}
              onCancel={() => {
                setActiveModal(null);
                setFormErrors({});
              }}
              errors={formErrors}
            />
          </Modal>

          <Modal
            isOpen={activeModal === 'ADD_CHAPTER'}
            onClose={() => {
              setActiveModal(null);
              setFormErrors({});
            }}
            title="Add New Chapter"
          >
            <ChapterForm
              books={books}
              authors={authors}
              defaultBookId={viewBookId}
              onSubmit={handleAddChapter}
              onCancel={() => {
                setActiveModal(null);
                setFormErrors({});
              }}
              errors={formErrors}
            />
          </Modal>
        </>
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin onClose={() => setShowAdminLogin(false)} />
      )}
    </div>
  );
}