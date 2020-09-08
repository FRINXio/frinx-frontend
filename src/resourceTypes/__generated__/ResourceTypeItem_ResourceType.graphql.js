/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type ResourceTypeItem_ResourceType$ref: FragmentReference;
declare export opaque type ResourceTypeItem_ResourceType$fragmentType: ResourceTypeItem_ResourceType$ref;
export type ResourceTypeItem_ResourceType = {|
  +ID: string,
  +Name: string,
  +PropertyTypes: $ReadOnlyArray<{|
    +Name: string,
    +Type: string,
  |}>,
  +Pools: $ReadOnlyArray<{|
    +ID: string,
    +Name: string,
  |}>,
  +$refType: ResourceTypeItem_ResourceType$ref,
|};
export type ResourceTypeItem_ResourceType$data = ResourceTypeItem_ResourceType;
export type ResourceTypeItem_ResourceType$key = {
  +$data?: ResourceTypeItem_ResourceType$data,
  +$fragmentRefs: ResourceTypeItem_ResourceType$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ID",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "Name",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ResourceTypeItem_ResourceType",
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
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "Type",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
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
    }
  ],
  "type": "ResourceType",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = '39cbfbddf277bc2798447cd641ab3f31';

module.exports = node;
