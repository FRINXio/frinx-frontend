/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type CreateAllocatingPoolInput = {|
  resourceTypeId: string,
  poolName: string,
  description?: ?string,
  allocationStrategyId: string,
  poolDealocationSafetyPeriod: number,
  poolProperties: any,
  poolPropertyTypes: any,
|};
export type CreateAllocationPoolMutationVariables = {|
  input: CreateAllocatingPoolInput
|};
export type CreateAllocationPoolMutationResponse = {|
  +CreateAllocatingPool: {|
    +pool: ?{|
      +id: string
    |}
  |}
|};
export type CreateAllocationPoolMutation = {|
  variables: CreateAllocationPoolMutationVariables,
  response: CreateAllocationPoolMutationResponse,
|};
*/


/*
mutation CreateAllocationPoolMutation(
  $input: CreateAllocatingPoolInput!
) {
  CreateAllocatingPool(input: $input) {
    pool {
      id
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "CreateAllocatingPoolPayload",
    "kind": "LinkedField",
    "name": "CreateAllocatingPool",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "ResourcePool",
        "kind": "LinkedField",
        "name": "pool",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateAllocationPoolMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CreateAllocationPoolMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f8cf04f2189c646c4ecd502e769f8a45",
    "id": null,
    "metadata": {},
    "name": "CreateAllocationPoolMutation",
    "operationKind": "mutation",
    "text": "mutation CreateAllocationPoolMutation(\n  $input: CreateAllocatingPoolInput!\n) {\n  CreateAllocatingPool(input: $input) {\n    pool {\n      id\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'ff26b129b8bb8969ad8a046fb4c1be33';

module.exports = node;
