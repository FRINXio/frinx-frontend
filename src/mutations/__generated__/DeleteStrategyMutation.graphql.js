/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type DeleteAllocationStrategyInput = {|
  allocationStrategyId: string
|};
export type DeleteStrategyMutationVariables = {|
  input: DeleteAllocationStrategyInput
|};
export type DeleteStrategyMutationResponse = {|
  +DeleteAllocationStrategy: {|
    +strategy: ?{|
      +id: string
    |}
  |}
|};
export type DeleteStrategyMutation = {|
  variables: DeleteStrategyMutationVariables,
  response: DeleteStrategyMutationResponse,
|};
*/


/*
mutation DeleteStrategyMutation(
  $input: DeleteAllocationStrategyInput!
) {
  DeleteAllocationStrategy(input: $input) {
    strategy {
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
    "concreteType": "DeleteAllocationStrategyPayload",
    "kind": "LinkedField",
    "name": "DeleteAllocationStrategy",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "AllocationStrategy",
        "kind": "LinkedField",
        "name": "strategy",
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
    "name": "DeleteStrategyMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DeleteStrategyMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ff5d893581fae89e3c7e1bf7777b959d",
    "id": null,
    "metadata": {},
    "name": "DeleteStrategyMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteStrategyMutation(\n  $input: DeleteAllocationStrategyInput!\n) {\n  DeleteAllocationStrategy(input: $input) {\n    strategy {\n      id\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '51400653b080e8bfae921f31f5980189';

module.exports = node;
