/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type DeleteResourcePoolInput = {|
  resourcePoolId: string
|};
export type DeletePoolMutationVariables = {|
  input: DeleteResourcePoolInput
|};
export type DeletePoolMutationResponse = {|
  +DeleteResourcePool: {|
    +resourcePoolId: string
  |}
|};
export type DeletePoolMutation = {|
  variables: DeletePoolMutationVariables,
  response: DeletePoolMutationResponse,
|};
*/

/*
mutation DeletePoolMutation(
  $input: DeleteResourcePoolInput!
) {
  DeleteResourcePool(input: $input) {
    resourcePoolId
  }
}
*/

const node /*: ConcreteRequest*/ = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: 'LocalArgument',
        name: 'input',
      },
    ],
    v1 = [
      {
        alias: null,
        args: [
          {
            kind: 'Variable',
            name: 'input',
            variableName: 'input',
          },
        ],
        concreteType: 'DeleteResourcePoolPayload',
        kind: 'LinkedField',
        name: 'DeleteResourcePool',
        plural: false,
        selections: [
          {
            alias: null,
            args: null,
            kind: 'ScalarField',
            name: 'resourcePoolId',
            storageKey: null,
          },
        ],
        storageKey: null,
      },
    ];
  return {
    fragment: {
      argumentDefinitions: (v0 /*: any*/),
      kind: 'Fragment',
      metadata: null,
      name: 'DeletePoolMutation',
      selections: (v1 /*: any*/),
      type: 'Mutation',
      abstractKey: null,
    },
    kind: 'Request',
    operation: {
      argumentDefinitions: (v0 /*: any*/),
      kind: 'Operation',
      name: 'DeletePoolMutation',
      selections: (v1 /*: any*/),
    },
    params: {
      cacheID: '6c0f80bb730d49ac766afed1b0796daf',
      id: null,
      metadata: {},
      name: 'DeletePoolMutation',
      operationKind: 'mutation',
      text:
        'mutation DeletePoolMutation(\n  $input: DeleteResourcePoolInput!\n) {\n  DeleteResourcePool(input: $input) {\n    resourcePoolId\n  }\n}\n',
    },
  };
})();
// prettier-ignore
(node/*: any*/).hash = 'b53e19e92b16b3cbab426a388677f149';

module.exports = node;
