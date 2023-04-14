import { useState } from 'react';

export type TagsInputReturnType = {
  selectedTags: string[];
  handleTagCreation: (tag: string) => void;
  handleOnSelectionChange: (tags?: string[]) => void;
  setSelectedTags: (value: React.SetStateAction<string[]>) => void;
};

const useTagsInput = (tags: string[] = []): TagsInputReturnType => {
  const [selectedTags, setSelectedTags] = useState<string[]>(tags);

  const handleTagCreation = (value: string) => setSelectedTags([...new Set([...selectedTags, value])]);
  const handleOnSelectionChange = (selectedItems?: string[]) => {
    if (selectedItems) {
      setSelectedTags([...new Set(selectedItems)]);
    }
  };

  return {
    selectedTags,
    handleTagCreation,
    handleOnSelectionChange,
    setSelectedTags,
  };
};

export default useTagsInput;
