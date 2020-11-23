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
    +Description: ?string,
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
    Description
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
        "name": "Description",
        "storageKey": null
      },
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
    "cacheID": "43c8270c3f53186f188199c951f40b9f",
    "id": null,
    "metadata": {},
    "name": "ResourcesListQuery",
    "operationKind": "query",
    "text": "query ResourcesListQuery(\n  $poolId: ID!\n) {\n  QueryResources(poolId: $poolId) {\n    id\n    Description\n    Properties\n    NestedPool {\n      id\n      Name\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '8d8f6c351229adde8472c8b1352d11a6';

module.exports = node;
