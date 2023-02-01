/* eslint-disable no-prototype-builtins */
/* global cy,it,describe,Cypress */

/// <reference types="cypress" />

import { hasOperationName } from '../../helpers/utils';

describe('Resource Types', () => {
  it('Show', () => {
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'ResourceTypes')) {
        req.reply({ fixture: 'resource-manager/resource-types/resource-types.json' });
      }
    }).as('ResourceTypes');
    cy.visit(Cypress.env('resource-manager-resource-types'));

    cy.contains('h1', 'Resource Types');
    cy.contains('table', 'unique_id');
    cy.contains('table', 'random_signed_int32');
    cy.contains('table', 'route_distinguisher');
    cy.contains('table', 'ipv6_prefix');
    cy.contains('table', 'ipv4');
    cy.contains('table', 'ipv4_prefix');
    cy.contains('table', 'vlan');
    cy.contains('table', 'vlan_range');
    cy.contains('table', 'ipv6');
  });

  it('Delete resource type', () => {
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'ResourceTypes')) {
        req.reply({ fixture: 'resource-manager/resource-types/resource-types.json' });
      }
    }).as('ResourceTypes');
    cy.visit(Cypress.env('resource-manager-resource-types'));

    cy.contains('h1', 'Resource Types');
    cy.contains('table', 'vlan');

    // Click Delete Resource Type
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'DeleteResourceType')) {
        req.reply({ fixture: 'resource-manager/resource-types/delete-resource-type.json' });
      }
    }).as('DeleteResourceType');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'ResourceTypes')) {
        req.reply({ fixture: 'resource-manager/resource-types/resource-types-no-vlan.json' });
      }
    }).as('ResourceTypesNoVLAN');

    cy.get('[data-cy="delete-type-vlan"]').click();

    // TODO Zeleny box
    cy.contains('Resource type deleted successfully');
    cy.wait(3000);

    cy.get('[data-cy="delete-type-vlan"]').should('not.exist');
  });
});
