/* eslint-disable @typescript-eslint/naming-convention */

export type DBDevice = {
  id: number;
  name: string;
  role: string | null;
  management_ip: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any> | null;
  location: string | null;
  model: string | null;
  sw: string | null;
  sw_version: string | null;
  mac_address: string | null;
  serial_number: string | null;
  vendor: string | null;
  uniconfig_zone: number | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mount_parameters: Record<string, any> | null;
  username: string | null;
  password: string | null;
};
export type DBExtendedDevice = DBDevice & {
  zone_id: DBUniconfigZone['id'];
  zone_name: DBUniconfigZone['name'];
  tenant_id: DBTenant['id'];
  tenant_name: DBTenant['name'];
};
export type DBUniconfigZone = {
  id: number;
  name: string;
  tenant: number | null;
};
export type DBTenant = {
  id: number;
  name: string;
};

export type APIDevice = {
  id: string;
  name: string;
  vendor: string | null;
  model: string | null;
  host: string | null;
  zoneName: string | null;
  status: 'INSTALLED' | 'N/A';
};

export function convertDBExtendedDevice(device: DBExtendedDevice): APIDevice {
  return {
    id: device.id.toString(),
    name: device.name,
    vendor: device.vendor,
    model: device.model,
    host: device.management_ip,
    zoneName: device.zone_name,
    status: 'N/A',
  };
}
