/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type DeleteResourceTypeInput = {|
  resourceTypeId: string
|};
export type DeleteResourceTypeMutationVariables = {|
  input: DeleteResourceTypeInput
|};
export type DeleteResourceTypeMutationResponse = {|
  +DeleteResourceType: {|
    +resourceTypeId: string
  |}
|};
export type DeleteResourceTypeMutation = {|
  variables: DeleteResourceTypeMutationVariables,
  response: DeleteResourceTypeMutationResponse,
|};
*/

/*
mutation DeleteResourceTypeMutation(
  $input: DeleteResourceTypeInput!
) {
  DeleteResourceType(input: $input) {
    resourceTypeId
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
        concreteType: 'DeleteResourceTypePayload',
        kind: 'LinkedField',
        name: 'DeleteResourceType',
        plural: false,
        selections: [
          {
            alias: null,
            args: null,
            kind: 'ScalarField',
            name: 'resourceTypeId',
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
      name: 'DeleteResourceTypeMutation',
      selections: (v1 /*: any*/),
      type: 'Mutation',
      abstractKey: null,
    },
    kind: 'Request',
    operation: {
      argumentDefinitions: (v0 /*: any*/),
      kind: 'Operation',
      name: 'DeleteResourceTypeMutation',
      selections: (v1 /*: any*/),
    },
    params: {
      cacheID: 'b84f003b6892dfeffbf8ed8fd573abd9',
      id: null,
      metadata: {},
      name: 'DeleteResourceTypeMutation',
      operationKind: 'mutation',
      text:
        'mutation DeleteResourceTypeMutation(\n  $input: DeleteResourceTypeInput!\n) {\n  DeleteResourceType(input: $input) {\n    resourceTypeId\n  }\n}\n',
    },
  };
})();
// prettier-ignore
(node/*: any*/).hash = 'e1df93ed439bdbeb75ac2b661165e335';

module.exports = node;
