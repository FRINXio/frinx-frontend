/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type AddResourceTypeMutationVariables = {|
  resourceName: string,
  resourceProperties: any,
|};
export type AddResourceTypeMutationResponse = {|
  +CreateResourceType: {|
    +ID: string,
    +Name: string,
  |}
|};
export type AddResourceTypeMutation = {|
  variables: AddResourceTypeMutationVariables,
  response: AddResourceTypeMutationResponse,
|};
*/


/*
mutation AddResourceTypeMutation(
  $resourceName: String!
  $resourceProperties: Map!
) {
  CreateResourceType(resourceName: $resourceName, resourceProperties: $resourceProperties) {
    ID
    Name
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "resourceName"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "resourceProperties"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "resourceName",
        "variableName": "resourceName"
      },
      {
        "kind": "Variable",
        "name": "resourceProperties",
        "variableName": "resourceProperties"
      }
    ],
    "concreteType": "ResourceType",
    "kind": "LinkedField",
    "name": "CreateResourceType",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "ID",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "Name",
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
    "name": "AddResourceTypeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddResourceTypeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2ae110c3e43c58ea27e6522c0585e94e",
    "id": null,
    "metadata": {},
    "name": "AddResourceTypeMutation",
    "operationKind": "mutation",
    "text": "mutation AddResourceTypeMutation(\n  $resourceName: String!\n  $resourceProperties: Map!\n) {\n  CreateResourceType(resourceName: $resourceName, resourceProperties: $resourceProperties) {\n    ID\n    Name\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '191808af5af92629d40740bd85c149dc';

module.exports = node;
