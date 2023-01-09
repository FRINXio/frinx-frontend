/* eslint-disable no-prototype-builtins */
/* global cy,it,describe,Cypress,beforeEach */

/// <reference types="cypress" />

import { hasOperationName } from '../../helpers/utils';

Cypress.on('uncaught:exception', () => {
  return false;
});

describe.only('check device config', () => {
  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Devices')) {
        req.reply({ fixture: 'device-inventory/device-config/device-list-R9-installed.json' });
      }
    }).as('installedDevices');

    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'FilterLabels')) {
        req.reply({ fixture: 'device-inventory/device-list/label-list.json' });
      }
    }).as('filterLabels');

    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'deviceName')) {
        req.reply({ fixture: 'device-inventory/device-config/device-name.json' });
      }
    }).as('deviceName');

    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'createTransaction')) {
        req.reply({ fixture: 'device-inventory/device-config/create-transaction.json' });
      }
    }).as('createTransaction');

    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'dataStore')) {
        req.reply({ fixture: 'device-inventory/device-config/data-store.json' });
      }
    }).as('dataStore');

    cy.visit(Cypress.env('device-inventory-host'));
    cy.get('[data-cy="device-settings-R9"]').click();
  });

  it('Calculate diff', () => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'calculatedDiff')) {
        req.reply({ fixture: 'device-inventory/device-config/calculate-diff.json' });
      }
    }).as('calculatedDiff');

    cy.get('[data-cy="device-config-calculate"]').click();
    cy.contains('Calculated diff output');
    cy.get('[data-cy="device-calculate-close"]').click();
  });

  it('Dry run', () => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'commitDataStoreConfig')) {
        req.reply({ fixture: 'device-inventory/device-config/commit-data-store.json' });
      }
    }).as('commitDataStoreConfig');

    cy.get('[data-cy="device-config-run"]').click();
    cy.contains('Dry run successfull');
    cy.get('[data-cy="device-config-run-close"]').click();
  });

  it('Discard changes', () => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'closeTransaction')) {
        req.reply({ fixture: 'device-inventory/device-config/close-transaction.json' });
      }
    }).as('closeTransaction');

    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'createTransaction')) {
        req.reply({ fixture: 'device-inventory/device-config/create-transaction.json' });
      }
    }).as('createTransaction');

    cy.get('[data-cy="device-config-discard"]').click();
    cy.contains('Sucessfully discarded changes');
  });

  it('Commit to network', () => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'commitDataStoreConfig')) {
        req.reply({ fixture: 'device-inventory/device-config/commit-data-store.json' });
      }
    }).as('commitDataStoreConfig');

    cy.get('[data-cy="device-config-commit"]').click();
    cy.contains('Successfully committed to network');
    cy.get('[data-cy="device-config-run-close"]').click();
  });

  it('Save changes', () => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'updateDataStore')) {
        req.reply({ fixture: 'device-inventory/device-config/updated-data-store-save.json' });
      }
    }).as('updatedDataStore');

    cy.get('[data-cy="device-config-save"]').click();
    cy.contains('Successfully updated config data store');
  });

  it('Create snapshot', () => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'addSnapshot')) {
        req.reply({ fixture: 'device-inventory/device-config/add-snapshot.json' });
      }
    }).as('addSnapshot');

    cy.get('[data-cy="device-config-create-snapshot"]').click();
    cy.get('[data-cy="devices-snapshot-modal-input"]').type('Test');
    cy.get('[data-cy="device-snapshot-modal-create"]').click();
    cy.contains('Successfully created snapshot');
  });

  it('Load snapshot', () => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'applySnapshot')) {
        req.reply({ fixture: 'device-inventory/device-config/apply-snapshot.json' });
      }
    }).as('applySnapshot');

    cy.get('[data-cy="device-config-load-snapshot"]').click();
    cy.get('[data-cy="device-config-snapshot-Test"]').click();
  });

  it('Sync from network', () => {
    cy.intercept('POST', 'http://localhost:3000/api/inventory', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'syncFromNetwork')) {
        req.reply({ fixture: 'device-inventory/device-config/sync-from-network.json' });
      }
    }).as('syncFromNetwork');

    cy.get('[data-cy="device-config-sync"]').click();
    cy.contains('Successfully synced from network');
  });
});
