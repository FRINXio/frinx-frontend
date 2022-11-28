import { useMemo } from 'react';
import { Terminal } from 'xterm';

type Options = {
  promptName: string;
  onPromptSubmit: (cmd: string) => void;
  onClear: () => void;
};

type HookReturnHandlers = {
  newPrompt: (terminal: Terminal) => void;
  clearPrompt: (terminal: Terminal) => void;
  initTerminal: (terminal: Terminal) => void;
  handleCommands: (terminal: Terminal) => void;
};

export const useTerm = (options: Partial<Options> = {}): HookReturnHandlers => {
  const { promptName, onClear, onPromptSubmit } = options;

  const handlers = useMemo(
    () => ({
      newPrompt: (terminal: Terminal) => {
        terminal.write(`\n${promptName}: `);
      },

      clearPrompt: (terminal: Terminal) => {
        terminal.clear();
        handlers.newPrompt(terminal);
      },

      initTerminal: (terminal: Terminal) => {
        terminal.write(`${promptName}: `);
        // eslint-disable-next-line no-param-reassign
        terminal.options = {
          convertEol: true,
          cursorBlink: true,
          fontSize: 15,
          fontWeight: 800,
          allowProposedApi: true,
        };
      },

      handleCommands: (terminal: Terminal) => {
        terminal.onKey(({ key, domEvent }) => {
          if (domEvent.code === 'Backspace' && terminal.buffer.normal.cursorX >= 27) {
            terminal.write('\b \b');
          } else if (domEvent.code === 'Enter') {
            handlers.newPrompt(terminal);
          } else if (domEvent.code === 'Backslash') {
            terminal.write('\x1B[3C');
          } else {
            terminal.write(key);
          }
        });
      },
    }),
    [promptName],
  );

  return { ...handlers };
};
