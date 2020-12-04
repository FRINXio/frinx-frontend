/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type AllocationStrategyLang = "js" | "py" | "%future added value";
export type PoolType = "allocating" | "set" | "singleton" | "%future added value";
export type PoolDetailPageQueryVariables = {|
  poolId: string
|};
export type PoolDetailPageQueryResponse = {|
  +QueryResourcePool: {|
    +Name: string,
    +PoolType: PoolType,
    +ResourceType: {|
      +id: string,
      +Name: string,
    |},
    +AllocationStrategy: ?{|
      +Script: string,
      +Description: ?string,
      +Lang: AllocationStrategyLang,
      +id: string,
    |},
    +Tags: $ReadOnlyArray<{|
      +id: string,
      +Tag: string,
    |}>,
  |},
  +QueryResources: $ReadOnlyArray<{|
    +id: string,
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
    |},
  |}>,
  +QueryPoolCapacity: {|
    +freeCapacity: number,
    +utilizedCapacity: number,
  |},
  +QueryResourcePoolHierarchyPath: $ReadOnlyArray<{|
    +id: string,
    +Name: string,
  |}>,
  +QueryResourcePools: $ReadOnlyArray<{|
    +id: string,
    +Name: string,
    +allocatedResources: ?{|
      +pageInfo: {|
        +hasNextPage: boolean,
        +hasPreviousPage: boolean,
        +endCursor: {|
          +ID: string
        |},
        +startCursor: {|
          +ID: string
        |},
      |},
      +totalCount: number,
    |},
  |}>,
|};
export type PoolDetailPageQuery = {|
  variables: PoolDetailPageQueryVariables,
  response: PoolDetailPageQueryResponse,
|};
*/

/*
query PoolDetailPageQuery(
  $poolId: ID!
) {
  QueryResourcePool(poolId: $poolId) {
    Name
    PoolType
    ResourceType {
      id
      Name
    }
    AllocationStrategy {
      Script
      Description
      Lang
      id
    }
    Tags {
      id
      Tag
    }
    id
  }
  QueryResources(poolId: $poolId) {
    id
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
  QueryPoolCapacity(poolId: $poolId) {
    freeCapacity
    utilizedCapacity
  }
  QueryResourcePoolHierarchyPath(poolId: $poolId) {
    id
    Name
  }
  QueryResourcePools {
    id
    Name
    allocatedResources {
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor {
          ID
        }
        startCursor {
          ID
        }
      }
      totalCount
    }
  }
}
*/

