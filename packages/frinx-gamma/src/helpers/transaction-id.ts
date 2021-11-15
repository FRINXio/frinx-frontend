import { v4 as uuid4 } from 'uuid';
import unwrap from './unwrap';

function setCookie(name: string, val: string) {
  const date = new Date();
  const value = val;

  // 1 day expiration
  date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return unwrap(parts.pop()).split(';').shift();
  }
}

export function setTransactionId() {
  const transactionId = uuid4();
  setCookie('transactionId', transactionId);
}

export function getTransactionId() {
  return getCookie('transactionId');
}
