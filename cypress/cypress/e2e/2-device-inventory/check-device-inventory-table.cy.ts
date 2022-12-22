/* eslint-disable no-prototype-builtins */
/* global cy,it,describe,Cypress */

/// <reference types="cypress" />

import { hasOperationName } from '../../helpers/utils';

describe('check devices inventory table', () => {
  it('Search by label', () => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'FilterLabels')) {
        req.reply({ fixture: 'device-inventory/device-list/label-list.json' });
      }
    }).as('filterLabels');

    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Devices')) {
        req.reply({ fixture: 'device-inventory/device-list/label-search-RX.json' });
      }
    }).as('searchDevices');

    cy.visit(Cypress.env('device-inventory-host'));

    cy.wait('@filterLabels');
    cy.get('[data-cy="search-by-label"]').click();
    cy.get('#downshift-0-item-3').click();

    cy.wait('@searchDevices');
    cy.contains('RX2');
  });

  it('Filter by name', () => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Devices')) {
        req.reply({ fixture: 'device-inventory/device-list/filter-by-name-R9.json' });
      }
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'FilterLabels')) {
        req.reply({ fixture: 'device-inventory/device-list/label-list.json' });
      }
    });
    cy.get('[data-cy="search-by-name"]').type('R9').get('[data-cy="search-button"]').click().wait(2000);
    cy.contains('R9');
  });

  it('Install device', () => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'InstallDevice')) {
        req.reply({ fixture: 'device-inventory/device-list/install-device-R9.json' });
      }
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Devices')) {
        req.reply({ fixture: 'device-inventory/device-list/single-device-list-installed.json' });
      }
    });
    cy.get('[data-cy="device-install-R9"]').click();
    cy.contains('Device was installed successfully');
  });

  it('Install selected', () => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'InstallDevice')) {
        req.reply({ fixture: 'device-inventory/device-list/install-device-R6.json' });
      }

      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Devices')) {
        req.reply({ fixture: 'device-inventory/device-list/install-selected-device.json' });
      }
    });
    cy.get('[data-cy="device-check-box-R6"]').click();
    cy.get('[data-cy="install-devices"]').click();
    cy.contains('Device was installed successfully');
  });

  it('Delete selected', () => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'DeleteDevice')) {
        req.reply({ fixture: 'device-inventory/device-list/delete-device-R9.json' });
      }

      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Devices')) {
        req.reply({ fixture: 'device-inventory/device-list/deleted-device-list.json' });
      }
    });
    cy.get('[data-cy="device-check-box-R9"]').click();
    cy.get('[data-cy="delete-devices"]').click();
    cy.get('[data-cy="device-confirm-delete"]').click();
    cy.get('[data-cy="device-name-R9"]').should('not.exist');
  });
});
