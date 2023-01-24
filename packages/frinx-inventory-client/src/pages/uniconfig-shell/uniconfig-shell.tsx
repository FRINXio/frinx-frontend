import 'xterm/css/xterm.css';
import React, { useCallback, useMemo, useRef, useState, VoidFunctionComponent } from 'react';
import { gql, useQuery, useSubscription } from 'urql';
import { useTerm } from './uniconfig-shell.helpers';
import {
  SessionIdQuery,
  SessionIdQueryVariables,
  TerminalSubscription,
  TerminalSubscriptionVariables,
} from '../../__generated__/graphql';

const TERMINAL_SUBSCRIPTION = gql`
  subscription Terminal($sessionId: String!, $command: String, $trigger: Int) {
    uniconfigShell(sessionId: $sessionId, input: $command, trigger: $trigger)
  }
`;
const TERMINAL_SESSION_ID_QUERY = gql`
  query SessionId {
    uniconfigShellSession
  }
`;

const UniconfigShell: VoidFunctionComponent = () => {
  const [command, setCommand] = React.useState('\r');
  const [trigger, setTrigger] = useState<number>(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [{ data: sessionIdData }] = useQuery<SessionIdQuery, SessionIdQueryVariables>({
    query: TERMINAL_SESSION_ID_QUERY,
  });
  const [{ data: terminalData }] = useSubscription<TerminalSubscriptionVariables, TerminalSubscription>({
    query: TERMINAL_SUBSCRIPTION,
    pause: sessionIdData?.uniconfigShellSession == null,
    variables: {
      sessionId: sessionIdData?.uniconfigShellSession,
      command,
      trigger,
    },
  });

  // a little hack to force re-render when we get the same character in sequence
  // React wouldn't re-render, because a === a, that's why we wrap it in object and send useless `trigger` (see `setCommand` callback fn)
  const commandObject = useMemo(
    () => ({ command: terminalData?.uniconfigShell ?? '', trigger }),
    [terminalData?.uniconfigShell, trigger],
  );

  useTerm({
    terminalRef,
    commandObject,
    onCommandChange: useCallback((cmd) => {
      setCommand((prevC) => {
        if (prevC === cmd) {
          setTrigger((prev) => prev + 1);
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

export default UniconfigShell;