const node /*: ConcreteRequest*/ = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: 'LocalArgument',
        name: 'poolId',
      },
    ],
    v1 = [
      {
        kind: 'Variable',
        name: 'poolId',
        variableName: 'poolId',
      },
    ],
    v2 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'Name',
      storageKey: null,
    },
    v3 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'PoolType',
      storageKey: null,
    },
    v4 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'id',
      storageKey: null,
    },
    v5 = [(v4 /*: any*/), (v2 /*: any*/)],
    v6 = {
      alias: null,
      args: null,
      concreteType: 'ResourceType',
      kind: 'LinkedField',
      name: 'ResourceType',
      plural: false,
      selections: (v5 /*: any*/),
      storageKey: null,
    },
    v7 = {
      alias: null,
      args: null,
      concreteType: 'AllocationStrategy',
      kind: 'LinkedField',
      name: 'AllocationStrategy',
      plural: false,
      selections: [
        {
          alias: null,
          args: null,
          kind: 'ScalarField',
          name: 'Script',
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          kind: 'ScalarField',
          name: 'Description',
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          kind: 'ScalarField',
          name: 'Lang',
          storageKey: null,
        },
        (v4 /*: any*/),
      ],
      storageKey: null,
    },
    v8 = {
      alias: null,
      args: null,
      concreteType: 'Tag',
      kind: 'LinkedField',
      name: 'Tags',
      plural: true,
      selections: [
        (v4 /*: any*/),
        {
          alias: null,
          args: null,
          kind: 'ScalarField',
          name: 'Tag',
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    v9 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'Properties',
      storageKey: null,
    },
    v10 = {
      alias: null,
      args: (v1 /*: any*/),
      concreteType: 'Resource',
      kind: 'LinkedField',
      name: 'QueryResources',
      plural: true,
      selections: [
        (v4 /*: any*/),
        {
          alias: null,
          args: null,
          concreteType: 'ResourcePool',
          kind: 'LinkedField',
          name: 'NestedPool',
          plural: false,
          selections: [
            (v4 /*: any*/),
            (v2 /*: any*/),
            {
              alias: null,
              args: null,
              concreteType: 'Resource',
              kind: 'LinkedField',
              name: 'Resources',
              plural: true,
              selections: [
                (v4 /*: any*/),
                (v9 /*: any*/),
                {
                  alias: null,
                  args: null,
                  concreteType: 'ResourcePool',
                  kind: 'LinkedField',
                  name: 'NestedPool',
                  plural: false,
                  selections: [
                    (v4 /*: any*/),
                    (v2 /*: any*/),
                    (v3 /*: any*/),
                    {
                      alias: null,
                      args: null,
                      concreteType: 'Resource',
                      kind: 'LinkedField',
                      name: 'Resources',
                      plural: true,
                      selections: [
                        (v4 /*: any*/),
                        (v9 /*: any*/),
                        {
                          alias: null,
                          args: null,
                          concreteType: 'ResourcePool',
                          kind: 'LinkedField',
                          name: 'NestedPool',
                          plural: false,
                          selections: [
                            (v4 /*: any*/),
                            (v2 /*: any*/),
                            (v3 /*: any*/),
                            {
                              alias: null,
                              args: null,
                              concreteType: 'Resource',
                              kind: 'LinkedField',
                              name: 'Resources',
                              plural: true,
                              selections: [
                                (v4 /*: any*/),
                                (v9 /*: any*/),
                                {
                                  alias: null,
                                  args: null,
                                  concreteType: 'ResourcePool',
                                  kind: 'LinkedField',
                                  name: 'NestedPool',
                                  plural: false,
                                  selections: [
                                    (v4 /*: any*/),
                                    (v2 /*: any*/),
                                    {
                                      alias: null,
                                      args: null,
                                      concreteType: 'Resource',
                                      kind: 'LinkedField',
                                      name: 'Resources',
                                      plural: true,
                                      selections: [
                                        (v4 /*: any*/),
                                        (v9 /*: any*/),
                                        {
                                          alias: null,
                                          args: null,
                                          concreteType: 'ResourcePool',
                                          kind: 'LinkedField',
                                          name: 'NestedPool',
                                          plural: false,
                                          selections: [
                                            (v4 /*: any*/),
                                            (v2 /*: any*/),
                                            (v3 /*: any*/),
                                            {
                                              alias: null,
                                              args: null,
                                              concreteType: 'Resource',
                                              kind: 'LinkedField',
                                              name: 'Resources',
                                              plural: true,
                                              selections: [
                                                (v4 /*: any*/),
                                                (v9 /*: any*/),
                                                {
                                                  alias: null,
                                                  args: null,
                                                  concreteType: 'ResourcePool',
                                                  kind: 'LinkedField',
                                                  name: 'NestedPool',
                                                  plural: false,
                                                  selections: [
                                                    (v4 /*: any*/),
                                                    (v2 /*: any*/),
                                                    (v3 /*: any*/),
                                                    {
                                                      alias: null,
                                                      args: null,
                                                      concreteType: 'Resource',
                                                      kind: 'LinkedField',
                                                      name: 'Resources',
                                                      plural: true,
                                                      selections: [
                                                        (v4 /*: any*/),
                                                        (v9 /*: any*/),
                                                        {
                                                          alias: null,
                                                          args: null,
                                                          concreteType: 'ResourcePool',
                                                          kind: 'LinkedField',
                                                          name: 'NestedPool',
                                                          plural: false,
                                                          selections: [
                                                            (v4 /*: any*/),
                                                            (v2 /*: any*/),
                                                            {
                                                              alias: null,
                                                              args: null,
                                                              concreteType: 'Resource',
                                                              kind: 'LinkedField',
                                                              name: 'Resources',
                                                              plural: true,
                                                              selections: [
                                                                (v4 /*: any*/),
                                                                (v9 /*: any*/),
                                                                {
                                                                  alias: null,
                                                                  args: null,
                                                                  concreteType: 'ResourcePool',
                                                                  kind: 'LinkedField',
                                                                  name: 'NestedPool',
                                                                  plural: false,
                                                                  selections: [
                                                                    (v4 /*: any*/),
                                                                    (v2 /*: any*/),
                                                                    (v3 /*: any*/),
                                                                    {
                                                                      alias: null,
                                                                      args: null,
                                                                      concreteType: 'Resource',
                                                                      kind: 'LinkedField',
                                                                      name: 'Resources',
                                                                      plural: true,
                                                                      selections: [
                                                                        (v4 /*: any*/),
                                                                        (v9 /*: any*/),
                                                                        {
                                                                          alias: null,
                                                                          args: null,
                                                                          concreteType: 'ResourcePool',
                                                                          kind: 'LinkedField',
                                                                          name: 'NestedPool',
                                                                          plural: false,
                                                                          selections: [
                                                                            (v4 /*: any*/),
                                                                            (v2 /*: any*/),
                                                                            (v3 /*: any*/),
                                                                            {
                                                                              alias: null,
                                                                              args: null,
                                                                              concreteType: 'Resource',
                                                                              kind: 'LinkedField',
                                                                              name: 'Resources',
                                                                              plural: true,
                                                                              selections: [
                                                                                (v4 /*: any*/),
                                                                                (v9 /*: any*/),
                                                                              ],
                                                                              storageKey: null,
                                                                            },
                                                                          ],
                                                                          storageKey: null,
                                                                        },
                                                                      ],
                                                                      storageKey: null,
                                                                    },
                                                                  ],
                                                                  storageKey: null,
                                                                },
                                                              ],
                                                              storageKey: null,
                                                            },
                                                          ],
                                                          storageKey: null,
                                                        },
                                                      ],
                                                      storageKey: null,
                                                    },
                                                  ],
                                                  storageKey: null,
                                                },
                                              ],
                                              storageKey: null,
                                            },
                                          ],
                                          storageKey: null,
                                        },
                                      ],
                                      storageKey: null,
                                    },
                                  ],
                                  storageKey: null,
                                },
                              ],
                              storageKey: null,
                            },
                          ],
                          storageKey: null,
                        },
                      ],
                      storageKey: null,
                    },
                  ],
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    v11 = {
      alias: null,
      args: (v1 /*: any*/),
      concreteType: 'PoolCapacityPayload',
      kind: 'LinkedField',
      name: 'QueryPoolCapacity',
      plural: false,
      selections: [
        {
          alias: null,
          args: null,
          kind: 'ScalarField',
          name: 'freeCapacity',
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          kind: 'ScalarField',
          name: 'utilizedCapacity',
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    v12 = {
      alias: null,
      args: (v1 /*: any*/),
      concreteType: 'ResourcePool',
      kind: 'LinkedField',
      name: 'QueryResourcePoolHierarchyPath',
      plural: true,
      selections: (v5 /*: any*/),
      storageKey: null,
    },
    v13 = [
      {
        alias: null,
        args: null,
        kind: 'ScalarField',
        name: 'ID',
        storageKey: null,
      },
    ],
    v14 = {
      alias: null,
      args: null,
      concreteType: 'ResourcePool',
      kind: 'LinkedField',
      name: 'QueryResourcePools',
      plural: true,
      selections: [
        (v4 /*: any*/),
        (v2 /*: any*/),
        {
          alias: null,
          args: null,
          concreteType: 'ResourceConnection',
          kind: 'LinkedField',
          name: 'allocatedResources',
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: 'PageInfo',
              kind: 'LinkedField',
              name: 'pageInfo',
              plural: false,
              selections: [
                {
                  alias: null,
                  args: null,
                  kind: 'ScalarField',
                  name: 'hasNextPage',
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  kind: 'ScalarField',
                  name: 'hasPreviousPage',
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  concreteType: 'OutputCursor',
                  kind: 'LinkedField',
                  name: 'endCursor',
                  plural: false,
                  selections: (v13 /*: any*/),
                  storageKey: null,
                },
                {
                  alias: null,
                  args: null,
                  concreteType: 'OutputCursor',
                  kind: 'LinkedField',
                  name: 'startCursor',
                  plural: false,
                  selections: (v13 /*: any*/),
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
            {
              alias: null,
              args: null,
              kind: 'ScalarField',
              name: 'totalCount',
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
      storageKey: null,
    };
  return {
    fragment: {
      argumentDefinitions: (v0 /*: any*/),
      kind: 'Fragment',
      metadata: null,
      name: 'PoolDetailPageQuery',
      selections: [
        {
          alias: null,
          args: (v1 /*: any*/),
          concreteType: 'ResourcePool',
          kind: 'LinkedField',
          name: 'QueryResourcePool',
          plural: false,
          selections: [(v2 /*: any*/), (v3 /*: any*/), (v6 /*: any*/), (v7 /*: any*/), (v8 /*: any*/)],
          storageKey: null,
        },
        (v10 /*: any*/),
        (v11 /*: any*/),
        (v12 /*: any*/),
        (v14 /*: any*/),
      ],
      type: 'Query',
      abstractKey: null,
    },
    kind: 'Request',
    operation: {
      argumentDefinitions: (v0 /*: any*/),
      kind: 'Operation',
      name: 'PoolDetailPageQuery',
      selections: [
        {
          alias: null,
          args: (v1 /*: any*/),
          concreteType: 'ResourcePool',
          kind: 'LinkedField',
          name: 'QueryResourcePool',
          plural: false,
          selections: [(v2 /*: any*/), (v3 /*: any*/), (v6 /*: any*/), (v7 /*: any*/), (v8 /*: any*/), (v4 /*: any*/)],
          storageKey: null,
        },
        (v10 /*: any*/),
        (v11 /*: any*/),
        (v12 /*: any*/),
        (v14 /*: any*/),
      ],
    },
    params: {
      cacheID: '43fada0dc754ecf881633d7c1c980577',
      id: null,
      metadata: {},
      name: 'PoolDetailPageQuery',
      operationKind: 'query',
      text:
        'query PoolDetailPageQuery(\n  $poolId: ID!\n) {\n  QueryResourcePool(poolId: $poolId) {\n    Name\n    PoolType\n    ResourceType {\n      id\n      Name\n    }\n    AllocationStrategy {\n      Script\n      Description\n      Lang\n      id\n    }\n    Tags {\n      id\n      Tag\n    }\n    id\n  }\n  QueryResources(poolId: $poolId) {\n    id\n    NestedPool {\n      id\n      Name\n      Resources {\n        id\n        Properties\n        NestedPool {\n          id\n          Name\n          PoolType\n          Resources {\n            id\n            Properties\n            NestedPool {\n              id\n              Name\n              PoolType\n              Resources {\n                id\n                Properties\n                NestedPool {\n                  id\n                  Name\n                  Resources {\n                    id\n                    Properties\n                    NestedPool {\n                      id\n                      Name\n                      PoolType\n                      Resources {\n                        id\n                        Properties\n                        NestedPool {\n                          id\n                          Name\n                          PoolType\n                          Resources {\n                            id\n                            Properties\n                            NestedPool {\n                              id\n                              Name\n                              Resources {\n                                id\n                                Properties\n                                NestedPool {\n                                  id\n                                  Name\n                                  PoolType\n                                  Resources {\n                                    id\n                                    Properties\n                                    NestedPool {\n                                      id\n                                      Name\n                                      PoolType\n                                      Resources {\n                                        id\n                                        Properties\n                                      }\n                                    }\n                                  }\n                                }\n                              }\n                            }\n                          }\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n  QueryPoolCapacity(poolId: $poolId) {\n    freeCapacity\n    utilizedCapacity\n  }\n  QueryResourcePoolHierarchyPath(poolId: $poolId) {\n    id\n    Name\n  }\n  QueryResourcePools {\n    id\n    Name\n    allocatedResources {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        endCursor {\n          ID\n        }\n        startCursor {\n          ID\n        }\n      }\n      totalCount\n    }\n  }\n}\n',
    },
  };
})();
// prettier-ignore
(node/*: any*/).hash = '5e7bec57df6270519d698c306fc9b3b6';

module.exports = node;
