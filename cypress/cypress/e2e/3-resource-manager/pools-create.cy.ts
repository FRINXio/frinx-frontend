/* eslint-disable no-prototype-builtins */
/* global cy,it,describe,Cypress */

/// <reference types="cypress" />

import { hasOperationName } from '../../helpers/utils';

describe('Create pools', () => {
  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/pools/get-pools.json' });
      }
    }).as('getPools');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetResourceTypes')) {
        req.reply({ fixture: 'resource-manager/pools/get-resource-types' });
      }
    }).as('GetResourceTypes');

    cy.visit(Cypress.env('resource-manager-pools'));
    // cy.wait(['@getPools', '@GetResourceTypes'])
    cy.contains('h1', 'Pools');

    // click Create pool
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectPools')) {
        req.reply({ fixture: 'resource-manager/pools/select-pools.json' });
      }
    }).as('SelectPools');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectAllocationStrategies')) {
        req.reply({ fixture: 'resource-manager/pools/select-allocation-strategies.json' });
      }
    }).as('SelectAllocationStrategies');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectResourceTypes')) {
        req.reply({ fixture: 'resource-manager/pools/create/select-resource-types.json' });
      }
    }).as('SelectResourceTypes');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'RequiredPoolProperties')) {
        req.reply({ fixture: 'resource-manager/pools/create/required-pool-properties.json' });
      }
    }).as('RequiredPoolProperties');

    cy.get('[data-cy="create-pool-btn"]').click(); // Create pool
    cy.wait(['@SelectPools', '@SelectAllocationStrategies', '@SelectResourceTypes', '@RequiredPoolProperties']);
    cy.contains('h1', 'Create new Pool');
  });

  it('Create pool test_ipv6', () => {
    cy.get('[data-cy="create-pool-type"]').select('ipv6'); // Resource type*
    cy.get('[data-cy="create-pool-name"]').type('test_ipv6'); // Name*
    cy.get('[data-cy="create-pool-description"]').type('This is test_ipv6 resource type\nEnjoy'); // Description

    // Set pool properties
    cy.get('[data-cy="device-state-address"]').type('2001:db8:1::'); // address*
    cy.get('[data-cy="device-state-prefix"]').type('64'); // prefix*

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'CreateAllocationPool')) {
        req.reply({ fixture: 'resource-manager/pools/test_ipv6/create-allocation-pool.json' });
      }
    }).as('CreateAllocationPool');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/pools/test_ipv6/get-pools.json' });
      }
    }).as('GetPools');

    cy.get('[data-cy="create-pool-submit"]').click(); // Create pool
    cy.wait(['@GetPools']);

    cy.contains('h1', 'Pools');
    cy.contains('test_ipv6').should('be.visible');
  });

  it.only('Create pool test_ipv4', () => {
    cy.get('[data-cy="create-pool-type"]').select('ipv4'); // Resource type*
    cy.get('[data-cy="create-pool-name"]').type('test_ipv6'); // Name*
    cy.get('[data-cy="create-pool-description"]').type('This is test_ipv4 resource type\nEnjoy'); // Description

    // Set pool properties
    cy.get('[data-cy="device-state-address"]').type('192.168.1.0'); // address*
    cy.get('[data-cy="device-state-prefix"]').type('12'); // prefix*

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'CreateAllocationPool')) {
        req.reply({ fixture: 'resource-manager/pools/test_ipv4/create-allocation-pool.json' });
      }
    }).as('CreateAllocationPool');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/pools/test_ipv4/get-pools.json' });
      }
    }).as('GetPools');

    cy.get('[data-cy="create-pool-submit"]').click(); // Create pool
    cy.wait(['@GetPools']);

    cy.contains('h1', 'Pools');
    cy.contains('test_ipv4').should('be.visible');
  });

  it('Create pool test_vlan_range', () => {
    cy.get('[data-cy="create-pool-type"]').select('vlan_range'); // Resource type*
    cy.get('[data-cy="create-pool-name"]').type('test_vlan_range'); // Name*
    cy.get('[data-cy="create-pool-description"]').type('This is test_vlan_range resource type\nEnjoy'); // Description

    // Set pool properties
    cy.get('[data-cy="device-state-from"]').type('1'); // from*
    cy.get('[data-cy="device-state-to"]').type('2048'); // to*

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'CreateAllocationPool')) {
        req.reply({ fixture: 'resource-manager/pools/test_vlan_range/create-allocation-pool.json' });
      }
    }).as('CreateAllocationPool');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/pools/test_vlan_range/get-pools.json' });
      }
    }).as('GetPools');

    cy.get('[data-cy="create-pool-submit"]').click(); // Create pool
    cy.wait(['@GetPools']);

    cy.contains('h1', 'Pools');
    cy.contains('test_vlan_range').should('be.visible');
  });

  it('Create pool test_unique_id', () => {
    cy.get('[data-cy="create-pool-type"]').select('unique_id'); // Resource type*
    cy.get('[data-cy="create-pool-name"]').type('test_unique_id'); // Name*
    cy.get('[data-cy="create-pool-description"]').type('This is test_unique_id resource type\nEnjoy'); // Description

    // Set pool properties
    cy.get('[data-cy="device-state-from"]').type('1'); // from*
    cy.get('[data-cy="device-state-to"]').type('2048'); // to*

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'CreateAllocationPool')) {
        req.reply({ fixture: 'resource-manager/pools/test_unique_id/create-allocation-pool.json' });
      }
    }).as('CreateAllocationPool');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/pools/test_unique_id/get-pools.json' });
      }
    }).as('GetPools');

    cy.get('[data-cy="create-pool-submit"]').click(); // Create pool
    cy.wait(['@GetPools']);

    cy.contains('h1', 'Pools');
    cy.contains('test_unique_id').should('be.visible');
  });

  it('Create pool test_random_signed_int32', () => {
    cy.get('[data-cy="create-pool-type"]').select('random_signed_int32'); // Resource type*
    cy.get('[data-cy="create-pool-name"]').type('test_random_signed_int32'); // Name*
    cy.get('[data-cy="create-pool-description"]').type('This is test_random_signed_int32 resource type\nEnjoy'); // Description

    // Set pool properties
    cy.get('[data-cy="device-state-from"]').type('-200000'); // from*
    cy.get('[data-cy="device-state-to"]').type('200000'); // to*

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'CreateAllocationPool')) {
        req.reply({ fixture: 'resource-manager/pools/test_random_signed_int32/create-allocation-pool.json' });
      }
    }).as('CreateAllocationPool');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/pools/test_random_signed_int32/get-pools.json' });
      }
    }).as('GetPools');

    cy.get('[data-cy="create-pool-submit"]').click(); // Create pool
    cy.wait(['@GetPools']);

    cy.contains('h1', 'Pools');
    cy.contains('test_random_signed_int32').should('be.visible');
  });

  it('Create pool test_random_signed_int32', () => {
    cy.get('[data-cy="create-pool-type"]').select('random_signed_int32'); // Resource type*
    cy.get('[data-cy="create-pool-name"]').type('test_random_signed_int32'); // Name*
    cy.get('[data-cy="create-pool-description"]').type('This is test_random_signed_int32 resource type\nEnjoy'); // Description

    // Set pool properties
    cy.get('[data-cy="device-state-from"]').type('-200000'); // from*
    cy.get('[data-cy="device-state-to"]').type('200000'); // to*

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'CreateAllocationPool')) {
        req.reply({ fixture: 'resource-manager/pools/test_random_signed_int32/create-allocation-pool.json' });
      }
    }).as('CreateAllocationPool');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/pools/test_random_signed_int32/get-pools.json' });
      }
    }).as('GetPools');

    cy.get('[data-cy="create-pool-submit"]').click(); // Create pool
    cy.wait(['@GetPools']);

    cy.contains('h1', 'Pools');
    cy.contains('test_random_signed_int32').should('be.visible');
  });

  it('Create pool test_route_distinguisher', () => {
    cy.get('[data-cy="create-pool-type"]').select('route_distinguisher'); // Resource type*
    cy.get('[data-cy="create-pool-name"]').type('test_route_distinguisher'); // Name*
    cy.get('[data-cy="create-pool-description"]').type('This is test_route_distinguisher resource type\nEnjoy'); // Description

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'CreateAllocationPool')) {
        req.reply({ fixture: 'resource-manager/pools/test_route_distinguisher/create-allocation-pool.json' });
      }
    }).as('CreateAllocationPool');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/pools/test_route_distinguisher/get-pools.json' });
      }
    }).as('GetPools');

    cy.get('[data-cy="create-pool-submit"]').click(); // Create pool
    cy.wait(['@GetPools']);

    cy.contains('h1', 'Pools');
    cy.contains('test_route_distinguisher').should('be.visible');
  });
});
