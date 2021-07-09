export type Zone = {
  id: string;
  name: string;
  tenant: string;
};
export type Device = {
  id: string;
  name: string;
  vendor: string | null;
  model: string | null;
  host: string | null;
  zone: Zone;
  mountParameters: string;
  status: 'INSTALLED' | 'N/A';
};
