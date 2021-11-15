import unwrap from './unwrap';

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return unwrap(parts.pop()).split(';').shift();
  }
  return undefined;
}

export function getTransactionId(): string | undefined {
  return getCookie('transactionId');
}
