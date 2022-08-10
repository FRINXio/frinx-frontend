import { createContext, useContext } from 'react';
import { unwrap } from '@frinx/shared/src';

type EdgeRemoveContextProps = {
  removeEdge: (id: string) => void;
};

export const EdgeRemoveContext = createContext<EdgeRemoveContextProps | null>(null);

export function useEdgeRemoveContext(): EdgeRemoveContextProps {
  const props = unwrap(useContext(EdgeRemoveContext));

  return props;
}
