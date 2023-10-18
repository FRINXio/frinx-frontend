import React, { createContext, FC, useContext, useMemo } from 'react';
import { unwrap } from '@frinx/shared';

type EdgeRemoveContextProps = {
  removeEdge: (id: string) => void;
};

export const EdgeRemoveContext = createContext<EdgeRemoveContextProps | null>(null);

export function useEdgeRemoveContext(): EdgeRemoveContextProps {
  const props = unwrap(useContext(EdgeRemoveContext));

  return props;
}

export const EdgeRemoveProvider: FC<EdgeRemoveContextProps> = ({ children, removeEdge }) => {
  return (
    <EdgeRemoveContext.Provider value={useMemo(() => ({ removeEdge }), [removeEdge])}>
      {children}
    </EdgeRemoveContext.Provider>
  );
};
