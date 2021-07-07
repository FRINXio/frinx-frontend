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

export const DeviceOutputValidator = t.type({
  id: t.string,
  name: t.string,
  vendor: t.union([t.string, t.null]),
  model: t.union([t.string, t.null]),
  host: t.union([t.string, t.null]),
  zone: t.type({
    id: t.string,
    name: t.string,
    tenant: t.string,
  }),
  status: t.union([t.literal('N/A'), t.literal('INSTALLED')]),
});
export const DevicesOutputValidator = t.array(DeviceOutputValidator);
export type DeviceOutput = t.TypeOf<typeof DeviceOutputValidator>;
export type DevicesOutput = t.TypeOf<typeof DevicesOutputValidator>;

export function decodeDeviceOutput(data: unknown): DevicesOutput {
  return extractResult(DevicesOutputValidator.decode(data));
}
