/* eslint-disable no-prototype-builtins */
/* global cy,it,describe,Cypress,beforeEach */

/// <reference types="cypress" />

import { hasOperationName } from '../../helpers/utils';

describe('Check pools', () => {
  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPools')) {
        req.reply({ fixture: 'resource-manager/pools/test_ipv6/GetPools.json' });
      }
    }).as('getPools');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetResourceTypes')) {
        req.reply({ fixture: 'resource-manager/pools/GetResourceTypes' });
      }
    }).as('GetResourceTypes');
    cy.visit(Cypress.env('resource-manager-pools'));
  });

  it('Claim resource ipv6 - default values', () => {
    cy.contains('h1', 'Pools');
    cy.contains('test_ipv6');

    // Going to click test_ipv6 configure button

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPoolDetail')) {
        req.reply({ fixture: 'resource-manager/pools/test_ipv6/GetPoolDetail.json' });
      }
    }).as('GetPoolDetail');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetResourceTypeByName')) {
        req.reply({ fixture: 'resource-manager/pools/GetResourceTypes.json' });
      }
    }).as('GetResourceTypeByName');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AllocatedResources')) {
        req.reply({ fixture: 'resource-manager/create-pool/AllocatedResources.json' });
      }
    }).as('AllocatedResourcesNone');

    cy.get('[data-cy="config-pool-test_ipv6"]').click();
    cy.wait(['@GetPoolDetail', '@GetResourceTypeByName', '@AllocatedResourcesNone']);
    cy.contains('h1', 'test_ipv6');
    cy.contains('Utilized capacity');
    cy.contains('18446744073709551616 / 18446744073709551616');
    cy.contains('There are no allocated resources yet.');

    // Going to click Claim resource button to invoke form
    cy.get('[data-cy="resource-pool-claim-resource"]').click();
    cy.contains('header', 'Claim resource for test_ipv6');

    // Going to click Claim resource button on the form

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'ClaimResourceWithAltId')) {
        req.reply({ fixture: 'resource-manager/pools/test_ipv6/claim1/ClaimResourceWithAltId.json' });
      }
    }).as('ClaimResourceWithAltId');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPoolDetail')) {
        req.reply({ fixture: 'resource-manager/pools/test_ipv6/claim1/GetPoolDetail.json' });
      }
    }).as('GetPoolDetail');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AllocatedResources')) {
        req.reply({ fixture: 'resource-manager/pools/test_ipv6/claim1/AllocatedResourcesOne.json' });
      }
    }).as('AllocatedResourcesOne');

    cy.get('[data-cy="resource-pool-claim-confirm"]').click();
    cy.wait(['@ClaimResourceWithAltId', '@GetPoolDetail', '@AllocatedResourcesOne']);

    cy.contains('h1', 'test_ipv6');
    cy.contains('Utilized capacity');
    cy.contains('18446744073709551616 / 18446744073709551617');
    // TODO Zeleny box
    cy.contains('Successfully claimed resource from pool');
    cy.wait(3000);

    // TODO check this in table
    cy.contains('action').parent().parent().parent().contains('2001:db8:1::');

    // Going to click Deallocate resource in the table
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'FreeResource')) {
        req.reply({ fixture: 'resource-manager/allocate/FreeResource.json' });
      }
    }).as('FreeResource');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AllocatedResources')) {
        req.reply({ fixture: 'resource-manager/create-pool/AllocatedResources.json' });
      }
    }).as('AllocatedResourcesNone');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPoolDetail')) {
        req.reply({ fixture: 'resource-manager/pools/test_ipv6/GetPoolDetail.json' });
      }
    }).as('GetPoolDetail');

    cy.contains('action')
      .parent()
      .parent()
      .parent()
      .contains('2001:db8:1::')
      .parent()
      .find('td')
      .eq(3)
      .find('button')
      .contains('Deallocate resource')
      .click();
    cy.wait(['@FreeResource', '@AllocatedResourcesNone', '@GetPoolDetail']);
    cy.contains('Utilized capacity');
    cy.contains('18446744073709551616 / 18446744073709551616');
    cy.contains('There are no allocated resources yet.');
    // TODO Zeleny box
    cy.contains('Successfully freed resource from pool');
    cy.wait(3000);
  });

  it('Claim resource ipv6 - filled in values', () => {
    cy.contains('h1', 'Pools');
    cy.contains('test_ipv6');

    // Going to click test_ipv6 configure button

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPoolDetail')) {
        req.reply({ fixture: 'resource-manager/pools/test_ipv6/GetPoolDetail.json' });
      }
    }).as('GetPoolDetail');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetResourceTypeByName')) {
        req.reply({ fixture: 'resource-manager/pools/GetResourceTypes.json' });
      }
    }).as('GetResourceTypeByName');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AllocatedResources')) {
        req.reply({ fixture: 'resource-manager/create-pool/AllocatedResources.json' });
      }
    }).as('AllocatedResourcesNone');

    cy.get('[data-cy="config-pool-test_ipv6"]').click();
    cy.wait(['@GetPoolDetail', '@GetResourceTypeByName', '@AllocatedResourcesNone']);
    cy.contains('h1', 'test_ipv6');
    cy.contains('Utilized capacity');
    cy.contains('18446744073709551616 / 18446744073709551616');
    cy.contains('There are no allocated resources yet.');

    // Going to click Claim resource button to invoke form
    cy.get('[data-cy="resource-pool-claim-resource"]').click();
    cy.contains('header', 'Claim resource for test_ipv6');

    //Desired value (optional input)
    //Set specific value that you want to allocate from test_ipv6
    //Your address should be between 2001:db8:1:: and 2001:db8:1::ffff:ffff:ffff:ffff.
    cy.get('[data-cy="resource-pool-claim-value"]').type('2001:db8:1::fffa:fffb:fffc:fffd');
    cy.get('[data-cy="resource-pool-claim-description"]').type('MIKOVINIHO4 NITRA 94911');

    // Going to click Claim resource button on the form

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'ClaimResourceWithAltId')) {
        req.reply({ fixture: 'resource-manager/pools/test_ipv6/claim2/ClaimResourceWithAltId.json' });
      }
    }).as('ClaimResourceWithAltId');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPoolDetail')) {
        req.reply({ fixture: 'resource-manager/pools/test_ipv6/claim2/GetPoolDetail.json' });
      }
    }).as('GetPoolDetail');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AllocatedResources')) {
        req.reply({ fixture: 'resource-manager/pools/test_ipv6/claim2/AllocatedResourcesOtherOne.json' });
      }
    }).as('AllocatedResourcesOtherOne');

    cy.get('[data-cy="resource-pool-claim-confirm"]').click();
    cy.wait(['@ClaimResourceWithAltId', '@GetPoolDetail', '@AllocatedResourcesOtherOne']);

    cy.contains('h1', 'test_ipv6');
    cy.contains('Utilized capacity');
    cy.contains('18446744073709551616 / 18446744073709551617');
    // TODO Zeleny box
    cy.contains('Successfully claimed resource from pool');
    cy.wait(3000);

    // TODO check this in table
    cy.contains('action').parent().parent().parent().contains('2001:db8:1::fffa:fffb:fffc:fffd');
    cy.contains('action').parent().parent().parent().contains('MIKOVINIHO4 NITRA 94911');

    // Going to click Deallocate resource in the table
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'FreeResource')) {
        req.reply({ fixture: 'resource-manager/allocate/FreeResource.json' });
      }
    }).as('FreeResource');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AllocatedResources')) {
        req.reply({ fixture: 'resource-manager/create-pool/AllocatedResources.json' });
      }
    }).as('AllocatedResourcesNone');

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPoolDetail')) {
        req.reply({ fixture: 'resource-manager/pools/test_ipv6/GetPoolDetail.json' });
      }
    }).as('GetPoolDetail');

    cy.contains('action')
      .parent()
      .parent()
      .parent()
      .contains('2001:db8:1::fffa:fffb:fffc:fffd')
      .parent()
      .find('td')
      .eq(3)
      .find('button')
      .contains('Deallocate resource')
      .click();
    cy.wait(['@FreeResource', '@AllocatedResourcesNone', '@GetPoolDetail']);
    cy.contains('Utilized capacity');
    cy.contains('18446744073709551616 / 18446744073709551616');
    cy.contains('There are no allocated resources yet.');
    // TODO Zeleny box
    cy.contains('Successfully freed resource from pool');
    cy.wait(3000);
  });
});
