/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type ResourcePoolInput = {|
  poolProperties: any,
  ResourcePoolName: string,
|};
export type ResourceInput = {|
  Properties: any,
  UpdatedAt: string,
  Status: string,
|};
export type TestAllocationStrategyMutationVariables = {|
  allocationStrategyId: string,
  resourcePool: ResourcePoolInput,
  currentResources: $ReadOnlyArray<ResourceInput>,
  userInput: any,
|};
export type TestAllocationStrategyMutationResponse = {|
  +TestAllocationStrategy: any
|};
export type TestAllocationStrategyMutation = {|
  variables: TestAllocationStrategyMutationVariables,
  response: TestAllocationStrategyMutationResponse,
|};
*/


/*
mutation TestAllocationStrategyMutation(
  $allocationStrategyId: ID!
  $resourcePool: ResourcePoolInput!
  $currentResources: [ResourceInput!]!
  $userInput: Map!
) {
  TestAllocationStrategy(allocationStrategyId: $allocationStrategyId, resourcePool: $resourcePool, currentResources: $currentResources, userInput: $userInput)
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "allocationStrategyId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "currentResources"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "resourcePool"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "userInput"
},
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "allocationStrategyId",
        "variableName": "allocationStrategyId"
      },
      {
        "kind": "Variable",
        "name": "currentResources",
        "variableName": "currentResources"
      },
      {
        "kind": "Variable",
        "name": "resourcePool",
        "variableName": "resourcePool"
      },
      {
        "kind": "Variable",
        "name": "userInput",
        "variableName": "userInput"
      }
    ],
    "kind": "ScalarField",
    "name": "TestAllocationStrategy",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "TestAllocationStrategyMutation",
    "selections": (v4/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Operation",
    "name": "TestAllocationStrategyMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "9dad6590c2c2a4d344fb0846eea12871",
    "id": null,
    "metadata": {},
    "name": "TestAllocationStrategyMutation",
    "operationKind": "mutation",
    "text": "mutation TestAllocationStrategyMutation(\n  $allocationStrategyId: ID!\n  $resourcePool: ResourcePoolInput!\n  $currentResources: [ResourceInput!]!\n  $userInput: Map!\n) {\n  TestAllocationStrategy(allocationStrategyId: $allocationStrategyId, resourcePool: $resourcePool, currentResources: $currentResources, userInput: $userInput)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '55cf2c70acc3f01cccbb25dc5b972c75';

module.exports = node;
