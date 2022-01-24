// @flow
import React, { forwardRef, useImperativeHandle } from 'react';
import {
  Box,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Tag,
  TagCloseButton,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { matchSorter } from 'match-sorter';

type Props = {
  options: string[];
  onChange: (labels: string[]) => void;
  selected: string[];
  placeholder: string;
};

const WfAutoComplete = forwardRef((props: Props, ref) => {
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState(0);
  const [isOptionsVisible, setOptionsVisible] = React.useState(false);
  const eventRef = React.useRef<null | string>(null);

  useImperativeHandle(ref, () => ({
    clear() {
      setQuery('');
    },
  }));

  const { options, selected, onChange, placeholder } = props;

  const results = React.useMemo(
    function getResults() {
      return matchSorter(
        options.map((e) => {
          return { value: e };
        }),
        query,
        {
          keys: ['value'],
        },
      )
        .filter((e) => {
          return !selected?.includes(e.value);
        })
        .slice(0, 20);
    },
    [options, query, selected],
  );

  const onKeyDown = React.useCallback(
    (e) => {
      eventRef.current = 'keyboard';
      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          if (active + 1 < results.length) {
            setActive(active + 1);
          }
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          if (active - 1 >= 0) {
            setActive(active - 1);
          }
          break;
        }
        case 'Enter': {
          e.preventDefault();
          if (!selected.includes(results[active].value)) {
            onChange([...selected, results[active].value]);
            setQuery('');
          }
          setOptionsVisible(false);
          break;
        }
      }
    },
    [active, onChange, results, selected],
  );

  return (
    <Box position="relative">
      <InputGroup>
        {selected && selected.length > 0 && (
          <InputLeftAddon bg="white">
            {selected.map((item, index) => {
              return (
                <Tag
                  key={item}
                  size="sm"
                  cursor="pointer"
                  onClick={() => {
                    onChange([...selected.slice(0, index), ...selected.slice(index + 1, selected.length)]);
                  }}
                >
                  <p>{item}</p>
                  <TagCloseButton />
                </Tag>
              );
            })}
          </InputLeftAddon>
        )}
        <Input
          placeholder={placeholder}
          background="white"
          value={query}
          onChange={(e) => {
            setOptionsVisible(true);
            setQuery(e.target.value);
          }}
          onFocus={() => {
            setOptionsVisible(true);
          }}
          onBlur={() => {
            setOptionsVisible(false);
          }}
          onClick={() => {
            setOptionsVisible(true);
          }}
          onKeyDown={onKeyDown}
        />
        {selected && selected.length > 0 && (
          <InputRightElement>
            <IconButton
              aria-label="Clear"
              variant="ghost"
              colorScheme="gray"
              icon={<Icon as={FontAwesomeIcon} icon={faTimes} />}
              onClick={() => onChange([])}
            />
          </InputRightElement>
        )}
      </InputGroup>

      {isOptionsVisible && (
        <Box bg="white" position="absolute" w="100%" zIndex="dropdown" border="1px solid gray.50">
          <Box>
            {results.map((item, index) => {
              return (
                <Box
                  key={index}
                  padding={2}
                  backgroundColor={active == index ? 'gray.50' : 'white'}
                  onMouseOver={() => {
                    setActive(index);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!selected || !selected.includes(item.value)) {
                      onChange([item.value]);
                      setQuery('');
                    }
                    setOptionsVisible(false);
                  }}
                  cursor="pointer"
                >
                  {item.value}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
});

export default WfAutoComplete;
