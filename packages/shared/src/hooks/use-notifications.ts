import { useContext } from 'react';
import NotificationContext, { ContextProps } from '../contexts/notification-context';
import unwrap from '../helpers/unwrap';

const useNotifications = (): ContextProps => {
  const context = useContext(NotificationContext);

  return unwrap(context);
};

export default useNotifications;
