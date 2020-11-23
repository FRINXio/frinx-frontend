/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type PoolType = "allocating" | "set" | "singleton" | "%future added value";
export type CreatePoolPageQueryVariables = {||};
export type CreatePoolPageQueryResponse = {|
  +QueryRootResourcePools: $ReadOnlyArray<{|
    +id: string,
    +Name: string,
    +Resources: $ReadOnlyArray<{|
      +id: string,
      +Properties: any,
      +NestedPool: ?{|
        +id: string,
        +Name: string,
        +PoolType: PoolType,
        +Resources: $ReadOnlyArray<{|
          +id: string,
          +Properties: any,
          +NestedPool: ?{|
            +id: string,
            +Name: string,
            +PoolType: PoolType,
            +Resources: $ReadOnlyArray<{|
              +id: string,
              +Properties: any,
              +NestedPool: ?{|
                +id: string,
                +Name: string,
                +Resources: $ReadOnlyArray<{|
                  +id: string,
                  +Properties: any,
                  +NestedPool: ?{|
                    +id: string,
                    +Name: string,
                    +PoolType: PoolType,
                    +Resources: $ReadOnlyArray<{|
                      +id: string,
                      +Properties: any,
                      +NestedPool: ?{|
                        +id: string,
                        +Name: string,
                        +PoolType: PoolType,
                        +Resources: $ReadOnlyArray<{|
                          +id: string,
                          +Properties: any,
                          +NestedPool: ?{|
                            +id: string,
                            +Name: string,
                            +Resources: $ReadOnlyArray<{|
                              +id: string,
                              +Properties: any,
                              +NestedPool: ?{|
                                +id: string,
                                +Name: string,
                                +PoolType: PoolType,
                                +Resources: $ReadOnlyArray<{|
                                  +id: string,
                                  +Properties: any,
                                  +NestedPool: ?{|
                                    +id: string,
                                    +Name: string,
                                    +PoolType: PoolType,
                                    +Resources: $ReadOnlyArray<{|
                                      +id: string,
                                      +Properties: any,
                                    |}>,
                                  |},
                                |}>,
                              |},
                            |}>,
                          |},
                        |}>,
                      |},
                    |}>,
                  |},
                |}>,
              |},
            |}>,
          |},
        |}>,
      |},
    |}>,
  |}>
|};
export type CreatePoolPageQuery = {|
  variables: CreatePoolPageQueryVariables,
  response: CreatePoolPageQueryResponse,
|};
*/


