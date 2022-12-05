import 'xterm/css/xterm.css';
import React, { useEffect, useRef, VoidFunctionComponent } from 'react';
import { Terminal } from 'xterm';
import { useParams } from 'react-router-dom';
import { gql, SubscriptionHandler, useQuery, useSubscription } from 'urql';
import { Button, HStack, Input, Progress } from '@chakra-ui/react';
import { useTerm } from '../../hooks/use-term';
import {
  Subscription,
  SubscriptionUniconfigShellArgs,
  TerminalSubscription,
  TerminalSubscriptionVariables,
} from '../../__generated__/graphql';

const QUERY_DEVICE = gql`
  query DeviceDetail($deviceId: ID!) {
    node(id: $deviceId) {
      ... on Device {
        id
        name
      }
    }
  }
`;

const TERMINAL_SUBSCRIPTION = gql`
  subscription Terminal($command: String) {
    uniconfigShell(input: $command)
  }
`;

const TerminalComponent: VoidFunctionComponent = () => {
  const { deviceId } = useParams();
  const [command, setCommand] = React.useState('');
  const [jozko, setJozko] = React.useState('');

  const [{ data: device, fetching, error }] = useQuery({ query: QUERY_DEVICE, variables: { deviceId } });
  const [{ data: terminalData, fetching: subFetching, error: subError }] = useSubscription({
    query: TERMINAL_SUBSCRIPTION,
    variables: {
      command: jozko,
    },
  });

  console.log(terminalData);

  const terminalRef = useRef<HTMLDivElement | null>(null);
  const { clearPrompt, newPrompt, initTerminal, handleCommands } = useTerm({
    promptName: `frinx@${device?.node?.name ?? 'unknown'}:~$`,
  });

  useEffect(() => {
    const terminal = new Terminal();
    if (terminalRef.current) {
      terminal.open(terminalRef.current);

      initTerminal(terminal);
      handleCommands(terminal);
    }

    return () => {
      terminal.dispose();
    };
  }, [initTerminal, handleCommands]);

  if (fetching) {
    return <Progress isIndeterminate size="sm" marginTop={-10} />;
  }

  if (error != null || device == null) {
    return <div>Couldn&apos;t load device</div>;
  }

  return (
    <>
      <HStack>
        <Input value={command} onChange={(e) => setCommand(e.target.value)} />
        <Button onClick={() => setJozko(command)}>Send</Button>
      </HStack>
      <div
        ref={terminalRef}
        style={{
          width: '100%',
          height: '100vh',
          textAlign: 'left',
          fontSize: '20px',
          // marginTop: '-40px',
        }}
      />
    </>
  );
};

export default TerminalComponent;
