import { Theme, useTheme } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

type CommandObject = {
  command: string;
  trigger: number;
};
type Options = {
  terminalRef: React.RefObject<HTMLDivElement>;
  commandObject: CommandObject;
  onCommandChange: (key: string) => void;
};

export const useTerm = (options: Options) => {
  const { fonts } = useTheme<Theme>();
  const { terminalRef, onCommandChange, commandObject } = options;
  const ref = useRef<Terminal>(
    new Terminal({
      cursorStyle: 'bar',
      cursorBlink: true,
      fontFamily: fonts.mono,
    }),
  );

  useEffect(() => {
    ref.current.write(commandObject.command);
  }, [commandObject]);

  useEffect(() => {
    const currentRef = ref.current;
    if (terminalRef.current != null) {
      const fitAddon = new FitAddon();
      ref.current.loadAddon(fitAddon);
      ref.current.open(terminalRef.current);

      ref.current.onKey((event) => {
        onCommandChange(event.key);
      });
    }

    return () => {
      currentRef.dispose();
    };
  }, [onCommandChange, terminalRef]);
};
