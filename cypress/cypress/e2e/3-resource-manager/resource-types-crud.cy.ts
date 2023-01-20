/* eslint-disable no-prototype-builtins */
/* global cy,it,describe,Cypress,beforeEach */

/// <reference types="cypress" />

import { hasOperationName } from '../../helpers/utils';

describe('Resource Types', () => {
  beforeEach(() => {});

  it('Show', () => {
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'ResourceTypes')) {
        req.reply({ fixture: 'resource-manager/resource-types/ResourceTypes.json' });
      }
    }).as('ResourceTypes');
    cy.visit(Cypress.env('resource-manager-resource-types'));

    cy.contains('h1', 'Resource Types');
    cy.contains('button', 'Create resource type');
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

  it('Create', () => {
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'ResourceTypes')) {
        req.reply({ fixture: 'resource-manager/resource-types/ResourceTypes.json' });
      }
    }).as('ResourceTypes');
    cy.visit(Cypress.env('resource-manager-resource-types'));

    cy.contains('h1', 'Resource Types');
    cy.contains('button', 'Create resource type');
    cy.contains('table', 'unique_id');

    // Click Create Resource Type
    cy.get('[data-cy="create-resource-type"]').click();
    cy.contains('header', 'Create Resource Type');
    cy.get('[data-cy="new-type-name"]').type('stano');

    // Click Create
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'CreateResourceType')) {
        req.reply({ fixture: 'resource-manager/resource-types/ANewTestType/CreateResourceType.json' });
      }
    }).as('CreateResourceType');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'ResourceTypes')) {
        req.reply({ fixture: 'resource-manager/resource-types/ANewTestType/ResourceTypes.json' });
      }
    }).as('ResourceTypesAfter');

    cy.get('[data-cy="new-type-create"]').click();

    // TODO Zeleny box
    cy.contains('Resource type created successfully');
    cy.wait(3000);

    cy.contains('table', 'stano');
  });

  it('Delete resource type', () => {
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'ResourceTypes')) {
        req.reply({ fixture: 'resource-manager/resource-types/ANewTestType/ResourceTypes.json' });
      }
    }).as('ResourceTypesAfter');
    cy.visit(Cypress.env('resource-manager-resource-types'));

    cy.contains('h1', 'Resource Types');
    cy.contains('table', 'stano');

    // Click Delete Resource Type
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'DeleteResourceType')) {
        req.reply({ fixture: 'resource-manager/resource-types/ANewTestType/DeleteResourceType.json' });
      }
    }).as('DeleteResourceType');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'ResourceTypes')) {
        req.reply({ fixture: 'resource-manager/resource-types/ResourceTypes.json' });
      }
    }).as('ResourceTypes');

    cy.get('[data-cy="delete-type-stano"]').click();

    // TODO Zeleny box
    cy.contains('Resource type deleted successfully');
    cy.wait(3000);

    cy.get('[data-cy="delete-type-stano"]').should('not.exist');
  });
});
