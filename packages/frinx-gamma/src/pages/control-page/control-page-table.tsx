import { Box, Button, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import ControlPageTableButtons from './control-page-table-buttons';
import WorkflowProgressBar from './workflow-progress-bar';

type WorkflowState = { type: 'service' | 'bearer'; id: string };
type CountState = {
  services: number;
  sites: number;
  bearers: number;
};
type TotalCountState = {
  total: CountState | null;
  added: CountState | null;
  updated: CountState | null;
  deleted: CountState | null;
};
type Props = {
  onServicesSiteLinkClick: () => void;
  onSitesSiteLinkClick: () => void;
  onVpnBearerLinkClick: () => void;
  workflowState: WorkflowState | null;
  countState: TotalCountState;
  onServiceCommitBtnClick: () => void;
  onServiceDiscardBtnClick: () => void;
  onBearerCommitBtnClick: () => void;
  onBearerDiscardBtnClick: () => void;
  onWorkflowFinish: () => void;
};

const ControlPageTable: VoidFunctionComponent<Props> = ({
  onServicesSiteLinkClick,
  onSitesSiteLinkClick,
  onVpnBearerLinkClick,
  workflowState,
  countState,
  onServiceCommitBtnClick,
  onServiceDiscardBtnClick,
  onBearerCommitBtnClick,
  onBearerDiscardBtnClick,
  onWorkflowFinish,
}) => {
  return (
    <Table background="white" size="lg">
      <Thead>
        <Tr>
          <Th colSpan={2} />
          <Th textAlign="right">Total</Th>
          <Th textAlign="right">Added</Th>
          <Th textAlign="right">Updated</Th>
          <Th textAlign="right">Deleted</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>
            <Button onClick={onServicesSiteLinkClick} variant="link">
              Services
            </Button>
          </Td>
          <Td minWidth={80}>
            <Box minHeight={12}>
              {workflowState?.type === 'service' && (
                <WorkflowProgressBar onWorkflowFinish={onWorkflowFinish} workflowId={workflowState.id} />
              )}
            </Box>
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.total?.services ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.added?.services ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.updated?.services ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.deleted?.services ?? '-'}
          </Td>
          <Td>
            <ControlPageTableButtons
              onCommitBtnClick={onServiceCommitBtnClick}
              onDiscardBtnClick={onServiceDiscardBtnClick}
              isCommitLoading={workflowState?.type === 'service'}
              isDiscardLoading={false}
            />
          </Td>
        </Tr>
        <Tr>
          <Td>
            <Button onClick={onSitesSiteLinkClick} variant="link">
              Sites
            </Button>
          </Td>
          <Td minWidth={80}>
            <Box minHeight={12}>
              {workflowState?.type === 'service' && (
                <WorkflowProgressBar onWorkflowFinish={onWorkflowFinish} workflowId={workflowState.id} />
              )}
            </Box>
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.total?.sites ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.added?.sites ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.updated?.sites ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.deleted?.sites ?? '-'}
          </Td>
          <Td>
            <ControlPageTableButtons
              onCommitBtnClick={onServiceCommitBtnClick}
              onDiscardBtnClick={onServiceDiscardBtnClick}
              isCommitLoading={workflowState?.type === 'service'}
              isDiscardLoading={false}
            />
          </Td>
        </Tr>
        <Tr>
          <Td>
            <Button onClick={onVpnBearerLinkClick} variant="link">
              VPN Bearers
            </Button>
          </Td>
          <Td minWidth={80}>
            <Box minHeight={12}>
              {workflowState?.type === 'bearer' && (
                <WorkflowProgressBar onWorkflowFinish={onWorkflowFinish} workflowId={workflowState.id} />
              )}
            </Box>
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.total?.bearers ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.added?.bearers ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.updated?.bearers ?? '-'}
          </Td>
          <Td fontFamily="monospace" textAlign="right">
            {countState.deleted?.bearers ?? '-'}
          </Td>
          <Td>
            <ControlPageTableButtons
              onCommitBtnClick={onBearerCommitBtnClick}
              onDiscardBtnClick={onBearerDiscardBtnClick}
              isCommitLoading={workflowState?.type === 'bearer'}
              isDiscardLoading={false}
            />
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
};

export default ControlPageTable;
