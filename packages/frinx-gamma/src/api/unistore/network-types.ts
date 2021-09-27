import { Either, fold } from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';

function optional<T, U>(type: t.Type<T, U>) {
  return t.union([type, t.void]);
}

export function extractResult<A>(result: Either<t.Errors, A>): A {
  return fold(
    () => {
      const errorMessages = PathReporter.report(result);
      throw new Error(`BAD_REQUEST: ${errorMessages.join(',')}`);
    },
    (data: A) => data,
  )(result);
}

const VpnServicesOutputValidator = t.type({
  'vpn-services': t.type({
    'vpn-service': t.array(
      t.type({
        'vpn-id': t.string,
        'customer-name': t.string,
        'extranet-vpns': t.type({
          'extranet-vpn': optional(
            t.array(
              t.type({
                'vpn-id': t.string,
                'local-sites-role': t.string,
              }),
            ),
          ),
        }),
        'vpn-service-topology': t.string,
      }),
    ),
  }),
});
export type VpnServicesOutput = t.TypeOf<typeof VpnServicesOutputValidator>;

export function decodeVpnServicesOutput(value: unknown): VpnServicesOutput {
  return extractResult(VpnServicesOutputValidator.decode(value));
}

const VpnSitesOutputValidator = t.type({
  'vpn-site': t.array(t.string),
});

export type VpnSitesOutput = t.TypeOf<typeof VpnSitesOutputValidator>;

export function decodeVpnSiteOutput(value: unknown): VpnSitesOutput {
  return extractResult(VpnSitesOutputValidator.decode(value));
}
