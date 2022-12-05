import { useMemo, useState } from 'react';
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
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);

  const handlers = useMemo(
    () => ({
      newPrompt: (terminal: Terminal) => {
        terminal.write(`\n${promptName}`);
      },

      clearPrompt: (terminal: Terminal) => {
        terminal.clear();
        handlers.newPrompt(terminal);
      },

      initTerminal: (terminal: Terminal) => {
        terminal.write(`${promptName} `);
        // eslint-disable-next-line no-param-reassign
        terminal.options = {
          convertEol: true,
          cursorBlink: true,
          fontSize: 20,
          fontWeight: 800,
          allowProposedApi: true,
        };
      },

      handleCommands: (terminal: Terminal) => {
        terminal.onKey(({ key, domEvent }) => {
          if (domEvent.code === 'Backspace' && terminal.buffer.normal.cursorX >= 13) {
            terminal.write('\b \b');
            return;
          }

          console.log('cmd', terminal.buffer.active.getLine(terminal.buffer.active.baseY)?.translateToString());

          switch (domEvent.code) {
            case 'Enter':
              handlers.newPrompt(terminal);
              break;
            case 'Backslash':
              terminal.write('\x1B[3C');
              break;
            case 'ArrowUp':
              terminal.write('[1A');
              break;
            case 'ArrowDown':
              terminal.write('[1B');
              break;
            case 'ArrowLeft':
              terminal.write('[1D');
              break;
            case 'ArrowRight':
              terminal.write('[1C');
              break;
            case 'Delete':
              terminal.write('[3C');
              break;
            case 'Home':
            case 'End':
            case 'Escape':
              terminal.write('[1G');
              break;
            case 'Tab':
              terminal.write('\t');
              break;
            default:
              terminal.write(key);
              break;
          }
        });
      },
    }),
    [promptName],
  );

  return { ...handlers };
};
