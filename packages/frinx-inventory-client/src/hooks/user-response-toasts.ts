import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';

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
  const toast = useToast();
  const successToastId = 'success-toast-id';
  const failureToastId = 'failure-toast-id';
  useEffect(() => {
    if (isSuccess) {
      if (!toast.isActive(successToastId)) {
        toast({
          position: 'top-right',
          variant: 'subtle',
          status: 'success',
          title: successMessage,
        });
      }
    }
    if (isFailure) {
      if (!toast.isActive(failureToastId)) {
        toast({
          position: 'top-right',
          variant: 'subtle',
          status: 'error',
          title: failureMessage,
        });
      }
    }
  }, [isSuccess, isFailure, successMessage, failureMessage, toast]);
}
