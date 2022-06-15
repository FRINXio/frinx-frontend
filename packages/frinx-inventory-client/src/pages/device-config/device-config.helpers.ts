import { useCallback, useEffect, useState } from 'react';
import { gql, useMutation } from 'urql';
import unwrap from '../../helpers/unwrap';
import {
  CloseTransactionMutation,
  CloseTransactionMutationVariables,
  CreateTransactionMutation,
  CreateTransactionMutationVariables,
} from '../../__generated__/graphql';

const CREATE_TRANSACTION_MUTATION = gql`
  mutation createTransaction($deviceId: String!) {
    createTransaction(deviceId: $deviceId) {
      transactionId
    }
  }
`;
const CLOSE_TRANSACTION_MUTATION = gql`
  mutation closeTransaction($deviceId: String!, $transactionId: String!) {
    closeTransaction(deviceId: $deviceId, transactionId: $transactionId) {
      isOk
    }
  }
`;

const TRANSACTION_ID_KEY = 'TX_ID_INVENTORY';

type TransactionIdData = {
  transactionId: string;
  deviceId: string;
};

function setTranscationData(deviceId: string, transactionId: string) {
  const data = JSON.stringify({ deviceId, transactionId });
  localStorage.setItem(TRANSACTION_ID_KEY, data);
}
export function getTransactionData(): TransactionIdData | null {
  const data = localStorage.getItem(TRANSACTION_ID_KEY);
  if (data == null) {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}
export function removeTransactionData(): void {
  localStorage.removeItem(TRANSACTION_ID_KEY);
}

export type UseTransactionId = {
  transactionId: string | null;
  isClosingTransaction: boolean;
  removeTransaction: () => void;
  closeTransaction: () => Promise<void>;
};

export const useTransactionId = (deviceId: string): UseTransactionId => {
  const [, createTransaction] = useMutation<CreateTransactionMutation, CreateTransactionMutationVariables>(
    CREATE_TRANSACTION_MUTATION,
  );
  const [{ fetching: isClosingTransaction }, closeTransaction] = useMutation<
    CloseTransactionMutation,
    CloseTransactionMutationVariables
  >(CLOSE_TRANSACTION_MUTATION);

  const [transactionIdData, setTransactionIdData] = useState<TransactionIdData | null>(getTransactionData());

  const removeTransaction = () => {
    removeTransactionData();
    setTransactionIdData(null);
  };

  const handleCloseTransaction = useCallback(async () => {
    closeTransaction({ deviceId, transactionId: unwrap(transactionIdData?.transactionId) }).then(() => {
      removeTransaction();
    });
  }, [closeTransaction, deviceId, transactionIdData?.transactionId]);

  useEffect(() => {
    const tData = getTransactionData();
    if (tData != null) {
      if (tData.deviceId !== deviceId) {
        handleCloseTransaction();
      }
    }
  }, [deviceId, handleCloseTransaction]);

  useEffect(() => {
    if (transactionIdData == null) {
      createTransaction({ deviceId }).then((res) => {
        const { data, error } = res;

        if (error != null) {
          throw new Error(error.toString());
        }

        if (data?.createTransaction.transactionId != null) {
          setTransactionIdData({ deviceId, transactionId: data.createTransaction.transactionId });
          setTranscationData(deviceId, data.createTransaction.transactionId);
        }
      });
    }
  }, [createTransaction, deviceId, closeTransaction, transactionIdData]);

  return {
    transactionId: transactionIdData?.transactionId ?? null,
    isClosingTransaction,
    removeTransaction,
    closeTransaction: handleCloseTransaction,
  };
};
