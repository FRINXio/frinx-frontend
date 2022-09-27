import { useMemo, useState } from 'react';

const useTags = (
  tags: string[] = [],
): [tags: string[], handlers: { handleOnTagClick: (tag: string) => void; clearAllTags: () => void }] => {
  const [selectedTags, setSelectedTags] = useState<string[]>(tags);
  const handlers = useMemo(
    () => ({
      handleOnTagClick: (tag: string) => {
        if (selectedTags.includes(tag)) {
          setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
        } else {
          setSelectedTags((prev) => [...prev, tag]);
        }
      },
      clearAllTags: () => setSelectedTags([]),
    }),
    [selectedTags],
  );

  return [selectedTags, handlers];
};

export default useTags;
