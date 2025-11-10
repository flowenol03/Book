import React, { useState, useEffect } from 'react';

const BookUpdateForm = ({ book, authors, onSubmit, onCancel, errors = {} }) => {
  const [formData, setFormData] = useState({
    authorId: '',
    title: '',
    description: '',
    year: '',
    category: ''
  });

  useEffect(() => {
    if (book) {
      setFormData({
        authorId: book.authorId || '',
        title: book.title || '',
        description: book.description || '',
        year: book.year || '',
        category: book.category || ''
      });
    }
  }, [book]);

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
          Select Author *
        </label>
        <select
          value={formData.authorId}
          onChange={(e) => handleChange('authorId', e.target.value)}
          className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
        >
          <option value="">-- choose author --</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        {errors.author && (
          <div className="text-red-500 text-sm mt-1">{errors.author}</div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Book Title *
        </label>
        <input
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
          placeholder="Enter book title"
        />
        {errors.title && (
          <div className="text-red-500 text-sm mt-1">{errors.title}</div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Short Description (2–3 lines)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
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
            value={formData.year}
            onChange={(e) => handleChange('year', e.target.value)}
            placeholder="1951"
            className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
          />
          {errors.year && (
            <div className="text-red-500 text-sm mt-1">{errors.year}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Category/Type
          </label>
          <input
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="Novel, Short Stories"
            className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>
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
          className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm sm:text-base"
        >
          Update Book
        </button>
      </div>
    </form>
  );
};

export default BookUpdateForm;