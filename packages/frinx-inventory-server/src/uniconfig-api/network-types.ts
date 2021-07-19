import * as t from 'io-ts';
import { Either, fold } from 'fp-ts/lib/Either';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { HttpStatusCode } from '../errors/base-error';
import APIError from '../errors/api-error';

function optional<T, U>(type: t.Type<T, U>) {
  return t.union([type, t.void]);
}

export function extractResult<A>(result: Either<t.Errors, A>): A {
  return fold(
    () => {
      const errorMessages = PathReporter.report(result);
      throw new APIError('BAD_REQUEST', HttpStatusCode.INTERNAL_SERVER, true, errorMessages.join(''));
    },
    (data: A) => data,
  )(result);
}

const InstalledDevicesOutputValidator = t.type({
  output: t.type({
    nodes: optional(t.array(t.string)),
  }),
});
export type InstalledDevicesOutput = t.TypeOf<typeof InstalledDevicesOutputValidator>;

export function decodeInstalledDevicesOutput(value: unknown): InstalledDevicesOutput {
  return extractResult(InstalledDevicesOutputValidator.decode(value));
}

export type UninstallDeviceInput = {
  input: {
    'node-id': string;
    'connection-type': 'netconf' | 'cli';
  };
};
