/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type ResourceTypesQueryVariables = {||};
export type ResourceTypesQueryResponse = {|
  +QueryResourceTypes: $ReadOnlyArray<{|
    +id: string,
    +Name: string,
    +PropertyTypes: $ReadOnlyArray<{|
      +Name: string,
      +Type: string,
    |}>,
    +Pools: $ReadOnlyArray<{|
      +id: string,
      +Name: string,
    |}>,
  |}>
|};
export type ResourceTypesQuery = {|
  variables: ResourceTypesQueryVariables,
  response: ResourceTypesQueryResponse,
|};
*/


/*
query ResourceTypesQuery {
  QueryResourceTypes {
    id
    Name
    PropertyTypes {
      Name
      Type
      id
    }
    Pools {
      id
      Name
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Type",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "ResourcePool",
  "kind": "LinkedField",
  "name": "Pools",
  "plural": true,
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/)
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ResourceTypesQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "ResourceType",
        "kind": "LinkedField",
        "name": "QueryResourceTypes",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "PropertyType",
            "kind": "LinkedField",
            "name": "PropertyTypes",
            "plural": true,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ResourceTypesQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "ResourceType",
        "kind": "LinkedField",
        "name": "QueryResourceTypes",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "PropertyType",
            "kind": "LinkedField",
            "name": "PropertyTypes",
            "plural": true,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              (v0/*: any*/)
            ],
            "storageKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "29cf87dd48679030a760074ec853faaf",
    "id": null,
    "metadata": {},
    "name": "ResourceTypesQuery",
    "operationKind": "query",
    "text": "query ResourceTypesQuery {\n  QueryResourceTypes {\n    id\n    Name\n    PropertyTypes {\n      Name\n      Type\n      id\n    }\n    Pools {\n      id\n      Name\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '8de498f0a4e99e909567cac15925ea4a';

module.exports = node;
