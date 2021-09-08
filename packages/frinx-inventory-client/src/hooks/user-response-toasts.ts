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
  useEffect(() => {
    if (isSuccess) {
      toast({
        position: 'top-right',
        variant: 'subtle',
        status: 'success',
        title: successMessage,
      });
    }
    if (isFailure) {
      toast({
        position: 'top-right',
        variant: 'subtle',
        status: 'error',
        title: failureMessage,
      });
    }
  }, [isSuccess, isFailure, successMessage, failureMessage, toast]);
}
