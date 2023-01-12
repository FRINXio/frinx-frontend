/* eslint-disable no-prototype-builtins */
/* global cy,it,describe,Cypress,beforeEach */

/// <reference types="cypress" />

import { hasOperationName } from '../../helpers/utils';

describe('Check pools', () => {
  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/default-pools.json' });
      }
    }).as('getPools');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetResourceTypes')) {
        req.reply({ fixture: 'resource-manager/default-pools2.json' });
      }
    }).as('GetResourceTypes');
    cy.visit(Cypress.env('resource-manager-pools'));
  });

  it('Check', () => {
    cy.contains('h1', 'Pools');

  });

  /*
  Create new Pool
  Nested: disabled
  create-pool-nested
  Resource type*
  create-pool-type
  <select data-cy="create-pool-type" name="resourceTypeId" id="resourceType" required="" aria-required="true" class="chakra-select css-1jifkcm"><option value="25769803784">unique_id</option><option value="25769803783">random_signed_int32</option><option value="25769803782">route_distinguisher</option><option value="25769803780">ipv6_prefix</option><option value="25769803777">ipv4</option><option value="25769803776">ipv4_prefix</option><option value="25769803779">vlan</option><option value="25769803778">vlan_range</option><option value="">Select resource type</option><option value="25769803781">ipv6</option></select>
  ipv6
  Name*
  create-pool-name
  test_ipv6
  Description
  create-pool-description
  This is test_ipv6 resource type
Enjoy
  Select tags
  ALFA

  Start typing...
  id=downshift-0-input
  Set pool properties
  address*
  device-state-address
  192.168.0.1
2001:db8:1::
  prefix*
  device-state-prefix
  24
  64
  subnet
  device-state-subnet
  Advanced options
  device-state-advanced-options
  Pool type
  device-state-pool-type
  <select data-cy="device-state-pool-type" name="poolType" id="poolTypeName" class="chakra-select css-1jifkcm"><option value="set">set</option><option value="allocating">allocating</option><option value="singleton">singleton</option></select>
  Dealocation safety period
  device-state-dealocation-period
  0 Enter dealocation safety period

  create-pool-cancel
  create-pool-submit

GetPools
{"data":{"QueryRootResourcePools":[{"id":"21474836481","Name":"test","PoolType":"allocating","Tags":[{"id":"30064771072","Tag":"test","__typename":"Tag"}],"PoolProperties":{"address":"192.168.10.1","prefix":24,"subnet":false},"AllocationStrategy":{"id":"2","Name":"ipv4","Lang":"go","__typename":"AllocationStrategy"},"ResourceType":{"id":"25769803777","Name":"ipv4","__typename":"ResourceType"},"Resources":[{"id":"17179869189","NestedPool":null,"__typename":"Resource"}],"Capacity":{"freeCapacity":"255","utilizedCapacity":"1","__typename":"PoolCapacityPayload"},"__typename":"ResourcePool"}]}}
GetResourceTypes
{"data":{"QueryResourceTypes":[{"id":"25769803784","Name":"unique_id","__typename":"ResourceType"},{"id":"25769803783","Name":"random_signed_int32","__typename":"ResourceType"},{"id":"25769803782","Name":"route_distinguisher","__typename":"ResourceType"},{"id":"25769803780","Name":"ipv6_prefix","__typename":"ResourceType"},{"id":"25769803777","Name":"ipv4","__typename":"ResourceType"},{"id":"25769803776","Name":"ipv4_prefix","__typename":"ResourceType"},{"id":"25769803779","Name":"vlan","__typename":"ResourceType"},{"id":"25769803778","Name":"vlan_range","__typename":"ResourceType"},{"id":"25769803781","Name":"ipv6","__typename":"ResourceType"}]}}

SelectPools
{"data":{"QueryResourcePools":[{"id":"21474836481","Name":"test","ResourceType":{"id":"25769803777","Name":"ipv4","__typename":"ResourceType"},"Resources":[{"Description":"","Properties":{"address":"192.168.10.1"},"id":"17179869189","ParentPool":{"id":"21474836481","Name":"test","__typename":"ResourcePool"},"NestedPool":null,"__typename":"Resource"}],"__typename":"ResourcePool"}]}}
SelectAllocationStrategies
{"data":{"QueryAllocationStrategies":[{"id":"3","Name":"vlan_range","__typename":"AllocationStrategy"},{"id":"4","Name":"vlan","__typename":"AllocationStrategy"},{"id":"1","Name":"ipv4_prefix","__typename":"AllocationStrategy"},{"id":"5","Name":"ipv6_prefix","__typename":"AllocationStrategy"},{"id":"7","Name":"route_distinguisher","__typename":"AllocationStrategy"},{"id":"8","Name":"random_signed_int32","__typename":"AllocationStrategy"},{"id":"6","Name":"ipv6","__typename":"AllocationStrategy"},{"id":"2","Name":"ipv4","__typename":"AllocationStrategy"},{"id":"9","Name":"unique_id","__typename":"AllocationStrategy"}]}}
SelectResourceTypes
{"data":{"QueryResourceTypes":[{"Name":"unique_id","id":"25769803784","__typename":"ResourceType"},{"Name":"random_signed_int32","id":"25769803783","__typename":"ResourceType"},{"Name":"route_distinguisher","id":"25769803782","__typename":"ResourceType"},{"Name":"ipv6_prefix","id":"25769803780","__typename":"ResourceType"},{"Name":"ipv4","id":"25769803777","__typename":"ResourceType"},{"Name":"ipv4_prefix","id":"25769803776","__typename":"ResourceType"},{"Name":"vlan","id":"25769803779","__typename":"ResourceType"},{"Name":"vlan_range","id":"25769803778","__typename":"ResourceType"},{"Name":"ipv6","id":"25769803781","__typename":"ResourceType"}]}}
RequiredPoolProperties
{"errors":[{"message":"Unable to retrieve required allocation strategy by name: %!(EXTRA *ent.NotFoundError=ent: allocation_strategy not found)","path":["QueryRequiredPoolProperties"]}],"data":null}
RequiredPoolProperties
{"errors":[{"message":"Unable to retrieve required allocation strategy by name: %!(EXTRA *ent.NotFoundError=ent: allocation_strategy not found)","path":["QueryRequiredPoolProperties"]}],"data":null}
CreateAllocationPool
{"data":{"CreateAllocatingPool":{"pool":{"id":"21474836482","__typename":"ResourcePool"},"__typename":"CreateAllocatingPoolPayload"}}}
SelectPools
FAILED
GetPools
{"data":{"QueryRootResourcePools":[{"id":"21474836481","Name":"test","PoolType":"allocating","Tags":[{"id":"30064771072","Tag":"test","__typename":"Tag"}],"PoolProperties":{"address":"192.168.10.1","prefix":24,"subnet":false},"AllocationStrategy":{"id":"2","Name":"ipv4","Lang":"go","__typename":"AllocationStrategy"},"ResourceType":{"id":"25769803777","Name":"ipv4","__typename":"ResourceType"},"Resources":[{"id":"17179869189","NestedPool":null,"__typename":"Resource"}],"Capacity":{"freeCapacity":"255","utilizedCapacity":"1","__typename":"PoolCapacityPayload"},"__typename":"ResourcePool"},{"id":"21474836482","Name":"test_ipv6","PoolType":"allocating","Tags":[{"id":"30064771073","Tag":"test_ipv6","__typename":"Tag"}],"PoolProperties":{"address":"2001:db8:1::","prefix":64,"subnet":false},"AllocationStrategy":{"id":"6","Name":"ipv6","Lang":"go","__typename":"AllocationStrategy"},"ResourceType":{"id":"25769803781","Name":"ipv6","__typename":"ResourceType"},"Resources":[],"Capacity":{"freeCapacity":"18446744073709551616","utilizedCapacity":"0","__typename":"PoolCapacityPayload"},"__typename":"ResourcePool"}]}}



  */

  it('Create pool', () => {
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectPools')) {
        req.reply({ fixture: 'resource-manager/create-pool/SelectPools.json' });
      }
    }).as('SelectPools');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectAllocationStrategies')) {
        req.reply({ fixture: 'resource-manager/create-pool/SelectAllocationStrategies.json' });
      }
    }).as('SelectAllocationStrategies');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectResourceTypes')) {
        req.reply({ fixture: 'resource-manager/create-pool/SelectResourceTypes.json' });
      }
    }).as('SelectResourceTypes');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'RequiredPoolProperties')) {
        req.reply({ fixture: 'resource-manager/create-pool/RequiredPoolProperties.json' });
      }
    }).as('RequiredPoolProperties');

    cy.wait(['@getPools', '@GetResourceTypes'])
    cy.contains('h1', 'Pools');
    cy.get('[data-cy="create-pool-btn"]').click();
    cy.wait(['@SelectPools', '@SelectAllocationStrategies', '@SelectResourceTypes', '@RequiredPoolProperties'])
    cy.get('[data-cy="create-pool-type"]').select('ipv6');
    cy.get('[data-cy="create-pool-name"]').type('test_ipv6');
    cy.get('[data-cy="create-pool-description"]').type('This is test_ipv6 resource type\nEnjoy');
    //cy.get('[id="downshift-0-input"]').type('ALFA');
    cy.get('[data-cy="device-state-address"]').type('2001:db8:1::');
    cy.get('[data-cy="device-state-prefix"]').type('64');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'CreateAllocationPool')) {
        req.reply({ fixture: 'resource-manager/create-pool/CreateAllocationPool.json' });
      }
    }).as('CreateAllocationPool');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/create-pool/GetPoolsAfter.json' });
      }
    }).as('GetPoolsAfter');



    cy.get('[data-cy="create-pool-submit"]').click();

    cy.wait(['@GetPoolsAfter'])

    cy.contains('test_ipv6').should('be.visible');
  });

});
