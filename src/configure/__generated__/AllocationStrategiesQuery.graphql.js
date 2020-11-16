/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type AllocationStrategyLang = "js" | "py" | "%future added value";
export type AllocationStrategiesQueryVariables = {||};
export type AllocationStrategiesQueryResponse = {|
  +QueryAllocationStrategies: $ReadOnlyArray<{|
    +id: string,
    +Name: string,
    +Lang: AllocationStrategyLang,
    +Script: string,
    +Description: ?string,
  |}>
|};
export type AllocationStrategiesQuery = {|
  variables: AllocationStrategiesQueryVariables,
  response: AllocationStrategiesQueryResponse,
|};
*/


/*
query AllocationStrategiesQuery {
  QueryAllocationStrategies {
    id
    Name
    Lang
    Script
    Description
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "AllocationStrategy",
    "kind": "LinkedField",
    "name": "QueryAllocationStrategies",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "Name",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "Lang",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "Script",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "Description",
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
    "name": "AllocationStrategiesQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AllocationStrategiesQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "48eed8e7cfb8e6731dfcae2fc9f08462",
    "id": null,
    "metadata": {},
    "name": "AllocationStrategiesQuery",
    "operationKind": "query",
    "text": "query AllocationStrategiesQuery {\n  QueryAllocationStrategies {\n    id\n    Name\n    Lang\n    Script\n    Description\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '195a30d49380e2696bb37fb1576c601b';

module.exports = node;
