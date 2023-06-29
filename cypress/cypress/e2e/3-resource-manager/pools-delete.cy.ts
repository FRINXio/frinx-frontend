/* eslint-disable no-prototype-builtins */
/* global cy,it,describe,Cypress */

/// <reference types="cypress" />

import { hasOperationName } from '../../helpers/utils';

describe('Check pools', () => {
  it('Delete pool test_ipv6', () => {
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetAllPools')) {
        req.reply({ fixture: 'resource-manager/pools/test_ipv6/get-pools.json' });
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

    cy.visit(Cypress.env('resource-manager-pools'));
    // cy.wait(['@getPools', '@GetResourceTypes'])
    cy.contains('h1', 'Pools');

    // click Delete
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'DeletePool')) {
        req.reply({ fixture: 'resource-manager/pools/test_ipv6/delete-pool.json' });
      }
    }).as('DeletePool');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetAllPools')) {
        req.reply({ fixture: 'resource-manager/pools/get-pools.json' });
      }
    }).as('GetPools');

    cy.get('[data-cy="delete-pool-test_ipv6"]').click();
    cy.contains('header', 'Delete resource pool test_ipv6');
    cy.get('[data-cy="delete-cancel"]').click();

    cy.get('[data-cy="delete-pool-test_ipv6"]').click();
    cy.contains('header', 'Delete resource pool test_ipv6');
    cy.get('[data-cy="delete-confirm"]').click();

    cy.wait(['@DeletePool']);
    cy.wait(3000);
    cy.contains('h1', 'Pools');
    cy.wait(['@GetPools']);
    cy.contains('test_ipv6').should('not.exist');
    cy.get('[data-cy="delete-pool-test"]');
    cy.contains('test').should('exist');
  });
});
