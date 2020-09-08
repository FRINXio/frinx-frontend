/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type AddEditResourceTypeCard_editingResourceType$ref: FragmentReference;
declare export opaque type AddEditResourceTypeCard_editingResourceType$fragmentType: AddEditResourceTypeCard_editingResourceType$ref;
export type AddEditResourceTypeCard_editingResourceType = {|
  +ID: string,
  +Name: string,
  +PropertyTypes: $ReadOnlyArray<{|
    +ID: string,
    +Name: string,
    +Type: string,
    +IntVal: number,
    +StringVal: string,
    +FloatVal: number,
    +Mandatory: boolean,
  |}>,
  +$refType: AddEditResourceTypeCard_editingResourceType$ref,
|};
export type AddEditResourceTypeCard_editingResourceType$data = AddEditResourceTypeCard_editingResourceType;
export type AddEditResourceTypeCard_editingResourceType$key = {
  +$data?: AddEditResourceTypeCard_editingResourceType$data,
  +$fragmentRefs: AddEditResourceTypeCard_editingResourceType$ref,
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
  "name": "AddEditResourceTypeCard_editingResourceType",
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
        (v0/*: any*/),
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "Type",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "IntVal",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "StringVal",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "FloatVal",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "Mandatory",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "ResourceType",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = 'f5bff3b0616a53199b237fb9aba9ec4b';

module.exports = node;
