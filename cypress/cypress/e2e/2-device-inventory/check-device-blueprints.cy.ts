/* eslint-disable no-prototype-builtins */
/* global cy,it,describe,Cypress,beforeEach */

/// <reference types="cypress" />

import { hasOperationName } from '../../helpers/utils';

describe('Check blueprints', () => {
  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Blueprints')) {
        req.reply({ fixture: 'device-inventory/device-blueprints/blueprints.json' });
      }
    }).as('getBlueprints');
    cy.visit(Cypress.env('device-inventory-blueprints'));
  });

  it('Check if name is in the list and delete blueprint', () => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'deleteBlueprint')) {
        req.reply({ fixture: 'device-inventory/device-blueprints/delete-blueprint.json' });
      }
    }).as('getDeletedBlueprints');

    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Blueprints')) {
        req.reply({ fixture: 'device-inventory/device-blueprints/blueprints-deleted-list.json' });
      }
    }).as('getBlueprintsDeleteList');

    cy.contains('h1', 'Device blueprints');
    cy.contains('netconf_device_iosxr');
    cy.get('[data-cy="device-blueprint-delete-netconf_device_iosxr"]').click();
    cy.get('netconf_device_iosxr').should('not.exist');
  });

  it('Add blueprint', () => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AddBlueprint')) {
        req.reply({ fixture: 'device-inventory/device-blueprints/add-blueprint.json' });
      }
    }).as('getAddBlueprints');

    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Blueprints')) {
        req.reply({ fixture: 'device-inventory/device-blueprints/blueprints-added-list.json' });
      }
    }).as('getAddedBlueprints');

    cy.get('[data-cy="device-blueprint-add"]').click();
    cy.get('[data-cy="device-blueprint-add-name"]').type('Test-blueprint');
    cy.get('[data-cy="device-blueprint-add-template"]').type('Test-blueprint');
    cy.get('[data-cy="device-blueprint-add-submit"]').click();
    cy.contains('Test-blueprint').should('be.visible');
  });

  it('Edit blueprint', () => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Blueprint')) {
        req.reply({ fixture: 'device-inventory/device-blueprints/edit-blueprint.json' });
      }
    }).as('getUpdateBlueprint');
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'UpdateBlueprint')) {
        req.reply({ fixture: 'device-inventory/device-blueprints/update-blueprint.json' });
      }
    }).as('getUpdateBlueprint');
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Blueprints')) {
        req.reply({ fixture: 'device-inventory/device-blueprints/updated-blueprints.json' });
      }
    }).as('getUpdatedBlueprints');

    cy.get('[data-cy="device-blueprint-edit-netconf_device"]').click();
    cy.contains('Edit netconf_device').should('be.visible');
    cy.get('[data-cy="blueprint-edit-name"]').type('-edit');
    cy.get('[data-cy="blueprint-edit-confirm"]').click();
    cy.contains('netconf_device_edit').should('be.visible');
  });
});
