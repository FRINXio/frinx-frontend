import React, { memo, VoidFunctionComponent } from 'react';
import { Position, Handle, NodeProps } from 'react-flow-renderer';

const DecisionNode: VoidFunctionComponent<
  NodeProps<{
    type: string;
    label: string;
    handles: string[];
  }>
> = memo(({ id, data }) => {
  const PADDING_X = 20;
  const handleStep = (100 - 2 * PADDING_X) / (data.handles.length - 1);
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div>
        {data.label} - {data.type}
      </div>
      <>
        {data.handles.map((h, index) => {
          const leftPosition = `${PADDING_X + handleStep * index}%`;
          return (
            <Handle
              key={`node-${id}-handle-${h}`}
              type="source"
              position={Position.Bottom}
              id={`${h}`}
              style={{ left: leftPosition, background: 'red' }}
            />
          );
        })}
      </>
    </>
  );
});

export default DecisionNode;
