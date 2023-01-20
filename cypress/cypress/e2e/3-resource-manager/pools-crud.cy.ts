/* eslint-disable no-prototype-builtins */
/* global cy,it,describe,Cypress,beforeEach */

/// <reference types="cypress" />

import { hasOperationName } from '../../helpers/utils';

describe('Check pools', () => {
  it('Check', () => {

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/pools/GetPools.json' });
      }
    }).as('getPools');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetResourceTypes')) {
        req.reply({ fixture: 'resource-manager/pools/GetResourceTypes' });
      }
    }).as('GetResourceTypes');

    cy.visit(Cypress.env('resource-manager-pools'));

    cy.contains('h1', 'Pools');

  });

  it('Create pool test_ipv6', () => {

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/pools/GetPools.json' });
      }
    }).as('getPools');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetResourceTypes')) {
        req.reply({ fixture: 'resource-manager/pools/GetResourceTypes' });
      }
    }).as('GetResourceTypes');

    cy.visit(Cypress.env('resource-manager-pools'));
    cy.wait(['@getPools', '@GetResourceTypes'])
    cy.contains('h1', 'Pools');

    // click Create pool
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectPools')) {
        req.reply({ fixture: 'resource-manager/pools/SelectPools.json' });
      }
    }).as('SelectPools');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectAllocationStrategies')) {
        req.reply({ fixture: 'resource-manager/pools/SelectAllocationStrategies.json' });
      }
    }).as('SelectAllocationStrategies');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectResourceTypes')) {
        req.reply({ fixture: 'resource-manager/pools/create/SelectResourceTypes.json' });
      }
    }).as('SelectResourceTypes');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'RequiredPoolProperties')) {
        req.reply({ fixture: 'resource-manager/pools/create/RequiredPoolProperties.json' });
      }
    }).as('RequiredPoolProperties');

    cy.get('[data-cy="create-pool-btn"]').click();  // Create pool
    cy.wait(['@SelectPools', '@SelectAllocationStrategies', '@SelectResourceTypes', '@RequiredPoolProperties'])
    cy.contains('h1', 'Create new Pool');

    cy.get('[data-cy="create-pool-type"]').select('ipv6');  // Resource type*
    cy.get('[data-cy="create-pool-name"]').type('test_ipv6');  // Name*
    cy.get('[data-cy="create-pool-description"]').type('This is test_ipv6 resource type\nEnjoy');  // Description

    // Set pool properties
    cy.get('[data-cy="device-state-address"]').type('2001:db8:1::'); // address*
    cy.get('[data-cy="device-state-prefix"]').type('64');  // prefix*

    // click Create pool
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'CreateAllocationPool')) {
        req.reply({ fixture: 'resource-manager/pools/test_ipv6/CreateAllocationPool.json' });
      }
    }).as('CreateAllocationPool');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/pools/test_ipv6/GetPools.json' });
      }
    }).as('GetPools');

    cy.get('[data-cy="create-pool-submit"]').click();  // Create pool
    cy.wait(['@GetPools'])

    cy.contains('h1', 'Pools');
    cy.contains('test_ipv6').should('be.visible');
  });

  it('Delete pool test_ipv6', () => {

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/pools/test_ipv6/GetPools.json' });
      }
    }).as('getPools');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetResourceTypes')) {
        req.reply({ fixture: 'resource-manager/pools/GetResourceTypes' });
      }
    }).as('GetResourceTypes');

    cy.visit(Cypress.env('resource-manager-pools'));
    //cy.wait(['@getPools', '@GetResourceTypes'])
    cy.contains('h1', 'Pools');

    // click Delete
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'DeletePool')) {
        req.reply({ fixture: 'resource-manager/pools/test_ipv6/DeletePool.json' });
      }
    }).as('DeletePool');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/pools/GetPools.json' });
      }
    }).as('GetPools');

    cy.get('[data-cy="delete-pool-test_ipv6"]').click();
    cy.contains('header', 'Delete resource pool test_ipv6');
    cy.get('[data-cy="delete-pool-cancel"]').click();

    cy.get('[data-cy="delete-pool-test_ipv6"]').click();
    cy.contains('header', 'Delete resource pool test_ipv6');
    cy.get('[data-cy="delete-pool-confirm"]').click();

    cy.wait(['@DeletePool'])
    cy.wait(3000)
    cy.contains('h1', 'Pools');
    cy.wait(['@GetPools'])
    cy.contains('test_ipv6').should('not.exist');
    cy.get('[data-cy="delete-pool-test"]')
    cy.contains('test').should('exist');
  });

});
