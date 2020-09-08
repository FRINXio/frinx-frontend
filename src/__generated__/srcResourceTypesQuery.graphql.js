/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type srcResourceTypesQueryVariables = {||};
export type srcResourceTypesQueryResponse = {|
  +QueryResourceTypes: $ReadOnlyArray<?{|
    +ID: string,
    +Name: string,
  |}>
|};
export type srcResourceTypesQuery = {|
  variables: srcResourceTypesQueryVariables,
  response: srcResourceTypesQueryResponse,
|};
*/


/*
query srcResourceTypesQuery {
  QueryResourceTypes {
    ID
    Name
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "ResourceType",
    "kind": "LinkedField",
    "name": "QueryResourceTypes",
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
        "name": "Name",
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
    "name": "srcResourceTypesQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "srcResourceTypesQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "df07d51b188342ae58e558fe887f7091",
    "id": null,
    "metadata": {},
    "name": "srcResourceTypesQuery",
    "operationKind": "query",
    "text": "query srcResourceTypesQuery {\n  QueryResourceTypes {\n    ID\n    Name\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'd25fb28d9862fc044a3d84a4da0d939d';

module.exports = node;
