/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type ResourcesListQueryVariables = {|
  poolId: string
|};
export type ResourcesListQueryResponse = {|
  +QueryResources: $ReadOnlyArray<{|
    +id: string,
    +Properties: any,
    +NestedPool: ?{|
      +id: string,
      +Name: string,
    |},
  |}>
|};
export type ResourcesListQuery = {|
  variables: ResourcesListQueryVariables,
  response: ResourcesListQueryResponse,
|};
*/


/*
query ResourcesListQuery(
  $poolId: ID!
) {
  QueryResources(poolId: $poolId) {
    id
    Properties
    NestedPool {
      id
      Name
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "poolId"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "poolId",
        "variableName": "poolId"
      }
    ],
    "concreteType": "Resource",
    "kind": "LinkedField",
    "name": "QueryResources",
    "plural": true,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "Properties",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "ResourcePool",
        "kind": "LinkedField",
        "name": "NestedPool",
        "plural": false,
        "selections": [
          (v1/*: any*/),
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
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ResourcesListQuery",
    "selections": (v2/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ResourcesListQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "d48ab6b91eb30cfb641a1d04128385c3",
    "id": null,
    "metadata": {},
    "name": "ResourcesListQuery",
    "operationKind": "query",
    "text": "query ResourcesListQuery(\n  $poolId: ID!\n) {\n  QueryResources(poolId: $poolId) {\n    id\n    Properties\n    NestedPool {\n      id\n      Name\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '33a84118dc035f0df856d0c6a034e70a';

module.exports = node;
