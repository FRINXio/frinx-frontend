export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function getRandomString(length: number): string {
  return window
    .btoa(
      Array.from(window.crypto.getRandomValues(new Uint8Array(length * 2)))
        .map((b) => String.fromCharCode(b))
        .join(''),
    )
    .replace(/[+/]/g, '')
    .substring(0, length);
}

export function generateVpnId(): string {
  const randomNumber = getRandomInt(99999999);
  // padding is probably not needed, because of math random distribution (i never get value with less than 8 decimals)
  return `GNS${String(randomNumber).padStart(8, '0')}`;
}

export function generateSiteId(): string {
  return `${getRandomString(8)}`;
}

export function generateNetworkAccessId(): string {
  return `NETWORK_ACCESS_${getRandomString(8)}`;
}

export function generateDeviceId(): string {
  return `NETWORK_ACCESS_${getRandomString(8)}`;
}

export function generateBearerId(): string {
  return `BEARER_${getRandomString(8)}`;
}

export function generateLocationId(): string {
  return `${getRandomString(8)}`;
}
