import { useCallback, useEffect, useState } from 'react';
import { Terminal } from 'xterm';

type Options = {
  promptName: string;
  terminalRef: React.RefObject<HTMLDivElement>;
  onPromptSubmit: () => void;
  onClear: () => void;
};

type HookReturnHandlers = {
  newPrompt: () => void;
  clearPrompt: () => void;
  initTerminal: () => void;
  handleCommands: () => void;
  writeToBuffer: (cmd: string) => void;
};

export const useTerm = (options: Partial<Options> = {}): HookReturnHandlers => {
  const { promptName, terminalRef, onClear, onPromptSubmit } = options;
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [handlerFuncs, setHandlerFuncs] = useState<HookReturnHandlers>({} as HookReturnHandlers);

  const handlers = useCallback(
    (terminal: Terminal) => {
      const terminalClosure = terminal;
      return {
        newPrompt: () => {
          terminalClosure?.write(`\n${promptName} `);
        },

        writeToBuffer: (cmd: string) => {
          setCmdHistory((prev) => [...prev, cmd]);
          terminalClosure?.write(`\r ${cmd} `);
        },

        clearPrompt: () => {
          terminalClosure?.clear();
          handlers(terminalClosure).newPrompt();
          onClear?.();
        },

        initTerminal: () => {
          terminalClosure?.write(`${promptName} `);
          // eslint-disable-next-line no-param-reassign, @typescript-eslint/ban-ts-comment
          // @ts-ignore
          terminalClosure.options = {
            convertEol: true,
            cursorBlink: true,
            fontSize: 20,
            fontWeight: 800,
            allowProposedApi: true,
          };
        },

        handleCommands: () => {
          terminalClosure?.onKey(({ key, domEvent }) => {
            if (domEvent.code === 'Backspace' && terminalClosure?.buffer.normal.cursorX >= 13) {
              terminalClosure?.write('\b \b');
              return;
            }

            switch (domEvent.code) {
              case 'Enter':
                handlers(terminalClosure).newPrompt();
                onPromptSubmit?.();
                break;
              case 'Backslash':
                terminalClosure?.write('\x1B[3C');
                break;
              case 'ArrowUp':
                terminalClosure?.write('[1A');
                break;
              case 'ArrowDown':
                terminalClosure?.write('[1B');
                break;
              case 'ArrowLeft':
                terminalClosure?.write('[1D');
                break;
              case 'ArrowRight':
                terminalClosure?.write('[1C');
                break;
              case 'Delete':
                terminalClosure?.write('[3C');
                break;
              case 'Home':
              case 'End':
              case 'Escape':
                terminalClosure?.write('[1G');
                break;
              case 'Tab':
                terminalClosure?.write('\t');
                break;
              default:
                terminalClosure?.write(key);
                break;
            }
          });
        },
      };
    },
    [onClear, onPromptSubmit],
  );

  useEffect(() => {
    const terminal = new Terminal();
    console.log('initializing terminal');
    if (terminalRef?.current) {
      terminal?.open(terminalRef.current);

      handlers(terminal).initTerminal();
      handlers(terminal).handleCommands();
      setHandlerFuncs(handlers(terminal));
    }

    return () => {
      console.log('disposing terminal');
      terminal?.dispose();
    };
  }, [handlers, terminalRef]);

  return {
    ...handlerFuncs,
  };
};
