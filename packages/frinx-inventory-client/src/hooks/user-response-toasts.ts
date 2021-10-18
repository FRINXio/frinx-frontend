import { useEffect } from 'react';
import useNotifications from './use-notifications';

type UseResponseToastsProps = {
  isSuccess: boolean;
  isFailure: boolean;
  successMessage: string;
  failureMessage: string;
};

export default function useResponseToasts({
  isSuccess,
  isFailure,
  successMessage,
  failureMessage,
}: UseResponseToastsProps): void {
  const { addToastNotification } = useNotifications();

  useEffect(() => {
    if (isSuccess) {
      addToastNotification({
        type: 'success',
        title: 'Success',
        content: successMessage,
      });
    }
    if (isFailure) {
      addToastNotification({
        type: 'error',
        title: 'Error',
        content: failureMessage,
      });
    }
  }, [isSuccess, isFailure, successMessage, failureMessage, addToastNotification]);
}
