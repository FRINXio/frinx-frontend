import 'xterm/css/xterm.css';
import React, { useCallback, useMemo, useRef, useState, VoidFunctionComponent } from 'react';
import { gql, useSubscription } from 'urql';
import { useTerm } from '../../hooks/use-term';
import { TerminalSubscription, TerminalSubscriptionVariables } from '../../__generated__/graphql';

const TERMINAL_SUBSCRIPTION = gql`
  subscription Terminal($command: String, $timestamp: String!) {
    uniconfigShell(input: $command, timestamp: $timestamp)
  }
`;

const TerminalComponent: VoidFunctionComponent = () => {
  const [command, setCommand] = React.useState('');
  const [timestamp, setTimestamp] = useState<string>('1');
  const terminalRef = useRef<HTMLDivElement>(null);

  const [{ data: terminalData }] = useSubscription<TerminalSubscriptionVariables, TerminalSubscription>({
    query: TERMINAL_SUBSCRIPTION,
    variables: {
      command,
      timestamp,
    },
  });

  const commandObject = useMemo(
    () => ({ command: terminalData?.uniconfigShell ?? '', timestamp }),
    [terminalData?.uniconfigShell, timestamp],
  );

  useTerm({
    terminalRef,
    commandObject,
    onCommandChange: useCallback((cmd) => {
      setCommand((prevC) => {
        if (prevC === cmd) {
          setTimestamp((prev) => String(Number(prev) + 1));
        }
        return cmd;
      });
    }, []),
  });

  return (
    <div
      ref={terminalRef}
      style={{
        width: '100%',
        height: '100vh',
        textAlign: 'left',
      }}
    />
  );
};

export default TerminalComponent;
