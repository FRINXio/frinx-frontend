/* eslint-disable @typescript-eslint/naming-convention */
import * as t from 'io-ts';
import { Either, fold } from 'fp-ts/lib/Either';
import { PathReporter } from 'io-ts/lib/PathReporter';

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

export type ApiZone = {
  id: string;
  name: string;
  tenant: string;
};
export type APIDevice = {
  id: string;
  name: string;
  vendor: string | null;
  model: string | null;
  host: string | null;
  zone: ApiZone | null;
  status: 'INSTALLED' | 'N/A';
};

export function convertDBExtendedDevice(device: DBExtendedDevice): APIDevice {
  return {
    id: device.id.toString(),
    name: device.name,
    vendor: device.vendor,
    model: device.model,
    host: device.management_ip,
    zone: {
      id: device.zone_id.toString(),
      name: device.zone_name,
      tenant: device.tenant_name,
    },
    status: 'N/A',
  };
}

export function convertDBExtendedZone(zone: DBExtendedZone): ApiZone {
  return {
    id: zone.id.toString(),
    name: zone.name,
    tenant: zone.tenant_name,
  };
}

export function extractResult<A>(result: Either<t.Errors, A>): A {
  return fold(
    () => {
      const errorMessages = PathReporter.report(result);
      throw new Error(errorMessages.join('. '));
    },
    (data: A) => data,
  )(result);
}

const CreateDeviceParamsValidator = t.type({
  name: t.string,
  zoneId: t.string,
  mountParameters: t.union([t.string, t.void]),
});
export type DeviceParams = t.TypeOf<typeof CreateDeviceParamsValidator>;

export function decodeDeviceParams(value: unknown): DeviceParams {
  return extractResult(CreateDeviceParamsValidator.decode(value));
}
