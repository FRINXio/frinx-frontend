import { Item } from 'chakra-ui-autocomplete';
import { useState } from 'react';

type ReturnType = {
  selectedTags: Item[];
  handleTagCreation: (tag: Item) => void;
  handleOnSelectionChange: (tags?: Item[]) => void;
};

const useTagsInput = (): ReturnType => {
  const [selectedTags, setSelectedTags] = useState<Item[]>([]);
  const handleTagCreation = (tag: Item) => {
    setSelectedTags(selectedTags.concat({ label: tag.label, value: tag.value }));
  };

  const handleOnSelectionChange = (selectedItems?: Item[]) => {
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

export default useTagsInput;
