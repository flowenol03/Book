import React, { useState } from 'react';

const ChapterForm = ({ books, authors, defaultBookId = '', onSubmit, onCancel, errors = {} }) => {
  const [formData, setFormData] = useState({
    bookId: defaultBookId,
    title: '',
    content: '',
    number: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Select Book *
        </label>
        <select
          value={formData.bookId}
          onChange={(e) => handleChange('bookId', e.target.value)}
          className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
        >
          <option value="">-- choose book --</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title} by {authors.find(a => a.id === book.authorId)?.name}
            </option>
          ))}
        </select>
        {errors.book && (
          <div className="text-red-500 text-sm mt-1">{errors.book}</div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Chapter Number *
          </label>
          <input
            type="number"
            value={formData.number}
            onChange={(e) => handleChange('number', e.target.value)}
            className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
            placeholder="1"
            min="1"
          />
          {errors.number && (
            <div className="text-red-500 text-sm mt-1">{errors.number}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Chapter Title *
          </label>
          <input
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Chapter title"
          />
          {errors.title && (
            <div className="text-red-500 text-sm mt-1">{errors.title}</div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Chapter Content
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
          rows={5}
          placeholder="Enter chapter content..."
        />
      </div>

      <div className="flex gap-3 pt-2 flex-col sm:flex-row">
        <button
          type="button"
          onClick={onCancel}
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
  );
};

export default ChapterForm;