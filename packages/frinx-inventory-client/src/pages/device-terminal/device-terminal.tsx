import 'xterm/css/xterm.css';
import React, { useCallback, useRef, VoidFunctionComponent } from 'react';
import { gql, useSubscription } from 'urql';
import { useTerm } from '../../hooks/use-term';
import { TerminalSubscription, TerminalSubscriptionVariables } from '../../__generated__/graphql';

const TERMINAL_SUBSCRIPTION = gql`
  subscription Terminal($command: String) {
    uniconfigShell(input: $command)
  }
`;

const TerminalComponent: VoidFunctionComponent = () => {
  const [command, setCommand] = React.useState('');
  const terminalRef = useRef<HTMLDivElement>(null);

  const [{ data: terminalData }] = useSubscription<TerminalSubscriptionVariables, TerminalSubscription>({
    query: TERMINAL_SUBSCRIPTION,
    variables: {
      command,
    },
  });

  console.log(command);

  useTerm({
    terminalRef,
    uniconfigShell: terminalData?.uniconfigShell,
    onCommandChange: useCallback((cmd) => {
      if (cmd === '\n') {
        setCommand((prev) => `${prev}\r\n`);
      } else {
        setCommand((prev) => prev + cmd);
      }
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
