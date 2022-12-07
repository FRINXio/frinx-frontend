import 'xterm/css/xterm.css';
import React, { useEffect, useMemo, useRef, VoidFunctionComponent } from 'react';
import { Terminal } from 'xterm';
import { useParams } from 'react-router-dom';
import { gql, useQuery, useSubscription } from 'urql';
import { Progress } from '@chakra-ui/react';
import { useTerm } from '../../hooks/use-term';
import { TerminalSubscription, TerminalSubscriptionVariables } from '../../__generated__/graphql';

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
  const [submittedCommand, setSubmittedCommand] = React.useState('');

  const [{ data: device, fetching, error }] = useQuery({ query: QUERY_DEVICE, variables: { deviceId } });
  const [{ data: terminalData, fetching: subFetching, error: subError }] = useSubscription<
    TerminalSubscription,
    TerminalSubscriptionVariables
  >({
    query: TERMINAL_SUBSCRIPTION,
    variables: {
      command: submittedCommand,
    },
  });

  console.log(terminalData);

  const terminalRef = useRef<HTMLDivElement | null>(null);
  const { writeToBuffer } = useTerm({
    promptName: `frinx@${device?.node?.name ?? 'unknown'}:~$`,
    terminalRef,
    onPromptSubmit: () => {
      if (terminalData?.uniconfigShell != null) {
        writeToBuffer(terminalData.uniconfigShell);
      }
    },
  });

  if (fetching) {
    return <Progress isIndeterminate size="sm" marginTop={-10} />;
  }

  if (error != null || device == null) {
    return <div>Couldn&apos;t load device</div>;
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
