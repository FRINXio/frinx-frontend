import { useState } from 'react';

type ReturnType = {
  selectedTags: string[];
  handleTagCreation: (tag: string) => void;
  handleOnSelectionChange: (tags?: string[]) => void;
};

export const useTagsInput = (tags: string[] = []): ReturnType => {
  const [selectedTags, setSelectedTags] = useState<string[]>(tags);
  const handleTagCreation = (value: string) => {
    setSelectedTags([...new Set([...selectedTags, value])]);
  };

  const handleOnSelectionChange = (selectedItems?: string[]) => {
    if (selectedItems) {
      setSelectedTags([...new Set(selectedItems)]);
    }
  };

  return {
    selectedTags,
    handleTagCreation,
    handleOnSelectionChange,
  };
};
