/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type ClaimResourceMutationVariables = {|
  poolId: string,
  description?: ?string,
  userInput: any,
|};
export type ClaimResourceMutationResponse = {|
  +ClaimResource: {|
    +id: string
  |}
|};
export type ClaimResourceMutation = {|
  variables: ClaimResourceMutationVariables,
  response: ClaimResourceMutationResponse,
|};
*/


/*
mutation ClaimResourceMutation(
  $poolId: ID!
  $description: String
  $userInput: Map!
) {
  ClaimResource(poolId: $poolId, description: $description, userInput: $userInput) {
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "description"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "poolId"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "userInput"
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "description",
        "variableName": "description"
      },
      {
        "kind": "Variable",
        "name": "poolId",
        "variableName": "poolId"
      },
      {
        "kind": "Variable",
        "name": "userInput",
        "variableName": "userInput"
      }
    ],
    "concreteType": "Resource",
    "kind": "LinkedField",
    "name": "ClaimResource",
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
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ClaimResourceMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "ClaimResourceMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "e8a695e614a854688c4a36f2436d5dcf",
    "id": null,
    "metadata": {},
    "name": "ClaimResourceMutation",
    "operationKind": "mutation",
    "text": "mutation ClaimResourceMutation(\n  $poolId: ID!\n  $description: String\n  $userInput: Map!\n) {\n  ClaimResource(poolId: $poolId, description: $description, userInput: $userInput) {\n    id\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '5f95f1c14cd2fcb2d07b4d670bace3f9';

module.exports = node;
