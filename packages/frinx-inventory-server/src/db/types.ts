/* eslint-disable @typescript-eslint/naming-convention */
type JSONPrimitive = string | number | boolean | null;
type JSONValue = JSONPrimitive | JSONObject | JSONArray;
type JSONObject = { [key: string]: JSONValue };
type JSONArray = JSONValue[];
export type DBDevice = {
  id: number;
  name: string;
  role: string | null;
  management_ip: string | null;
  config: JSONValue | null;
  location: string | null;
  model: string | null;
  sw: string | null;
  sw_version: string | null;
  mac_address: string | null;
  serial_number: string | null;
  vendor: string | null;
  uniconfig_zone: number | null;
  mount_parameters: JSONValue | null;
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
export type DBExtendedZone = {
  id: number;
  name: string;
  tenant: number;
  tenant_id: number | null;
  tenant_name: string;
};
