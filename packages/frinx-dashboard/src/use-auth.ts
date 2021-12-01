import { useContext } from 'react';
import { Context, ContextType } from './auth-provider';
import unwrap from './helpers/unwrap';

export default function useAuth(): ContextType {
  const context = useContext(Context);

  return unwrap(context);
}
