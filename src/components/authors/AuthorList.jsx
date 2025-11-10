import React from 'react';
import AuthorCard from './AuthorCard';

const AuthorList = ({ 
  authors, 
  booksForAuthor, 
  selectedAuthorId, 
  onAuthorSelect, 
  onRemoveAuthor,
  onAddAuthor 
}) => {
  if (authors.length === 0) {
    return (
      <div className="text-slate-500 text-center py-8">
        <div className="text-4xl mb-2">📚</div>
        <p>No authors yet</p>
        <button
          onClick={onAddAuthor}
          className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
        >
          Add your first author
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {authors.map((author) => (
        <AuthorCard
          key={author.id}
          author={author}
          bookCount={booksForAuthor(author.id).length}
          isSelected={selectedAuthorId === author.id}
          onSelect={onAuthorSelect}
          onRemove={onRemoveAuthor}
        />
      ))}
    </div>
  );
};

export default AuthorList;