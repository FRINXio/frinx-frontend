import 'xterm/css/xterm.css';
import React, { useEffect, useMemo, useRef, useState, VoidFunctionComponent } from 'react';
import { Terminal } from 'xterm';
import { useTerm } from '../../hooks/use-term';

const TerminalComponent: VoidFunctionComponent = () => {
  const shellprompt = 'frinx@resource-manager $';
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const { clearPrompt, newPrompt, initTerminal, handleCommands } = useTerm({
    promptName: shellprompt,
  });

  useEffect(() => {
    const terminal = new Terminal();
    if (terminalRef.current) {
      console.log('remounted');
      terminal.open(terminalRef.current);

      initTerminal(terminal);
      handleCommands(terminal);
    }

    return () => {
      console.log('unmount');
      terminal.dispose();
    };
  }, [initTerminal, handleCommands]);

  return (
    <div
      ref={terminalRef}
      style={{
        width: '100%',
        textAlign: 'left',
        fontSize: '20px',
      }}
    />
  );
};

export default TerminalComponent;