/*
query CreatePoolPageQuery {
  QueryRootResourcePools {
    id
    Name
    Resources {
      id
      Properties
      NestedPool {
        id
        Name
        PoolType
        Resources {
          id
          Properties
          NestedPool {
            id
            Name
            PoolType
            Resources {
              id
              Properties
              NestedPool {
                id
                Name
                Resources {
                  id
                  Properties
                  NestedPool {
                    id
                    Name
                    PoolType
                    Resources {
                      id
                      Properties
                      NestedPool {
                        id
                        Name
                        PoolType
                        Resources {
                          id
                          Properties
                          NestedPool {
                            id
                            Name
                            Resources {
                              id
                              Properties
                              NestedPool {
                                id
                                Name
                                PoolType
                                Resources {
                                  id
                                  Properties
                                  NestedPool {
                                    id
                                    Name
                                    PoolType
                                    Resources {
                                      id
                                      Properties
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
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
  "name": "Properties",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "PoolType",
  "storageKey": null
},
v4 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "ResourcePool",
    "kind": "LinkedField",
    "name": "QueryRootResourcePools",
    "plural": true,
    "selections": [
      (v0/*: any*/),
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Resource",
        "kind": "LinkedField",
        "name": "Resources",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "ResourcePool",
            "kind": "LinkedField",
            "name": "NestedPool",
            "plural": false,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Resource",
                "kind": "LinkedField",
                "name": "Resources",
                "plural": true,
                "selections": [
                  (v0/*: any*/),
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ResourcePool",
                    "kind": "LinkedField",
                    "name": "NestedPool",
                    "plural": false,
                    "selections": [
                      (v0/*: any*/),
                      (v1/*: any*/),
                      (v3/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Resource",
                        "kind": "LinkedField",
                        "name": "Resources",
                        "plural": true,
                        "selections": [
                          (v0/*: any*/),
                          (v2/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "ResourcePool",
                            "kind": "LinkedField",
                            "name": "NestedPool",
                            "plural": false,
                            "selections": [
                              (v0/*: any*/),
                              (v1/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Resource",
                                "kind": "LinkedField",
                                "name": "Resources",
                                "plural": true,
                                "selections": [
                                  (v0/*: any*/),
                                  (v2/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "ResourcePool",
                                    "kind": "LinkedField",
                                    "name": "NestedPool",
                                    "plural": false,
                                    "selections": [
                                      (v0/*: any*/),
                                      (v1/*: any*/),
                                      (v3/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "Resource",
                                        "kind": "LinkedField",
                                        "name": "Resources",
                                        "plural": true,
                                        "selections": [
                                          (v0/*: any*/),
                                          (v2/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "ResourcePool",
                                            "kind": "LinkedField",
                                            "name": "NestedPool",
                                            "plural": false,
                                            "selections": [
                                              (v0/*: any*/),
                                              (v1/*: any*/),
                                              (v3/*: any*/),
                                              {
                                                "alias": null,
                                                "args": null,
                                                "concreteType": "Resource",
                                                "kind": "LinkedField",
                                                "name": "Resources",
                                                "plural": true,
                                                "selections": [
                                                  (v0/*: any*/),
                                                  (v2/*: any*/),
                                                  {
                                                    "alias": null,
                                                    "args": null,
                                                    "concreteType": "ResourcePool",
                                                    "kind": "LinkedField",
                                                    "name": "NestedPool",
                                                    "plural": false,
                                                    "selections": [
                                                      (v0/*: any*/),
                                                      (v1/*: any*/),
                                                      {
                                                        "alias": null,
                                                        "args": null,
                                                        "concreteType": "Resource",
                                                        "kind": "LinkedField",
                                                        "name": "Resources",
                                                        "plural": true,
                                                        "selections": [
                                                          (v0/*: any*/),
                                                          (v2/*: any*/),
                                                          {
                                                            "alias": null,
                                                            "args": null,
                                                            "concreteType": "ResourcePool",
                                                            "kind": "LinkedField",
                                                            "name": "NestedPool",
                                                            "plural": false,
                                                            "selections": [
                                                              (v0/*: any*/),
                                                              (v1/*: any*/),
                                                              (v3/*: any*/),
                                                              {
                                                                "alias": null,
                                                                "args": null,
                                                                "concreteType": "Resource",
                                                                "kind": "LinkedField",
                                                                "name": "Resources",
                                                                "plural": true,
                                                                "selections": [
                                                                  (v0/*: any*/),
                                                                  (v2/*: any*/),
                                                                  {
                                                                    "alias": null,
                                                                    "args": null,
                                                                    "concreteType": "ResourcePool",
                                                                    "kind": "LinkedField",
                                                                    "name": "NestedPool",
                                                                    "plural": false,
                                                                    "selections": [
                                                                      (v0/*: any*/),
                                                                      (v1/*: any*/),
                                                                      (v3/*: any*/),
                                                                      {
                                                                        "alias": null,
                                                                        "args": null,
                                                                        "concreteType": "Resource",
                                                                        "kind": "LinkedField",
                                                                        "name": "Resources",
                                                                        "plural": true,
                                                                        "selections": [
                                                                          (v0/*: any*/),
                                                                          (v2/*: any*/)
                                                                        ],
                                                                        "storageKey": null
                                                                      }
                                                                    ],
                                                                    "storageKey": null
                                                                  }
                                                                ],
                                                                "storageKey": null
                                                              }
                                                            ],
                                                            "storageKey": null
                                                          }
                                                        ],
                                                        "storageKey": null
                                                      }
                                                    ],
                                                    "storageKey": null
                                                  }
                                                ],
                                                "storageKey": null
                                              }
                                            ],
                                            "storageKey": null
                                          }
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "CreatePoolPageQuery",
    "selections": (v4/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "CreatePoolPageQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "f3c8d73a6a5a11bc4f10b99f1bf0fbb8",
    "id": null,
    "metadata": {},
    "name": "CreatePoolPageQuery",
    "operationKind": "query",
    "text": "query CreatePoolPageQuery {\n  QueryRootResourcePools {\n    id\n    Name\n    Resources {\n      id\n      Properties\n      NestedPool {\n        id\n        Name\n        PoolType\n        Resources {\n          id\n          Properties\n          NestedPool {\n            id\n            Name\n            PoolType\n            Resources {\n              id\n              Properties\n              NestedPool {\n                id\n                Name\n                Resources {\n                  id\n                  Properties\n                  NestedPool {\n                    id\n                    Name\n                    PoolType\n                    Resources {\n                      id\n                      Properties\n                      NestedPool {\n                        id\n                        Name\n                        PoolType\n                        Resources {\n                          id\n                          Properties\n                          NestedPool {\n                            id\n                            Name\n                            Resources {\n                              id\n                              Properties\n                              NestedPool {\n                                id\n                                Name\n                                PoolType\n                                Resources {\n                                  id\n                                  Properties\n                                  NestedPool {\n                                    id\n                                    Name\n                                    PoolType\n                                    Resources {\n                                      id\n                                      Properties\n                                    }\n                                  }\n                                }\n                              }\n                            }\n                          }\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'aa641d61acda241c673b47541e2c7684';

module.exports = node;
