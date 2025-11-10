import React from 'react';
import ChapterCard from './ChapterCard';

const ChapterList = ({ chapters, onRemoveChapter }) => {
  return (
    <div className="space-y-4">
      {chapters.map((chapter) => (
        <ChapterCard
          key={chapter.id}
          chapter={chapter}
          onRemove={onRemoveChapter}
        />
      ))}
    </div>
  );
};

export default ChapterList;