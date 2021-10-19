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
  return `VPN_${getRandomString(8)}`;
}

export function generateSiteId(): string {
  return `SITE_${getRandomString(8)}`;
}

export function generateNetworkAccessId(): string {
  return `NETWORK_ACCESS_${getRandomString(8)}`;
}

export function generateDeviceId(): string {
  return `NETWORK_ACCESS_${getRandomString(8)}`;
}
