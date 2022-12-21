/* eslint-disable no-prototype-builtins */
/* global cy,it,describe,Cypress,beforeEach */

/// <reference types="cypress" />

describe('check devices inventory table', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('device-inventory-host'));
    cy.intercept('POST', '/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && req.body.query.includes('Devices')) {
        req.reply({ fixture: 'device-inventory/device-list/device-list.json' });
      }
      if (req.body.hasOwnProperty('query') && req.body.query.includes('FilterLabels')) {
        req.reply({ fixture: 'device-inventory/device-list/label-list.json' });
      }
    }).as('getDevices');
  });

  it('Filter by name', () => {
    cy.intercept('POST', '/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && req.body.query.includes('Devices')) {
        req.reply({ fixture: 'device-inventory/device-list/filter-by-name-R9.json' });
      }
      if (req.body.hasOwnProperty('query') && req.body.query.includes('FilterLabels')) {
        req.reply({ fixture: 'device-inventory/device-list/label-list.json' });
      }
    }).as('getDevice');
    cy.get('[data-cy="search-by-name"]').type('R9').get('[data-cy="search-button"]').click().wait(2000);
    cy.contains('R9');
  });

  it('Search by label', () => {
    cy.intercept('POST', '/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && req.body.query.includes('Devices')) {
        req.reply({ fixture: 'device-inventory/device-list/label-search-RX.json' });
      }
    });
    cy.get('[data-cy="search-by-label"]').click();
    cy.get('#downshift-0-item-3').click();
    cy.wait(2000).contains('RX2');
  });

  it('Install device', () => {
    cy.intercept('POST', '/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && req.body.query.includes('InstallDevice')) {
        req.reply({ fixture: 'device-inventory/device-list/install-device-R9.json' });
      }
      if (req.body.hasOwnProperty('query') && req.body.query.includes('Devices')) {
        req.reply({ fixture: 'device-inventory/device-list/single-device-list-installed.json' });
      }
    });
    cy.get('[data-cy="device-install-R9"]').click();
    cy.contains('Device was installed successfully');
  });

  it('Install selected', () => {
    cy.intercept('POST', '/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && req.body.query.includes('InstallDevice')) {
        req.reply({ fixture: 'device-inventory/device-list/install-device-R6.json' });
      }

      if (req.body.hasOwnProperty('query') && req.body.query.includes('Devices')) {
        req.reply({ fixture: 'device-inventory/device-list/install-selected-device.json' });
      }
    });
    cy.get('[data-cy="device-check-box-R6"]').click();
    cy.get('[data-cy="install-devices"]').click();
    cy.contains('Device was installed successfully');
  });

  it('Delete selected', () => {
    cy.intercept('POST', '/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && req.body.query.includes('DeleteDevice')) {
        req.reply({ fixture: 'device-inventory/device-list/delete-device-R9.json' });
      }

      if (req.body.hasOwnProperty('query') && req.body.query.includes('Devices')) {
        req.reply({ fixture: 'device-inventory/device-list/deleted-device-list.json' });
      }
    });
    cy.get('[data-cy="device-check-box-R9"]').click();
    cy.get('[data-cy="delete-devices"]').click();
    cy.get('[data-cy="device-confirm-delete"]').click();
    cy.get('[data-cy="device-name-R9"]').should('not.exist');
  });
});
