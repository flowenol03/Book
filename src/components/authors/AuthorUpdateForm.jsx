import React, { useState, useEffect } from 'react';

const AuthorUpdateForm = ({ author, onSubmit, onCancel, errors = {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    genres: ''
  });

  // Populate form with author data when component mounts or author changes
  useEffect(() => {
    if (author) {
      setFormData({
        name: author.name || '',
        bio: author.bio || '',
        genres: author.genres ? author.genres.join(', ') : ''
      });
    }
  }, [author]);

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
          Author Name *
        </label>
        <input
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
          placeholder="Enter author name"
        />
        {errors.name && (
          <div className="text-red-500 text-sm mt-1">{errors.name}</div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Short Bio (2–3 lines)
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
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
          value={formData.genres}
          onChange={(e) => handleChange('genres', e.target.value)}
          placeholder="Fiction, Sci-Fi, Mystery"
          className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
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
          className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm sm:text-base"
        >
          Update Author
        </button>
      </div>
    </form>
  );
};

export default AuthorUpdateForm;