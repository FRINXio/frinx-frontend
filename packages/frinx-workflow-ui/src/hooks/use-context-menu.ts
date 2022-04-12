import { useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';

export const useContextMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement>, afterRightClickHandler: () => void) => {
    e.preventDefault();
    setPosition({ x: e.pageX, y: e.pageY });
    afterRightClickHandler();
    onOpen();
  };

  return {
    isOpen,
    onClose,
    onRightClick: handleRightClick,
    position,
  };
};
