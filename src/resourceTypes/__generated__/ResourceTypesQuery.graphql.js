/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type ResourceTypesQueryVariables = {||};
export type ResourceTypesQueryResponse = {|
  +QueryResourceTypes: $ReadOnlyArray<?{|
    +ID: string,
    +Name: string,
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
    "name": "ResourceTypesQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ResourceTypesQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "4881ce2ec19ac87d7301cf4c38b065c1",
    "id": null,
    "metadata": {},
    "name": "ResourceTypesQuery",
    "operationKind": "query",
    "text": "query ResourceTypesQuery {\n  QueryResourceTypes {\n    ID\n    Name\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '64acfc96cc1bb3fc86cc1e824bdbb158';

module.exports = node;
