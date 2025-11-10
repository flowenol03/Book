import React from 'react';

const AuthorCard = ({ author, bookCount, isSelected, onSelect, onRemove }) => {
  return (
    <div
      className={`p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-indigo-50 border border-indigo-200 shadow-sm"
          : "bg-slate-50 hover:bg-slate-100 border border-transparent"
      }`}
      onClick={() => onSelect(author.id)}
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
            <span>{bookCount} book{bookCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm("Remove author and all their books?")) {
              onRemove(author.id);
            }
          }}
          className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded text-lg"
          title="Remove author"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default AuthorCard;