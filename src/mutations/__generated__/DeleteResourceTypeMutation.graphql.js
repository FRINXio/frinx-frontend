/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type DeleteResourceTypeMutationVariables = {|
  resourceTypeId: string
|};
export type DeleteResourceTypeMutationResponse = {|
  +DeleteResourceType: string
|};
export type DeleteResourceTypeMutation = {|
  variables: DeleteResourceTypeMutationVariables,
  response: DeleteResourceTypeMutationResponse,
|};
*/


/*
mutation DeleteResourceTypeMutation(
  $resourceTypeId: ID!
) {
  DeleteResourceType(resourceTypeId: $resourceTypeId)
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "resourceTypeId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "resourceTypeId",
        "variableName": "resourceTypeId"
      }
    ],
    "kind": "ScalarField",
    "name": "DeleteResourceType",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "DeleteResourceTypeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DeleteResourceTypeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2d5c91b1e6a2c5a7f736918b10dd212b",
    "id": null,
    "metadata": {},
    "name": "DeleteResourceTypeMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteResourceTypeMutation(\n  $resourceTypeId: ID!\n) {\n  DeleteResourceType(resourceTypeId: $resourceTypeId)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'cb5cfa607cf9302a91486148967827f5';

module.exports = node;
