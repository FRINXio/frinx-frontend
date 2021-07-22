import * as t from 'io-ts';
import { Either, fold } from 'fp-ts/lib/Either';
import { PathReporter } from 'io-ts/lib/PathReporter';

export default function extractResult<A>(result: Either<t.Errors, A>): A {
  return fold(
    () => {
      const errorMessages = PathReporter.report(result);
      throw new Error(errorMessages.join('. '));
    },
    (data: A) => data,
  )(result);
}

export const ZoneOutputValidator = t.type({
  id: t.string,
  name: t.string,
});
export const ZonesOutputValidator = t.array(ZoneOutputValidator);
export type Zone = t.TypeOf<typeof ZoneOutputValidator>;

export function decodeZonesOutput(data: unknown): Zone[] {
  return extractResult(ZonesOutputValidator.decode(data));
}

export const DeviceOutputValidator = t.type({
  id: t.string,
  name: t.string,
  vendor: t.union([t.string, t.null]),
  model: t.union([t.string, t.null]),
  host: t.union([t.string, t.null]),
  zone: ZoneOutputValidator,
  status: t.union([t.literal('N/A'), t.literal('INSTALLED')]),
});
export const DevicesOutputValidator = t.array(DeviceOutputValidator);
export type Device = t.TypeOf<typeof DeviceOutputValidator>;

export function decodeDeviceOutput(data: unknown): Device[] {
  return extractResult(DevicesOutputValidator.decode(data));
}
