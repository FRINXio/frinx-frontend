/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type FreeResourceMutationVariables = {|
  poolId: string,
  input: any,
|};
export type FreeResourceMutationResponse = {|
  +FreeResource: string
|};
export type FreeResourceMutation = {|
  variables: FreeResourceMutationVariables,
  response: FreeResourceMutationResponse,
|};
*/

/*
mutation FreeResourceMutation(
  $poolId: ID!
  $input: Map!
) {
  FreeResource(poolId: $poolId, input: $input)
}
*/

const node /*: ConcreteRequest*/ = (function () {
  var v0 = {
      defaultValue: null,
      kind: 'LocalArgument',
      name: 'input',
    },
    v1 = {
      defaultValue: null,
      kind: 'LocalArgument',
      name: 'poolId',
    },
    v2 = [
      {
        alias: null,
        args: [
          {
            kind: 'Variable',
            name: 'input',
            variableName: 'input',
          },
          {
            kind: 'Variable',
            name: 'poolId',
            variableName: 'poolId',
          },
        ],
        kind: 'ScalarField',
        name: 'FreeResource',
        storageKey: null,
      },
    ];
  return {
    fragment: {
      argumentDefinitions: [(v0 /*: any*/), (v1 /*: any*/)],
      kind: 'Fragment',
      metadata: null,
      name: 'FreeResourceMutation',
      selections: (v2 /*: any*/),
      type: 'Mutation',
      abstractKey: null,
    },
    kind: 'Request',
    operation: {
      argumentDefinitions: [(v1 /*: any*/), (v0 /*: any*/)],
      kind: 'Operation',
      name: 'FreeResourceMutation',
      selections: (v2 /*: any*/),
    },
    params: {
      cacheID: '6dd1c9ef837959a120a34310ba9cb70f',
      id: null,
      metadata: {},
      name: 'FreeResourceMutation',
      operationKind: 'mutation',
      text:
        'mutation FreeResourceMutation(\n  $poolId: ID!\n  $input: Map!\n) {\n  FreeResource(poolId: $poolId, input: $input)\n}\n',
    },
  };
})();
// prettier-ignore
(node/*: any*/).hash = 'f3583b4355f65189ab8268b438cf8b8a';

module.exports = node;
