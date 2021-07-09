/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Response } from 'express';
import * as t from 'io-ts';
import { Either, fold } from 'fp-ts/lib/Either';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { DBExtendedDevice, DBExtendedZone } from '../db/types';
import APIError from '../errors/api-error';
import { HttpStatusCode } from '../errors/base-error';

// normally expressjs handles errors thrown in the url-handler.
// but, when it happens during async code, it does not catch it.
// we have to wrap all those into a `.catch()` code,
// but that is annoying, so we created this handler,
// that auto-wraps the code.
export function asyncHandler(
  handler: (req: Request, res: Response) => Promise<void>,
): (req: Request, res: Response, next: (e: Error) => void) => void {
  return (req: Request, res: Response, next: (e: Error) => void) => {
    handler(req, res).catch((e: Error | APIError) => {
      if (e instanceof APIError) {
        return next(e);
      }
      return next(new APIError(e.name, HttpStatusCode.INTERNAL_SERVER, true, e.message));
    });
  };
}

export type ApiZone = {
  id: string;
  name: string;
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
    },
    status: 'N/A',
  };
}

export function convertDBExtendedZone(zone: DBExtendedZone): ApiZone {
  return {
    id: zone.id.toString(),
    name: zone.name,
  };
}

export function extractResult<A>(result: Either<t.Errors, A>): A {
  return fold(
    () => {
      const errorMessages = PathReporter.report(result);
      throw new APIError('BAD_REQUEST', HttpStatusCode.BAD_REQUEST, true, errorMessages.join(''));
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
});
export type ZoneParams = t.TypeOf<typeof CreateZoneParamsValidator>;

export function decodeZoneParams(value: unknown): ZoneParams {
  return extractResult(CreateZoneParamsValidator.decode(value));
}
