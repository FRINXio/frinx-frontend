/* eslint-disable @typescript-eslint/naming-convention */
import * as t from 'io-ts';
import { Either, fold } from 'fp-ts/lib/Either';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { DBExtendedDevice, DBExtendedZone } from './db/types';

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

const CreateZoneParamsValidator = t.type({
  name: t.string,
  tenantName: t.string,
});
export type ZoneParams = t.TypeOf<typeof CreateZoneParamsValidator>;

export function decodeZoneParams(value: unknown): ZoneParams {
  return extractResult(CreateZoneParamsValidator.decode(value));
}
