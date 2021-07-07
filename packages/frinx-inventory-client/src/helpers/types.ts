export type Zone = {
  id: string;
  name: string;
  tenant: string;
};
export type Device = {
  id: string;
  name: string;
  vendor: string;
  model: string;
  host: string;
  zone: Zone;
  status: 'INSTALLED' | 'N/A';
};
