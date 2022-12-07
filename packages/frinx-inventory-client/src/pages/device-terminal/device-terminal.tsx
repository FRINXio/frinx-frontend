import 'xterm/css/xterm.css';
import React, { useCallback, useRef, VoidFunctionComponent } from 'react';
import { gql, useSubscription } from 'urql';
import { Progress } from '@chakra-ui/react';
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

  const [{ data: terminalData, fetching, error }] = useSubscription<
    TerminalSubscriptionVariables,
    TerminalSubscription
  >({
    query: TERMINAL_SUBSCRIPTION,
    variables: {
      command,
    },
  });

  useTerm({
    terminalRef,
    uniconfigShell: terminalData?.uniconfigShell,
    onCommandChange: useCallback((cmd) => setCommand(cmd), []),
  });

  if (fetching) {
    return <Progress isIndeterminate size="sm" marginTop={-10} />;
  }

  if (error != null || terminalData == null) {
    return <div>Couldn&apos;t load uniconfig shell</div>;
  }

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
