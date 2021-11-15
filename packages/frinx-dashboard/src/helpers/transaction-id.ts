import { v4 as uuid4 } from 'uuid';
import unwrap from './unwrap';

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return unwrap(parts.pop()).split(';').shift();
  }
}

export function getTransactionId() {
  return getCookie('transactionId');
}
