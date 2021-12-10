import { useContext } from 'react';
import unwrap from '../helpers/unwrap';
import NotificationContext, { ContextProps } from '../notifications-context';

const useNotifications = (): ContextProps => {
  const context = useContext(NotificationContext);

  return unwrap(context);
};

export default useNotifications;
