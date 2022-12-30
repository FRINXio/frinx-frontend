import { useEffect, useMemo, useRef } from 'react';
import { Terminal } from 'xterm';

type CommandObject = {
  command: string;
  timestamp: string;
};
type Options = {
  terminalRef: React.RefObject<HTMLDivElement>;
  commandObject: CommandObject;
  onCommandChange: (key: string) => void;
};

export const useTerm = (options: Options) => {
  const { terminalRef, onCommandChange, commandObject } = options;
  const ref = useRef<Terminal>(new Terminal());

  useEffect(() => {
    ref.current.write(commandObject.command);
  }, [commandObject]);

  const handlers = useMemo(
    () => ({
      handleCommands: () => {
        ref.current.onKey(({ key }) => {
          onCommandChange(key);
        });
      },
    }),
    [ref, onCommandChange],
  );

  useEffect(() => {
    const currentRef = ref.current;
    if (terminalRef.current != null) {
      ref.current.open(terminalRef.current);

      handlers.handleCommands();
    }

    return () => {
      currentRef.dispose();
    };
  }, [handlers, terminalRef]);
};
