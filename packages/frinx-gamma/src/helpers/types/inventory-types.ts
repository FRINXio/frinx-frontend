export type Device = {
  id: string;
  name: string;
  vendor: string;
  model: string;
  host: string;
  zone: number;
  status: 'INSTALLED' | 'N/A';
};
