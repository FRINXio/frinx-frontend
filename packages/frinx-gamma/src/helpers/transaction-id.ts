import unwrap from './unwrap';

function setCookie(name: string, val: string): void {
  const date = new Date();
  const value = val;

  // 1 day expiration
  date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return unwrap(parts.pop()).split(';').shift();
  }
  return undefined;
}

export function setTransactionId(transactionId: string): void {
  setCookie('UNICONFIGTXID', transactionId);
}

export function getTransactionId(): string | undefined {
  return getCookie('UNICONFIGTXID');
}
