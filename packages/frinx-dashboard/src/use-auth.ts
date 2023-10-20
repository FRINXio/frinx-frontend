import { useContext } from 'react';
import { unwrap } from '@frinx/shared';
import { Context, ContextType } from './auth-provider';

export default function useAuth(): ContextType {
  const context = useContext(Context);

  return unwrap(context);
}
