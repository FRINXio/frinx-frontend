import React, { FC } from 'react';
import { Status } from './details-modal';
import { Button, ButtonGroup } from '@chakra-ui/react';
import callbackUtils from '../../../../utils/callback-utils';

type Props = {
  status: Status | undefined;
  restartWfs: () => void;
  onWorkflowActionExecution: () => void;
  wfId: string;
};

const DetailsModalHeaderActionButtons: FC<Props> = ({ status, onWorkflowActionExecution, restartWfs, wfId }) => {
  const terminateWfs = () => {
    const terminateWorkflows = callbackUtils.terminateWorkflowsCallback();

    terminateWorkflows([wfId]).then(() => {
      onWorkflowActionExecution();
    });
  };

  const pauseWfs = () => {
    const pauseWorkflows = callbackUtils.pauseWorkflowsCallback();

    pauseWorkflows([wfId]).then(() => {
      onWorkflowActionExecution();
    });
  };

  const resumeWfs = () => {
    const resumeWorkflows = callbackUtils.resumeWorkflowsCallback();

    resumeWorkflows([wfId]).then(() => {
      onWorkflowActionExecution();
    });
  };

  const retryWfs = () => {
    const retryWorkflows = callbackUtils.retryWorkflowsCallback();

    retryWorkflows([wfId]).then(() => {
      onWorkflowActionExecution();
    });
  };
  if (status === 'FAILED' || status === 'TERMINATED') {
    return (
      <ButtonGroup float="right">
        <Button onClick={restartWfs} colorScheme="whiteAlpha">
          <i className="fas fa-redo" />
          &nbsp;&nbsp;Restart
        </Button>
        <Button onClick={retryWfs} colorScheme="whiteAlpha">
          <i className="fas fa-history" />
          &nbsp;&nbsp;Retry
        </Button>
      </ButtonGroup>
    );
  }

  if (status === 'RUNNING') {
    return (
      <ButtonGroup float="right">
        <Button onClick={terminateWfs} colorScheme="whiteAlpha">
          <i className="fas fa-times" />
          &nbsp;&nbsp;Terminate
        </Button>
        <Button onClick={pauseWfs} colorScheme="whiteAlpha">
          <i className="fas fa-pause" />
          &nbsp;&nbsp;Pause
        </Button>
      </ButtonGroup>
    );
  }

  return (
    <ButtonGroup float="right">
      <Button onClick={resumeWfs} colorScheme="whiteAlpha">
        <i className="fas fa-play" />
        &nbsp;&nbsp;Resume
      </Button>
    </ButtonGroup>
  );
};

export default DetailsModalHeaderActionButtons;
