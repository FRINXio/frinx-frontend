import React, { useEffect, useRef } from 'react';
import { CheckIcon } from '@chakra-ui/icons';
import { Divider, List, ListItem, useClipboard, useOutsideClick } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import useNotifications from '../hooks/use-notifications';

type Props = {
  x: number;
  y: number;
  isOpen: boolean;
  url: string;
  onClose: () => void;
  onNewTabClick?: () => void;
  onOpenClick?: () => void;
};

export function ContextMenu({ x, y, url, isOpen, onClose }: Props) {
  const ref = useRef<HTMLUListElement>(null);

  const { pathname } = useLocation();
  const newUrl = new URL(`${pathname}/${url}`, window.location.href);
  const { onCopy, hasCopied } = useClipboard(newUrl.href);

  const { addToastNotification } = useNotifications();

  useOutsideClick({
    ref,
    handler: onClose,
  });

  useEffect(() => {
    if (hasCopied) {
      addToastNotification({
        title: 'Copied',
        content: 'The URL has been copied to your clipboard.',
        type: 'success',
      });
    }
  }, [hasCopied]);

  const showContextMenu = isOpen ? 'block' : 'none';

  const listItemStyles = {
    padding: 1,
    rounded: 'lg',
    _hover: {
      backgroundColor: 'gray.100',
    },
  };

  return (
    <List
      display={showContextMenu}
      ref={ref}
      position="absolute"
      left={x}
      top={y}
      bgColor="white"
      px={2}
      py={1}
      rounded="lg"
      border="1px"
      borderColor="gray.200"
    >
      <ListItem
        onClick={() => {
          onCopy();
          onClose();
        }}
        cursor="pointer"
        {...listItemStyles}
      >
        Copy URL
      </ListItem>
      <Divider />
      <ListItem onClick={onClose} {...listItemStyles}>
        <Link to={url} target="_blank">
          Open in new tab
        </Link>
      </ListItem>
      <Divider />
      <ListItem py={1} onClick={onClose} {...listItemStyles}>
        <Link to={url}>Open in this tab</Link>
      </ListItem>
    </List>
  );
}
