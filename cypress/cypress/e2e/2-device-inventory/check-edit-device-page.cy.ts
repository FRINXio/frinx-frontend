/* eslint-disable no-prototype-builtins */
/* global cy,it,describe,Cypress,beforeEach */

/// <reference types="cypress" />

import { hasOperationName } from '../../helpers/utils';

describe('check edit device form', () => {
  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Devices')) {
        req.reply({ fixture: 'device-inventory/device-list/device-list.json' });
      }
    });

    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'FilterLabels')) {
        req.reply({ fixture: 'device-inventory/device-list/label-list.json' });
      }
    }).as('filterLabels');
    cy.visit(Cypress.env('device-inventory-host'));
  });

  it('Edit device and submit changes', () => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Device')) {
        req.reply({ fixture: 'device-inventory/device-edit/edit-device-R9.json' });
      }
    }).as('getDevice');

    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Zones')) {
        req.reply({ fixture: 'device-inventory/device-edit/edit-device-zones.json' });
      }
    }).as('zones');

    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Labels')) {
        req.reply({ fixture: 'device-inventory/device-edit/edit-device-labels.json' });
      }
    }).as('labels');

    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'UpdateDevice')) {
        req.reply({ fixture: 'device-inventory/device-edit/edit-device-R9-updated.json' });
      }
    }).as('updateDevice');

    cy.get('[data-cy="device-edit-R9"]').click();
    cy.contains('h1', 'Edit R9').should('be.visible');

    cy.get('[data-cy="device-edit-state"]').select(2);
    cy.get('[data-cy="device-edit-vendor"]').type('-edit');
    cy.get('[data-cy="device-edit-model"]').type('-edit');
    cy.get('[data-cy="device-edit-size"]').select(3);
    cy.get('[data-cy="device-edit-address"]').type('-edit');
    cy.get('[data-cy=search-by-label]').click().get('[id=downshift-1-item-1]').click();
    cy.wait('@updateDevice')
      .get('[data-cy="ace-editor"]')
      .siblings()
      .children('.ace_scroller')
      .children('.ace_content')
      .click()
      .type('{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}, "Test":"{downArrow}{leftArrow}Test');

    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Devices')) {
        req.reply({ fixture: 'device-inventory/device-edit/device-list-edited.json' });
      }

      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'FilterLabels')) {
        req.reply({ fixture: 'device-inventory/device-list/label-list.json' });
      }
    }).as('filterLabels');
    cy.get('[data-cy="device-edit-save"]').click();
    cy.contains('Successfull device edit');
    cy.get('[data-cy="device-state-R9"]').contains('IN_SERVICE');
  });
});
