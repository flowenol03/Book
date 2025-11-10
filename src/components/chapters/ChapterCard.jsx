import React from 'react';

const ChapterCard = ({ chapter, onRemove, isAdmin = false }) => {
  return (
    <div className="border border-slate-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow bg-white group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
              Chapter {chapter.chapterNumber}
            </span>
          </div>
          <h3 className="font-semibold text-slate-800 text-lg md:text-xl">{chapter.title}</h3>
        </div>
        {isAdmin && onRemove && (
          <button
            onClick={() => {
              if (window.confirm("Remove this chapter?")) {
                onRemove(chapter.id);
              }
            }}
            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-1 rounded text-lg"
            title="Remove chapter"
          >
            ×
          </button>
        )}
      </div>
      {chapter.content && (
        <div className="prose prose-sm max-w-none">
          <p className="text-slate-600 leading-relaxed whitespace-pre-line">{chapter.content}</p>
        </div>
      )}
    </div>
  );
};

export default ChapterCard;