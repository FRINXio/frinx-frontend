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
  +QueryAllocationStrategies: $ReadOnlyArray<?{|
    +ID: string,
    +Lang: AllocationStrategyLang,
    +Name: string,
    +Script: string,
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
    ID
    Lang
    Name
    Script
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
        "name": "ID",
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
        "name": "Name",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "Script",
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
    "cacheID": "83d0e0a3efaa2a928dc88326cbc53ec2",
    "id": null,
    "metadata": {},
    "name": "AllocationStrategiesQuery",
    "operationKind": "query",
    "text": "query AllocationStrategiesQuery {\n  QueryAllocationStrategies {\n    ID\n    Lang\n    Name\n    Script\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'e66369f5be953b3c8ae4d321d7c6643c';

module.exports = node;
