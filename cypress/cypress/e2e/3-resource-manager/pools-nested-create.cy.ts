/* eslint-disable no-prototype-builtins */
/* global cy,it,describe,Cypress,beforeEach */

/// <reference types="cypress" />

import { hasOperationName } from '../../helpers/utils';

describe('Create pool, claim, create nested pool', () => {
  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/get-pools.json' });
      }
    }).as('getPools');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetResourceTypes')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/get-resource-types.json' });
      }
    }).as('GetResourceTypes');
    cy.visit(Cypress.env('resource-manager-pools'));
  });

  it('Create pool, Claim and create nested pool', () => {
    cy.contains('h1', 'Pools', { timeout: 50000 });

    cy.contains('td', 'test');
    cy.contains('td', 'ipv4');
    cy.get('[data-cy="config-pool-test"]');

    // Click Create Pool
    cy.log('Click Create Pool');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectPools')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/create-pool/select-pools.json' });
      }
    }).as('SelectPools');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectAllocationStrategies')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/create-pool/select-allocation-strategies.json' });
      }
    }).as('SelectAllocationStrategies');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectResourceTypes')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/create-pool/select-resource-types.json' });
      }
    }).as('SelectResourceTypes');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'RequiredPoolProperties')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/create-pool/required-pool-properties.json' });
      }
    }).as('RequiredPoolProperties');

    cy.get('[data-cy="create-pool-btn"]').click(); // Create pool
    cy.wait(['@SelectPools', '@SelectAllocationStrategies', '@SelectResourceTypes', '@RequiredPoolProperties']);

    cy.contains('h1', 'Create new Pool');
    cy.get('[data-cy="create-pool-nested"]').should('not.have.attr', 'data-checked'); // Nested ON/OFF is set OFF
    cy.get('[data-cy="create-pool-type"]').select('ipv4_prefix'); // Resource type*
    cy.get('[data-cy="create-pool-name"]').type('NITRA_KLOKOCINA'); // Name*
    cy.get('[data-cy="create-pool-description"]').type('2 streets Mikoviniho / Alexyho'); // Description
    cy.get('[id="downshift-0-input"]').type('suburb'); // Select tags
    // Set pool properties
    cy.get('[data-cy="device-state-address"]').type('192.168.10.1'); // address*
    cy.get('[data-cy="device-state-prefix"]').type('29'); // prefix*
    cy.get('[data-cy="device-state-subnet"]').should('not.have.attr', 'data-checked'); // subnet ON/OFF is set OFF

    // Click Create pool
    cy.log('Click Create Pool on the form');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'CreateAllocationPool')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/form-create-pool/create-allocation-pool.json' });
      }
    }).as('CreateAllocationPool');

    // Note: canceled???
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectPools')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/create-pool/select-pools.json' });
      }
    }).as('SelectPools');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/form-create-pool/get-pools.json' });
      }
    }).as('GetPools');

    cy.screenshot();
    cy.get('[data-cy="create-pool-submit"]').click(); // Create pool
    cy.contains('Successfully created resource pool').as('greenNotif'); // green notification
    cy.get('@greenNotif').should('not.exist');
    cy.screenshot();

    cy.contains('h1', 'Pools');

    cy.contains('td', 'test');
    cy.contains('td', 'ipv4');

    cy.contains('td', 'NITRA_KLOKOCINA');
    cy.contains('td', 'ipv4_prefix');
    cy.get('[data-cy="config-pool-NITRA_KLOKOCINA"]');

    // click config button
    cy.log('Click config button');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPoolDetail')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/config/get-pool-detail.json' });
      }
    }).as('GetPoolDetail');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetResourceTypeByName')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/config/get-resource-type-by-name.json' });
      }
    }).as('GetResourceTypeByName');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AllocatedResources')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/config/allocated-resources.json' });
      }
    }).as('AllocatedResources');

    cy.get('[data-cy="config-pool-NITRA_KLOKOCINA"]').click();
    cy.wait(['@GetPoolDetail', '@GetResourceTypeByName', '@AllocatedResources']);
    cy.screenshot();

    cy.contains('h1', 'NITRA_KLOKOCINA');
    cy.contains('8 / 8'); // Utilized capacity
    // Pool properties
    cy.contains('192.168.10.1'); //
    cy.contains('29');
    cy.contains('false'); // subnet
    // Allocated Resources
    cy.contains('There are no allocated resources yet.');
    // Nested Pools
    cy.contains('There are no resource pools');
    cy.contains('a', 'Create pool');
    cy.screenshot();

    // Note when no allocation has not been done yet there is in section button 'Create pool' but it is not possible to use it for creation of nested pool !!!
    //     // click Create pool
    //     cy.contains('a', 'Create pool').click();
    //
    //     cy.contains('h1', 'Create new Pool');
    //     cy.get('[id="isNested-label"]').click();  // Nested

    // Click Claim resource
    // Going to click Claim resource button to invoke form

    cy.log('Click Claim resource');
    cy.get('[data-cy="resource-pool-claim-resource"]').click(); // Claim resource
    cy.contains('header', 'Claim resource for NITRA_KLOKOCINA');

    // Desired size (number of allocated addresses)*
    // Max number of allocated addresses can be 8
    cy.get('[data-cy="resource-pool-claim-size"]').type('4');
    cy.get('[data-cy="resource-pool-claim-value"]').type('192.168.0.250'); // Desired size (number of allocated addresses)*
    // Desired size (number of allocated addresses)*
    cy.get('[data-cy="resource-pool-claim-description"]').type('Mikoviniho'); // Description

    // Going to click Claim resource button on the form
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'ClaimResourceWithAltId')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/claim/claim-resource-with-alt-id.json' });
      }
    }).as('ClaimResourceWithAltId');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPoolDetail')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/claim/get-pool-detail.json' });
      }
    }).as('GetPoolDetail');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AllocatedResources')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/claim/allocated-resources.json' });
      }
    }).as('AllocatedResources');

    cy.screenshot();
    cy.log('Click Claim resource on the form');
    cy.get('[data-cy="resource-pool-claim-confirm"]').click(); // Claim resource
    cy.wait(['@ClaimResourceWithAltId', '@GetPoolDetail', '@AllocatedResources']);
    cy.contains('Successfully claimed resource from pool').as('greenNotif'); // green notification
    cy.get('@greenNotif').should('not.exist');
    cy.screenshot();

    cy.contains('h1', 'NITRA_KLOKOCINA');
    cy.contains('4 / 6'); // Utilized capacity

    // Allocated Resources (table)
    cy.get('[data-cy="pool-details-table"]').contains('192.168.10.1');
    cy.get('[data-cy="pool-details-table"]').contains('30');
    cy.get('[data-cy="pool-details-table"]').contains('Mikoviniho');
    cy.get('[data-cy="pool-details-table"]')

      .find('tr')
      .eq(1)
      .find('td')
      .eq(4)
      .contains('Show alternative ids')
      .click();
    cy.contains('header', 'Alternative Ids');
    cy.contains('button', 'Close').click();
    cy.contains('h1', 'NITRA_KLOKOCINA');
    cy.get('[data-cy="pool-details-table"]').find('tr').eq(1).find('td').eq(5).contains('Deallocate resource');

    // Nested Pools
    cy.contains('a', 'Create nested pool'); // Create nested pool

    // click button Create nested pool
    cy.log('Click Create nested pool');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectPools')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/create-nested/select-pools.json' });
      }
    }).as('SelectPools');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'RequiredPoolProperties')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/create-nested/required-pool-properties.json' });
      }
    }).as('RequiredPoolProperties');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'CreateNestedAllocationPool')) {
        req.reply({
          fixture: 'resource-manager/pools/nitra_klokocina/create-nested/create-nested-allocation-pool.json',
        });
      }
    }).as('CreateNestedAllocationPool');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/create-nested/get-pools.json' });
      }
    }).as('GetPools');

    cy.screenshot();

    cy.contains('a', 'Create nested pool').click(); // Create nested pool
    cy.wait(['@SelectPools', '@RequiredPoolProperties']); // , '@CreateNestedAllocationPool', '@GetPools'

    cy.contains('h1', 'Create new Pool');
    cy.get('[data-cy="create-pool-nested"]').should('have.attr', 'data-checked'); // Nested ON/OFF is set ON
    cy.get('[data-cy="create-pool-parent"]').select('NITRA_KLOKOCINA', { timeout: 50000 }); // Parent pool*
    // cy.get('[data-cy="create-pool-parent"]').invoke("text").should("eq", "NITRA_KLOKOCINA")
    cy.contains('select', 'NITRA_KLOKOCINA');
    cy.get('[data-cy="create-pool-allocated-resources"]').select('192.168.10.1', { timeout: 50000 }); // Parent allocated resources*
    // cy.get('[data-cy="create-pool-allocated-resources"]').invoke("text").should("eq", "192.168.10.1")
    cy.contains('select', '192.168.10.1');
    cy.get('[data-cy="create-pool-type"]').select('ipv4'); // Resource type*
    cy.contains('select', 'ipv4');
    cy.get('[data-cy="create-pool-name"]').type('Mikoviniho'); // Name*
    cy.get('[data-cy="create-pool-description"]').type('Mikoviniho 4'); // Description
    // Set pool properties
    // available resources (allocated in selected parent):
    // address: 192.168.10.1, prefix: 30

    //     cy.get('[data-cy="device-state-address"]').type('192.168.10.1'); // address*
    //     cy.get('[data-cy="device-state-prefix"]').type('30'); // prefix*
    //     cy.get('[data-cy="device-state-subnet"]').should('not.have.attr', 'data-checked'); // subnet ON/OFF is set OFF

    // Click Create pool on the form
    cy.screenshot();
    cy.log('Click Create pool on the form');
    cy.get('[data-cy="create-pool-submit"]').click(); // Create pool
    cy.wait(['@CreateNestedAllocationPool']);

    cy.url().should('eq', Cypress.env('resource-manager-pools'));
    cy.wait(['@SelectPools', '@GetPools']);

    // click config button
    cy.log('Click config button');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPoolDetail')) {
        req.reply({
          fixture: 'resource-manager/pools/nitra_klokocina/config-after-create-nested/get-pool-detail.json',
        });
      }
    }).as('GetPoolDetail');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetResourceTypeByName')) {
        req.reply({
          fixture: 'resource-manager/pools/nitra_klokocina/config-after-create-nested/get-resource-type-by-name.json',
        });
      }
    }).as('GetResourceTypeByName');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AllocatedResources')) {
        req.reply({
          fixture: 'resource-manager/pools/nitra_klokocina/config-after-create-nested/allocated-resources.json',
        });
      }
    }).as('AllocatedResources');

    cy.get('[data-cy="config-pool-NITRA_KLOKOCINA"]').click();
    cy.wait(['@GetPoolDetail']);

    cy.contains('h1', 'NITRA_KLOKOCINA');
    cy.contains('4 / 6'); // Utilized capacity

    // Allocated Resources (table)
    cy.get('[data-cy="pool-details-table"]').contains('192.168.10.1');
    cy.get('[data-cy="pool-details-table"]').contains('30');
    cy.get('[data-cy="pool-details-table"]').contains('Mikoviniho');
    cy.get('[data-cy="pool-details-table"]').find('tr').eq(1).find('td').eq(4).contains('Show alternative ids');
    cy.log('Deallocate resource button is not disabled because resource AllocatedResources was not requested - why???');
    cy.wait(['@AllocatedResources']);
    cy.get('[data-cy="pool-details-table"]')
      .find('tr')
      .eq(1)
      .find('td')
      .eq(5)
      .contains('button', 'Deallocate resource');
    // cy.get('[data-cy="pool-details-table"]').find('tr').eq(1).find('td').eq(5).contains('button', 'Deallocate resource').should('be.disabled');

    // Nested Pools (table)
    cy.contains('th', 'Utilized Capacity');
    cy.get('[data-cy="pool-details-nested"]').as('NestedPoolsTable');
    cy.get('@NestedPoolsTable').find('tr').eq(1).find('td').eq(1).contains('Mikoviniho'); // NAME
    cy.get('@NestedPoolsTable').find('tr').eq(1).find('td').eq(3).contains('allocating'); // POOL TYPE
    cy.get('@NestedPoolsTable').find('tr').eq(1).find('td').eq(4).contains('ipv4'); // RESOURCE TYPE
    cy.get('[data-cy="config-pool-Mikoviniho"]'); // config
    cy.get('[data-cy="delete-pool-Mikoviniho"]'); // delete

    // Danger zone
    cy.get('[data-cy="delete-resource-pool"]').should('be.disabled');

    cy.log('Let us do reload to force resource AllocatedResources to be requested');
    cy.reload();
    cy.wait(['@AllocatedResources']);
    cy.get('[data-cy="pool-details-table"]')
      .find('tr')
      .eq(1)
      .find('td')
      .eq(5)
      .contains('button', 'Deallocate resource')
      .should('be.disabled');
  });

  it('1. Create pool', () => {
    cy.contains('h1', 'Pools', { timeout: 50000 });
    cy.contains('td', 'test');
    cy.contains('td', 'ipv4');
    cy.get('[data-cy="config-pool-test"]');

    // Click Create Pool
    cy.log('Click Create Pool');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectPools')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/create-pool/select-pools.json' });
      }
    }).as('SelectPools');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectAllocationStrategies')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/create-pool/select-allocation-strategies.json' });
      }
    }).as('SelectAllocationStrategies');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectResourceTypes')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/create-pool/select-resource-types.json' });
      }
    }).as('SelectResourceTypes');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'RequiredPoolProperties')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/create-pool/required-pool-properties.json' });
      }
    }).as('RequiredPoolProperties');

    cy.get('[data-cy="create-pool-btn"]').click(); // Create pool
    cy.wait(['@SelectPools', '@SelectAllocationStrategies', '@SelectResourceTypes', '@RequiredPoolProperties']);

    cy.contains('h1', 'Create new Pool');
    cy.get('[data-cy="create-pool-nested"]').should('not.have.attr', 'data-checked'); // Nested ON/OFF is set OFF
    cy.get('[data-cy="create-pool-type"]').select('ipv4_prefix'); // Resource type*
    cy.get('[data-cy="create-pool-name"]').type('NITRA_KLOKOCINA'); // Name*
    cy.get('[data-cy="create-pool-description"]').type('2 streets Mikoviniho / Alexyho'); // Description
    cy.get('[id="downshift-0-input"]').type('suburb'); // Select tags
    // Set pool properties
    cy.get('[data-cy="device-state-address"]').type('192.168.10.1'); // address*
    cy.get('[data-cy="device-state-prefix"]').type('29'); // prefix*
    cy.get('[data-cy="device-state-subnet"]').should('not.have.attr', 'data-checked'); // subnet ON/OFF is set OFF

    // Click Create pool
    cy.log('Click Create Pool on the form');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'CreateAllocationPool')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/form-create-pool/create-allocation-pool.json' });
      }
    }).as('CreateAllocationPool');

    // Note: canceled???
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectPools')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/create-pool/select-pools.json' });
      }
    }).as('SelectPools');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/form-create-pool/get-pools.json' });
      }
    }).as('GetPools');

    cy.screenshot();
    cy.get('[data-cy="create-pool-submit"]').click(); // Create pool
    cy.wait(['@CreateAllocationPool', '@GetPools']);
    cy.contains('Successfully created resource pool').as('greenNotif'); // green notification
    cy.get('@greenNotif').should('not.exist');
    cy.screenshot();

    cy.contains('h1', 'Pools');

    cy.contains('td', 'test');
    cy.contains('td', 'ipv4');

    cy.contains('td', 'NITRA_KLOKOCINA');
    cy.contains('td', 'ipv4_prefix');
    cy.get('[data-cy="config-pool-NITRA_KLOKOCINA"]');
  });

  it('2. Claim resource', () => {
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/form-create-pool/get-pools.json' });
      }
    }).as('getPools');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetResourceTypes')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/get-resource-types.json' });
      }
    }).as('GetResourceTypes');
    cy.visit(Cypress.env('resource-manager-pools'));

    // click config button
    cy.log('Click config button');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPoolDetail')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/config/get-pool-detail.json' });
      }
    }).as('GetPoolDetail');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetResourceTypeByName')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/config/get-resource-type-by-name.json' });
      }
    }).as('GetResourceTypeByName');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AllocatedResources')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/config/allocated-resources.json' });
      }
    }).as('AllocatedResources');

    cy.get('[data-cy="config-pool-NITRA_KLOKOCINA"]').click();
    cy.wait(['@GetPoolDetail', '@GetResourceTypeByName', '@AllocatedResources']);
    cy.screenshot();

    cy.contains('h1', 'NITRA_KLOKOCINA');
    cy.contains('8 / 8'); // Utilized capacity
    // Pool properties
    cy.contains('192.168.10.1'); //
    cy.contains('29');
    cy.contains('false'); // subnet
    // Allocated Resources
    cy.contains('There are no allocated resources yet.');
    // Nested Pools
    cy.contains('There are no resource pools');
    cy.contains('a', 'Create pool');
    cy.screenshot();

    // Note when no allocation has not been done yet there is in section button 'Create pool' but it is not possible to use it for creation of nested pool !!!
    //     // click Create pool
    //     cy.contains('a', 'Create pool').click();
    //
    //     cy.contains('h1', 'Create new Pool');
    //     cy.get('[id="isNested-label"]').click();  // Nested

    // Click Claim resource
    // Going to click Claim resource button to invoke form

    cy.log('Click Claim resource');
    cy.get('[data-cy="resource-pool-claim-resource"]').click(); // Claim resource
    cy.contains('header', 'Claim resource for NITRA_KLOKOCINA');

    // Desired size (number of allocated addresses)*
    // Max number of allocated addresses can be 8
    cy.get('[data-cy="resource-pool-claim-size"]').type('4'); // Desired size (number of allocated addresses)*
    cy.get('[data-cy="resource-pool-claim-value"]').type('192.168.0.250');
    cy.get('[data-cy="resource-pool-claim-description"]').type('Mikoviniho'); // Description

    // Going to click Claim resource button on the form
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'ClaimResourceWithAltId')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/claim/claim-resource-with-alt-id.json' });
      }
    }).as('ClaimResourceWithAltId');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPoolDetail')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/claim/get-pool-detail.json' });
      }
    }).as('GetPoolDetail');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AllocatedResources')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/claim/allocated-resources.json' });
      }
    }).as('AllocatedResources');

    cy.screenshot();
    cy.log('Click Claim resource on the form');
    cy.get('[data-cy="resource-pool-claim-confirm"]').click(); // Claim resource
    //     cy.wait(['@ClaimResourceWithAltId', '@GetPoolDetail', '@AllocatedResources']);
    cy.wait(['@GetPoolDetail', '@AllocatedResources']);
    cy.contains('Successfully claimed resource from pool').as('greenNotif'); // green notification
    cy.get('@greenNotif').should('not.exist');
    cy.screenshot();

    cy.contains('h1', 'NITRA_KLOKOCINA');
    cy.contains('4 / 6'); // Utilized capacity

    // Allocated Resources (table)
    cy.get('[data-cy="pool-details-table"]').contains('192.168.10.1');
    cy.get('[data-cy="pool-details-table"]').contains('30');
    cy.get('[data-cy="pool-details-table"]').contains('Mikoviniho');
    cy.get('[data-cy="pool-details-table"]')

      .find('tr')
      .eq(1)
      .find('td')
      .eq(4)
      .contains('Show alternative ids')
      .click();
    cy.contains('header', 'Alternative Ids');
    cy.contains('button', 'Close').click();
    cy.contains('h1', 'NITRA_KLOKOCINA');
    cy.get('[data-cy="pool-details-table"]').find('tr').eq(1).find('td').eq(5).contains('Deallocate resource');

    // Nested Pools
    cy.contains('a', 'Create nested pool'); // Create nested pool
  });

  it('3. Create nested pool', () => {
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/form-create-pool/get-pools.json' });
      }
    }).as('getPools');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetResourceTypes')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/get-resource-types.json' });
      }
    }).as('GetResourceTypes');
    cy.visit(Cypress.env('resource-manager-pools'));

    // click config button
    cy.log('Click config button');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPoolDetail')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/claim/get-pool-detail.json' });
      }
    }).as('GetPoolDetail');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetResourceTypeByName')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/config/get-resource-type-by-name.json' });
      }
    }).as('GetResourceTypeByName');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AllocatedResources')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/claim/allocated-resources.json' });
      }
    }).as('AllocatedResources');

    cy.get('[data-cy="config-pool-NITRA_KLOKOCINA"]').click();
    cy.wait(['@GetPoolDetail', '@GetResourceTypeByName', '@AllocatedResources']);
    cy.screenshot();

    cy.contains('h1', 'NITRA_KLOKOCINA');
    // ???cy.contains('8 / 8');  // Utilized capacity

    // click button Create nested pool
    cy.log('Click Create nested pool');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectPools')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/create-nested/select-pools.json' });
      }
    }).as('SelectPools');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectAllocationStrategies')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/create-pool/select-allocation-strategies.json' });
      }
    }).as('SelectAllocationStrategies');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectResourceTypes')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/create-pool/select-resource-types.json' });
      }
    }).as('SelectResourceTypes');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'RequiredPoolProperties')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/create-nested/required-pool-properties.json' });
      }
    }).as('RequiredPoolProperties');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'CreateNestedAllocationPool')) {
        req.reply({
          fixture: 'resource-manager/pools/nitra_klokocina/create-nested/create-nested-allocation-pool.json',
        });
      }
    }).as('CreateNestedAllocationPool');

    cy.screenshot();

    cy.contains('a', 'Create nested pool').click(); // Create nested pool
    // cy.wait(['@SelectPools', '@RequiredPoolProperties']) // , '@CreateNestedAllocationPool', '@GetPools'
    cy.wait(['@SelectPools', '@SelectAllocationStrategies', '@SelectResourceTypes', '@RequiredPoolProperties']);

    cy.contains('h1', 'Create new Pool');
    cy.get('[data-cy="create-pool-nested"]').should('have.attr', 'data-checked'); // Nested ON/OFF is set ON
    cy.get('[data-cy="create-pool-parent"]').select('NITRA_KLOKOCINA', { timeout: 50000 }); // Parent pool*
    // cy.get('[data-cy="create-pool-parent"]').invoke("text").should("eq", "NITRA_KLOKOCINA")
    cy.contains('select', 'NITRA_KLOKOCINA');
    cy.get('[data-cy="create-pool-allocated-resources"]').select('192.168.10.1', { timeout: 50000 }); // Parent allocated resources*
    // cy.get('[data-cy="create-pool-allocated-resources"]').invoke("text").should("eq", "192.168.10.1")
    cy.contains('select', '192.168.10.1');
    cy.get('[data-cy="create-pool-type"]').select('ipv4'); // Resource type*
    cy.contains('select', 'ipv4');
    cy.get('[data-cy="create-pool-name"]').type('Mikoviniho'); // Name*
    cy.get('[data-cy="create-pool-description"]').type('Mikoviniho 4'); // Description
    // Set pool properties
    // available resources (allocated in selected parent):
    // address: 192.168.10.1, prefix: 30

    //     cy.get('[data-cy="device-state-address"]').type('192.168.10.1'); // address*
    //     cy.get('[data-cy="device-state-prefix"]').type('30'); // prefix*
    //     cy.get('[data-cy="device-state-subnet"]').should('not.have.attr', 'data-checked'); // subnet ON/OFF is set OFF

    // Click Create pool on the form
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/create-nested/get-pools.json' });
      }
    }).as('GetPools');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectPools')) {
        req.reply({ fixture: 'resource-manager/pools/nitra_klokocina/create-nested/select-pools.json' });
      }
    }).as('SelectPools');

    cy.screenshot();
    cy.log('Click Create pool on the form');
    cy.get('[data-cy="create-pool-submit"]').click(); // Create pool
    cy.wait(['@CreateNestedAllocationPool']);

    cy.url().should('eq', Cypress.env('resource-manager-pools'));
    cy.wait(['@SelectPools', '@GetPools']);

    // click config button
    cy.log('Click config button');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPoolDetail')) {
        req.reply({
          fixture: 'resource-manager/pools/nitra_klokocina/config-after-create-nested/get-pool-detail.json',
        });
      }
    }).as('GetPoolDetail');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetResourceTypeByName')) {
        req.reply({
          fixture: 'resource-manager/pools/nitra_klokocina/config-after-create-nested/get-resource-type-by-name.json',
        });
      }
    }).as('GetResourceTypeByName');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AllocatedResources')) {
        req.reply({
          fixture: 'resource-manager/pools/nitra_klokocina/config-after-create-nested/allocated-resources.json',
        });
      }
    }).as('AllocatedResources');

    cy.get('[data-cy="config-pool-NITRA_KLOKOCINA"]').click();
    cy.wait(['@GetPoolDetail']);

    cy.contains('h1', 'NITRA_KLOKOCINA');
    cy.contains('4 / 6'); // Utilized capacity

    // Allocated Resources (table)
    cy.get('[data-cy="pool-details-table"]').contains('192.168.10.1');
    cy.get('[data-cy="pool-details-table"]').contains('30');
    cy.get('[data-cy="pool-details-table"]').contains('Mikoviniho');
    cy.get('[data-cy="pool-details-table"]').find('tr').eq(1).find('td').eq(4).contains('Show alternative ids');
    cy.log('Deallocate resource button is not disabled because resource AllocatedResources was not requested - why???');
    cy.wait(['@AllocatedResources']);
    cy.get('[data-cy="pool-details-table"]')
      .find('tr')
      .eq(1)
      .find('td')
      .eq(5)
      .contains('button', 'Deallocate resource');
    // cy.get('[data-cy="pool-details-table"]').find('tr')eq(1).find('td').eq(5).contains('button', 'Deallocate resource').should('be.disabled');

    // Nested Pools (table)
    cy.contains('th', 'Utilized Capacity');
    cy.get('[data-cy="pool-details-nested"]').as('NestedPoolsTable');
    cy.get('@NestedPoolsTable').find('tr').eq(1).find('td').eq(1).contains('Mikoviniho'); // NAME
    cy.get('@NestedPoolsTable').find('tr').eq(1).find('td').eq(3).contains('allocating'); // POOL TYPE
    cy.get('@NestedPoolsTable').find('tr').eq(1).find('td').eq(4).contains('ipv4'); // RESOURCE TYPE
    cy.get('[data-cy="config-pool-Mikoviniho"]'); // config
    cy.get('[data-cy="delete-pool-Mikoviniho"]'); // delete

    // Danger zone
    // cy.get('[data-cy="delete-resource-pool"]').should('be.disabled');

    cy.log('Let us do reload to force resource AllocatedResources to be requested');
    cy.reload();
    cy.wait(['@AllocatedResources']);
    cy.get('[data-cy="pool-details-table"]')
      .find('tr')
      .eq(1)
      .find('td')
      .eq(5)
      .contains('button', 'Deallocate resource')
      .should('be.disabled');
  });
});
