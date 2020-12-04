/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type AllocationStrategyLang = "js" | "py" | "%future added value";
export type CreateAllocationStrategyInput = {|
  name: string,
  description?: ?string,
  script: string,
  lang: AllocationStrategyLang,
|};
export type AddStrategyMutationVariables = {|
  input: CreateAllocationStrategyInput
|};
export type AddStrategyMutationResponse = {|
  +CreateAllocationStrategy: {|
    +strategy: ?{|
      +id: string,
      +Name: string,
      +Lang: AllocationStrategyLang,
      +Script: string,
    |}
  |}
|};
export type AddStrategyMutation = {|
  variables: AddStrategyMutationVariables,
  response: AddStrategyMutationResponse,
|};
*/

/*
mutation AddStrategyMutation(
  $input: CreateAllocationStrategyInput!
) {
  CreateAllocationStrategy(input: $input) {
    strategy {
      id
      Name
      Lang
      Script
    }
  }
}
*/

const node /*: ConcreteRequest*/ = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: 'LocalArgument',
        name: 'input',
      },
    ],
    v1 = [
      {
        alias: null,
        args: [
          {
            kind: 'Variable',
            name: 'input',
            variableName: 'input',
          },
        ],
        concreteType: 'CreateAllocationStrategyPayload',
        kind: 'LinkedField',
        name: 'CreateAllocationStrategy',
        plural: false,
        selections: [
          {
            alias: null,
            args: null,
            concreteType: 'AllocationStrategy',
            kind: 'LinkedField',
            name: 'strategy',
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                kind: 'ScalarField',
                name: 'id',
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: 'ScalarField',
                name: 'Name',
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: 'ScalarField',
                name: 'Lang',
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                kind: 'ScalarField',
                name: 'Script',
                storageKey: null,
              },
            ],
            storageKey: null,
          },
        ],
        storageKey: null,
      },
    ];
  return {
    fragment: {
      argumentDefinitions: (v0 /*: any*/),
      kind: 'Fragment',
      metadata: null,
      name: 'AddStrategyMutation',
      selections: (v1 /*: any*/),
      type: 'Mutation',
      abstractKey: null,
    },
    kind: 'Request',
    operation: {
      argumentDefinitions: (v0 /*: any*/),
      kind: 'Operation',
      name: 'AddStrategyMutation',
      selections: (v1 /*: any*/),
    },
    params: {
      cacheID: 'f0e413cc0a818226215ffb50d52528cc',
      id: null,
      metadata: {},
      name: 'AddStrategyMutation',
      operationKind: 'mutation',
      text:
        'mutation AddStrategyMutation(\n  $input: CreateAllocationStrategyInput!\n) {\n  CreateAllocationStrategy(input: $input) {\n    strategy {\n      id\n      Name\n      Lang\n      Script\n    }\n  }\n}\n',
    },
  };
})();
// prettier-ignore
(node/*: any*/).hash = '21fc07ca132b83a9f6a9d8405e63580a';

module.exports = node;
