import { useEffect, useMemo, useRef } from 'react';
import { Terminal } from 'xterm';

type Options = {
  terminalRef: React.RefObject<HTMLDivElement>;
  uniconfigShell?: string | null;
  onCommandChange: (key: string) => void;
};

export const useTerm = (options: Partial<Options> = {}) => {
  const ref = useRef<Terminal | null>(null);
  const { terminalRef, onCommandChange, uniconfigShell } = options;

  useEffect(() => {
    if (ref.current) {
      // ref.current?.clear();
      ref.current?.write(`\n${uniconfigShell} `);
    }
  }, [uniconfigShell]);

  const handlers = useMemo(
    () => ({
      handleCommands: () => {
        ref.current?.onKey(({ key, domEvent }) => {
          if (domEvent.code === 'Backspace' && (ref.current?.buffer.normal.cursorX || 0) >= 13) {
            ref.current?.write('\b \b');
            return;
          }

          switch (domEvent.code) {
            case 'Enter':
              onCommandChange?.('\n');
              break;
            case 'Backslash':
              ref.current?.write('\x1B[3C');
              break;
            case 'ArrowUp':
              ref.current?.write('[1A');
              break;
            case 'ArrowDown':
              ref.current?.write('[1B');
              break;
            case 'ArrowLeft':
              ref.current?.write('[1D');
              break;
            case 'ArrowRight':
              ref.current?.write('[1C');
              break;
            case 'Delete':
              ref.current?.write('[3C');
              break;
            case 'Home':
            case 'End':
            case 'Escape':
              ref.current?.write('[1G');
              break;
            case 'Tab':
              ref.current?.write('\t');
              onCommandChange?.('\t');
              break;
            default:
              onCommandChange?.(key);
              break;
          }
        });
      },
    }),
    [ref, onCommandChange],
  );

  useEffect(() => {
    ref.current = new Terminal();
    if (terminalRef?.current != null) {
      ref.current?.open(terminalRef.current);

      handlers.handleCommands();
    }

    return () => {
      ref.current?.dispose();
    };
  }, [handlers, terminalRef]);
};
