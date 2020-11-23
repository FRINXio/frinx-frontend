/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type CreateNestedSetPoolInput = {|
  resourceTypeId: string,
  poolName: string,
  description?: ?string,
  poolDealocationSafetyPeriod: number,
  poolValues: $ReadOnlyArray<?any>,
  parentResourceId: string,
  tags?: ?$ReadOnlyArray<string>,
|};
export type CreateNestedPoolMutationVariables = {|
  input: CreateNestedSetPoolInput
|};
export type CreateNestedPoolMutationResponse = {|
  +CreateNestedSetPool: {|
    +pool: ?{|
      +id: string
    |}
  |}
|};
export type CreateNestedPoolMutation = {|
  variables: CreateNestedPoolMutationVariables,
  response: CreateNestedPoolMutationResponse,
|};
*/


/*
mutation CreateNestedPoolMutation(
  $input: CreateNestedSetPoolInput!
) {
  CreateNestedSetPool(input: $input) {
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
    "concreteType": "CreateNestedSetPoolPayload",
    "kind": "LinkedField",
    "name": "CreateNestedSetPool",
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
    "name": "CreateNestedPoolMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CreateNestedPoolMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "044887633badd41c705cb7b83359838f",
    "id": null,
    "metadata": {},
    "name": "CreateNestedPoolMutation",
    "operationKind": "mutation",
    "text": "mutation CreateNestedPoolMutation(\n  $input: CreateNestedSetPoolInput!\n) {\n  CreateNestedSetPool(input: $input) {\n    pool {\n      id\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '0ff7b02f208bd588cfdac0205fc44eea';

module.exports = node;
