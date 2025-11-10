import React from 'react';

const BookCard = ({ book, onSelect, onRemove, onEdit, isAdmin = false }) => {
  return (
    <div className="border border-slate-200 rounded-xl p-3 md:p-4 hover:shadow-md transition-shadow bg-white group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3
            className="font-semibold text-slate-800 text-base md:text-lg cursor-pointer hover:text-indigo-600"
            onClick={() => onSelect(book.id)}
          >
            {book.title}
          </h3>
          <div className="flex items-center gap-2 md:gap-3 mt-1 flex-wrap">
            <span className="text-slate-500 text-xs md:text-sm">{book.year}</span>
            <span className="text-slate-400 hidden md:inline">•</span>
            <span className="text-slate-600 text-xs md:text-sm font-medium">{book.category}</span>
          </div>
        </div>
        {isAdmin && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(book);
                }}
                className="text-slate-400 hover:text-blue-500 transition-colors p-1 rounded text-lg"
                title="Edit book"
              >
                ✏️
              </button>
            )}
            {onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Remove this book and all its chapters?")) {
                    onRemove(book.id);
                  }
                }}
                className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded text-lg"
                title="Remove book"
              >
                ×
              </button>
            )}
          </div>
        )}
      </div>
      {book.description && (
        <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-3 line-clamp-3">{book.description}</p>
      )}
      <button
        onClick={() => onSelect(book.id)}
        className="w-full text-center py-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
      >
        View Chapters
      </button>
    </div>
  );
};

export default BookCard;