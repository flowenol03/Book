import React from 'react';
import BookList from '../books/BookList';
import ChapterList from '../chapters/ChapterList';

const MainContent = ({ 
  viewAuthorId, 
  activeTab, 
  selectedAuthor, 
  selectedBook, 
  authorBooks, 
  bookChapters, 
  onAddBook, 
  onAddChapter, 
  onBookSelect, 
  onBackToBooks, 
  onRemoveBook, 
  onRemoveChapter,
  isSidebarOpen,
  onOpenSidebar,
  isAdmin = false  // Add isAdmin prop with default false
}) => {
  // If no author is selected, show welcome message
  if (!viewAuthorId) {
    return (
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 h-[calc(100vh-180px)] flex flex-col">
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
                onClick={onOpenSidebar}
                className="lg:hidden mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                View Authors
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If author is selected but no active tab, default to books
  const currentTab = activeTab || "books";

  return (
    <div className="flex-1 min-w-0">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 h-[calc(100vh-180px)] flex flex-col">
        {currentTab === "books" ? (
          <BooksView
            selectedAuthor={selectedAuthor}
            authorBooks={authorBooks}
            onAddBook={onAddBook}
            onBookSelect={onBookSelect}
            onRemoveBook={onRemoveBook}
            isAdmin={isAdmin}
          />
        ) : (
          <ChaptersView
            selectedAuthor={selectedAuthor}
            selectedBook={selectedBook}
            bookChapters={bookChapters}
            onAddChapter={onAddChapter}
            onBackToBooks={onBackToBooks}
            onRemoveChapter={onRemoveChapter}
            isAdmin={isAdmin}
          />
        )}
      </div>
    </div>
  );
};

const BooksView = ({ selectedAuthor, authorBooks, onAddBook, onBookSelect, onRemoveBook, isAdmin }) => (
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
      {/* Only show Add Book button for admin */}
      {isAdmin && onAddBook && (
        <button
          onClick={onAddBook}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <span>+</span>
          <span>Add Book</span>
        </button>
      )}
    </div>

    {authorBooks.length === 0 ? (
      <EmptyState
        icon="📚"
        title="No books yet"
        description={`${isAdmin ? `Add the first book for ${selectedAuthor?.name}` : `No books available for ${selectedAuthor?.name}`}`}
        buttonText="Add Book"
        onAction={onAddBook}
        isAdmin={isAdmin}
      />
    ) : (
      <div className="flex-1 overflow-y-auto pr-2">
        <BookList
          books={authorBooks}
          onBookSelect={onBookSelect}
          onRemoveBook={onRemoveBook}
          isAdmin={isAdmin}
        />
      </div>
    )}
  </div>
);

const ChaptersView = ({ selectedAuthor, selectedBook, bookChapters, onAddChapter, onBackToBooks, onRemoveChapter, isAdmin }) => (
  <div className="flex flex-col h-full">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
      <div className="flex-1">
        <button
          onClick={onBackToBooks}
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
      {/* Only show Add Chapter button for admin */}
      {isAdmin && onAddChapter && (
        <button
          onClick={onAddChapter}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <span>+</span>
          <span>Add Chapter</span>
        </button>
      )}
    </div>

    {bookChapters.length === 0 ? (
      <EmptyState
        icon="📑"
        title="No chapters yet"
        description={`${isAdmin ? `Add the first chapter for ${selectedBook?.title}` : `No chapters available for ${selectedBook?.title}`}`}
        buttonText="Add Chapter"
        onAction={onAddChapter}
        isAdmin={isAdmin}
      />
    ) : (
      <div className="flex-1 overflow-y-auto pr-2">
        <ChapterList
          chapters={bookChapters}
          onRemoveChapter={onRemoveChapter}
          isAdmin={isAdmin}
        />
      </div>
    )}
  </div>
);

const EmptyState = ({ icon, title, description, buttonText, onAction, isAdmin }) => (
  <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl">
    <div className="text-center py-8 md:py-12">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">{title}</h3>
      <p className="text-slate-500 mb-4 text-sm md:text-base">{description}</p>
      {/* Only show button for admin */}
      {isAdmin && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {buttonText}
        </button>
      )}
    </div>
  </div>
);

export default MainContent;