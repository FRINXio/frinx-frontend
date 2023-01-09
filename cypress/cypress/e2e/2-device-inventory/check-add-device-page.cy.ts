/* eslint-disable no-prototype-builtins */
/* global cy,it,describe,Cypress,beforeEach */

/// <reference types="cypress" />

import { hasOperationName } from '../../helpers/utils';

describe('check add device page', () => {
  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Devices')) {
        req.reply({ fixture: 'device-inventory/device-list/device-list.json' });
      }
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'FilterLabels')) {
        req.reply({ fixture: 'device-inventory/device-list/label-list.json' });
      }
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Labels')) {
        req.reply({ fixture: 'device-inventory/add-device/add-device-labels.json' });
      }
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'DeviceBlueprints')) {
        req.reply({ fixture: 'device-inventory/add-device/add-device-blueprints.json' });
      }
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Zones')) {
        req.reply({ fixture: 'device-inventory/add-device/add-device-zones.json' });
      }
    }).as('getDevices');
    cy.visit(Cypress.env('device-inventory-host'));

    cy.get('[data-cy=add-device]').click();
    cy.contains('h1', 'Add device');
    cy.get('[data-cy=add-device-name]').type('Test');
    cy.get('[data-cy=add-device-zone]').select(1);
    cy.get('[data-cy=add-device-vendor]').type('Test');
    cy.get('[data-cy=add-device-model]').type('Test');
    cy.get('[data-cy=add-device-size]').select(1);
    cy.get('[data-cy=add-device-type]').type('Test');
    cy.get('[data-cy=add-device-version]').type('Test');
    cy.get('[data-cy=add-device-username]').type('Test');
    cy.get('[data-cy=add-device-password]').type('Test');
    cy.get('[data-cy=add-device-address]').type('Test');
    cy.get('[data-cy=add-device-port]').type('{leftArrow}300');
    cy.get('[data-cy=search-by-label]').click().get('[id=downshift-1-item-1]').click();
    cy.get('body').click({ force: true });
    cy.contains('span', 'IOS');
  });

  it('Add device without blueprint', () => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AddDevice')) {
        req.reply({ fixture: 'device-inventory/add-device/add-device.json' });
      }
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Devices')) {
        req.reply({ fixture: 'device-inventory/add-device/added-device-list.json' });
      }
    });

    cy.get('[data-cy="add-device-switch"]').children('input').invoke('attr', 'aria-disabled').should('eq', 'false');
    cy.get('[data-cy="ace-editor"]')
      .siblings()
      .children('.ace_scroller')
      .children('.ace_content')
      .click()
      .type('{leftArrow}banana');
    cy.get('[data-cy="add-device-button"]').click().wait(1000);
    cy.contains('Device successfully added');
    cy.get('[data-cy="device-name-Test"]').should('have.text', 'Test');
  });
  it('Add device with blueprint', () => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AddDevice')) {
        req.reply({ fixture: 'device-inventory/add-device/add-device.json' });
      }
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Devices')) {
        req.reply({ fixture: 'device-inventory/add-device/added-device-list.json' });
      }
    });
    cy.get('[data-cy="add-device-switch"]').children('input').click({ force: true });
    cy.get('[data-cy="add-device-switch"]').invoke('attr', 'data-checked').should('exist');
    cy.get('[data-cy="add-device-blueprint"]').select('cli_device');
    cy.get('[data-cy="add-device-button"]').click().wait(1000);
    cy.contains('Device successfully added');
    cy.get('[data-cy="device-name-Test"]').should('have.text', 'Test');
  });
});
