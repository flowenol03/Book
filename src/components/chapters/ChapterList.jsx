import React from 'react';
import ChapterCard from './ChapterCard';

const ChapterList = ({ chapters, onRemoveChapter, onEditChapter, isAdmin = false }) => {
  return (
    <div className="space-y-4">
      {chapters.map((chapter) => (
        <ChapterCard
          key={chapter.id}
          chapter={chapter}
          onRemove={isAdmin ? onRemoveChapter : null}
          onEdit={isAdmin ? onEditChapter : null}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
};

export default ChapterList;