/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type CreateResourceTypeInput = {|
  resourceName: string,
  resourceProperties: any,
|};
export type AddResourceTypeMutationVariables = {|
  input: CreateResourceTypeInput
|};
export type AddResourceTypeMutationResponse = {|
  +CreateResourceType: {|
    +resourceType: {|
      +Name: string
    |}
  |}
|};
export type AddResourceTypeMutation = {|
  variables: AddResourceTypeMutationVariables,
  response: AddResourceTypeMutationResponse,
|};
*/


/*
mutation AddResourceTypeMutation(
  $input: CreateResourceTypeInput!
) {
  CreateResourceType(input: $input) {
    resourceType {
      Name
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
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AddResourceTypeMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateResourceTypePayload",
        "kind": "LinkedField",
        "name": "CreateResourceType",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ResourceType",
            "kind": "LinkedField",
            "name": "resourceType",
            "plural": false,
            "selections": [
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddResourceTypeMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateResourceTypePayload",
        "kind": "LinkedField",
        "name": "CreateResourceType",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ResourceType",
            "kind": "LinkedField",
            "name": "resourceType",
            "plural": false,
            "selections": [
              (v2/*: any*/),
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
    ]
  },
  "params": {
    "cacheID": "5b526462599b68293e0e7f0b929fc580",
    "id": null,
    "metadata": {},
    "name": "AddResourceTypeMutation",
    "operationKind": "mutation",
    "text": "mutation AddResourceTypeMutation(\n  $input: CreateResourceTypeInput!\n) {\n  CreateResourceType(input: $input) {\n    resourceType {\n      Name\n      id\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '804582c7393e41b6bb1d555e47dc45cc';

module.exports = node;
