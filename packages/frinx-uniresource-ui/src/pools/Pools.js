import * as React from 'react';
import { useState } from 'react';
import PoolsPage from './PoolsPage/PoolsPage';
import CreatePoolPage from './CreatePoolPage/CreatePoolPage';

const Pools = (props) => {
  const { onDetailClick } = props;
  const [showCreatePool, setShowCreatePool] = useState(false);

  return (
    <>
      {showCreatePool ? (
        <CreatePoolPage setShowCreatePool={setShowCreatePool} />
      ) : (
        <PoolsPage setShowCreatePool={setShowCreatePool} onDetailClick={onDetailClick} />
      )}
    </>
  );
};

export default Pools;
