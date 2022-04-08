import moment from 'moment';
import React, { FC } from 'react';
import { Tr, Td, Checkbox } from '@chakra-ui/react';
import { ExecutedWorkflowsFlat } from '@frinx/workflow-ui/src/helpers/types';
import { Link } from 'react-router-dom';

type Props = {
  flatWorkflows: ExecutedWorkflowsFlat;
  selectedWfs: string[];
  selectWf: (workflowId: string, isChecked: boolean) => void;
};

const ExecutedWorkflowFlatTableItem: FC<Props> = ({ flatWorkflows, selectWf, selectedWfs }) => {
  let {
    result: { hits: data },
  } = flatWorkflows;
  return (
    <>
      {data.map((item, i) => (
        <Tr key={item.workflowId}>
          <Td>
            <Checkbox
              isChecked={selectedWfs.includes(item.workflowId)}
              onChange={(e) => selectWf(item.workflowId, e.target.checked)}
            />
          </Td>
          <Td
            as={Link}
            to={`/uniflow/executed/${item.workflowId}`}
            cursor="pointer"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={item.workflowType}
          >
            {item.workflowType}
          </Td>
          <Td>{item.status}</Td>
          <Td>{moment(item.startTime).format('MM/DD/YYYY, HH:mm:ss:SSS')}</Td>
          <Td>{item.endTime ? moment(item.endTime).format('MM/DD/YYYY, HH:mm:ss:SSS') : '-'}</Td>
        </Tr>
      ))}
    </>
  );
};

export default ExecutedWorkflowFlatTableItem;
