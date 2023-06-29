/* eslint-disable no-prototype-builtins */
/* global cy,it,describe,Cypress,beforeEach */

/// <reference types="cypress" />

import { hasOperationName } from '../../helpers/utils';

Cypress.on('uncaught:exception', () => {
  return false;
});

describe('Check pools', () => {
  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetAllPools')) {
        req.reply({ fixture: 'resource-manager/pools/preset1/get-pools.json' });
      }
    }).as('getPools');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetResourceTypes')) {
        req.reply({ fixture: 'resource-manager/pools/preset1/get-resource-types.json' });
      }
    }).as('GetResourceTypes');

    cy.visit(Cypress.env('resource-manager-pools'));
  });

  it('Check', () => {
    cy.contains('h1', 'Pools');
    cy.get('table').find('tr').should('have.length', 21);
  });

  it.skip('Search by name', () => {
    cy.contains('h1', 'Pools');
    cy.get('table').find('tr').should('have.length', 21);

    cy.get('[data-cy="search-by-name"]').type('ga '); // Search by name
    cy.contains('table tr td', 'ga ');
    cy.get('table').find('tr').should('have.length', 2);
  });

  it('Search by name (workaround)', () => {
    // Note: after clicking of  detail of some pool -> searching fixed (workaround)

    cy.contains('h1', 'Pools');
    // TODO
    cy.get('table').find('tr').should('have.length', 21);

    // click config button
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPoolDetail')) {
        req.reply({ fixture: 'resource-manager/pools/ga/get-pool-detail.json' });
      }
    }).as('GetPoolDetail');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetResourceTypeByName')) {
        req.reply({ fixture: 'resource-manager/pools/preset1/get-resource-types.json' });
      }
    }).as('GetResourceTypeByName');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AllocatedResources')) {
        req.reply({ fixture: 'resource-manager/pools/ga/allocated-resources.json' });
      }
    }).as('AllocatedResources');
    cy.get('[data-cy="config-pool-ga"]').click();

    // TODO etc.
    cy.contains('a', 'Pools').click(); // menu item Pools
    cy.get('[data-cy="search-by-name"]').type('ga '); // Search by name
    cy.get('[data-cy="Search-btn"]').click();
    cy.contains('table tr td', 'ga');
    cy.get('table').find('tr').should('have.length', 2);

    cy.get('[data-cy="search-by-name"]').clear(); // Search by name
    cy.get('[data-cy="search-by-name"]').type('roma'); // Search by name
    cy.get('[data-cy="Search-btn"]').click();

    cy.get('table').find('tr').should('have.length', 4);

    // Note: not clear search by name input - add more chars to search
    cy.get('[data-cy="search-by-name"]').type(' ga'); // Search by name
    cy.get('table')
      .find('tr')
      .should('have.length', 3 + 1);

    cy.get('[data-cy="clear-all-btn"]').click(); // Clear all
    cy.get('table').find('tr').should('have.length', 21);
  });

  it('Select resource type to filter', () => {
    cy.contains('h1', 'Pools');
    cy.get('table').find('tr').should('have.length', 21);

    // Select resource type to filter

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetAllPools')) {
        req.reply({ fixture: 'resource-manager/filters/filter-vlan.json' });
      }
    });

    cy.get('[data-cy="select-resource-type"]').select('vlan');
    cy.get('[data-cy="Search-btn"]').click();
    cy.get('table').find('tr').should('have.length', 4);

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetAllPools')) {
        req.reply({ fixture: 'resource-manager/filters/filter-ipv6prefix.json' });
      }
    });

    cy.get('[data-cy="select-resource-type"]').select('ipv6_prefix'); // Select resource type to filter
    cy.get('[data-cy="Search-btn"]').click();

    cy.get('table')
      .find('tr')
      .should('have.length', 1 + 2);

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetAllPools')) {
        req.reply({ fixture: 'resource-manager/filters/filter-vlan-range.json' });
      }
    });
    cy.get('[data-cy="select-resource-type"]').select('vlan_range'); // Select resource type to filter
    cy.get('[data-cy="Search-btn"]').click();

    cy.get('table')
      .find('tr')
      .should('have.length', 1 + 3);

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetAllPools')) {
        req.reply({ fixture: 'resource-manager/filters/filter-ipv4.json' });
      }
    });
    cy.get('[data-cy="select-resource-type"]').select('ipv4'); // Select resource type to filter
    cy.get('[data-cy="Search-btn"]').click();

    cy.get('table')
      .find('tr')
      .should('have.length', 1 + 4);

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetAllPools')) {
        req.reply({ fixture: 'resource-manager/filters/filter-ipv4prefix.json' });
      }
    });
    cy.get('[data-cy="select-resource-type"]').select('ipv4_prefix'); // Select resource type to filter
    cy.get('[data-cy="Search-btn"]').click();

    cy.get('table')
      .find('tr')
      .should('have.length', 1 + 3);

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetAllPools')) {
        req.reply({ fixture: 'resource-manager/filters/filter-uniqueid.json' });
      }
    });
    cy.get('[data-cy="select-resource-type"]').select('unique_id'); // Select resource type to filter
    cy.get('[data-cy="Search-btn"]').click();

    cy.get('table')
      .find('tr')
      .should('have.length', 1 + 1);

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetAllPools')) {
        req.reply({ fixture: 'resource-manager/filters/filter-random-signed.json' });
      }
    });
    cy.get('[data-cy="select-resource-type"]').select('random_signed_int32'); // Select resource type to filter
    cy.get('[data-cy="Search-btn"]').click();

    cy.get('table')
      .find('tr')
      .should('have.length', 1 + 2);

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetAllPools')) {
        req.reply({ fixture: 'resource-manager/filters/filter-ipv6.json' });
      }
    });
    cy.get('[data-cy="select-resource-type"]').select('ipv6'); // Select resource type to filter
    cy.get('[data-cy="Search-btn"]').click();

    cy.contains('tr', 'There are no resource pools');
    cy.get('table')
      .find('tr')
      .should('have.length', 1 + 1);

    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetAllPools')) {
        req.reply({ fixture: 'resource-manager/filters/filter-route-distinguisher.json' });
      }
    });
    cy.get('[data-cy="select-resource-type"]').select('route_distinguisher'); // Select resource type to filter
    cy.get('[data-cy="Search-btn"]').click();

    cy.get('table')
      .find('tr')
      .should('have.length', 1 + 2);

    cy.get('[data-cy="clear-all-btn"]').click(); // Clear all
    cy.get('table').find('tr').should('have.length', 21);
  });

  it('Click tag to filter', () => {
    cy.contains('h1', 'Pools');
    cy.get('table').find('tr').should('have.length', 21);

    // click tag
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetAllPools')) {
        req.reply({ fixture: 'resource-manager/filters/tag-ga.json' });
      }
    });
    cy.get('[data-cy="pool-ga-ga"]').click(); // in column TAGS click a tag
    cy.get('table')
      .find('tr')
      .should('have.length', 1 + 1);
    cy.get('[data-cy="clear-all-btn"]').click(); // Clear all
    cy.get('table').find('tr').should('have.length', 21);

    // click tag
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetAllPools')) {
        req.reply({ fixture: 'resource-manager/filters/tag-tt.json' });
      }
    });
    cy.get('[data-cy="pool-tt-tt"]').click(); // in column TAGS click a tag
    cy.get('table')
      .find('tr')
      .should('have.length', 1 + 1);
    cy.contains('button', 'Clear tags').click(); // Clear tags
    cy.get('table').find('tr').should('have.length', 21);

    // click tag
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetAllPools')) {
        req.reply({ fixture: 'resource-manager/filters/tag-tt.json' });
      }
    });
    cy.get('[data-cy="pool-tt-tt"]').click(); // in column TAGS click a tag
    cy.get('table')
      .find('tr')
      .should('have.length', 1 + 1);
    cy.get('[data-cy="pool-tt-tt"]').click(); // in column TAGS click a tag
    cy.get('table').find('tr').should('have.length', 21);
  });

  it('Display children', () => {
    cy.contains('h1', 'Pools');
    cy.get('table').find('tr').should('have.length', 21);

    cy.contains('table tr td', 'ga');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetNestedPoolsDetail')) {
        req.reply({ fixture: 'resource-manager/pools/ga/get-nested-pools-detail.json' });
      }
    }).as('GetNestedPoolsDetail');
    cy.get('[data-cy="pool-ga-children"]').click(); // click CHILDREN for ga pool
    cy.contains('h2', 'Nested pools');
    cy.get('table').eq(0).contains('tr td', 'ga');
    cy.get('table').eq(0).find('tr').should('have.length', 2);
    cy.get('table').eq(1).contains('tr td', 'mik');
    cy.get('table').eq(1).contains('tr td', 'alex');
    cy.get('table').eq(1).find('tr').should('have.length', 3);
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetNestedPoolsDetail')) {
        req.reply({ fixture: 'resource-manager/pools/ga/get-nested-pools-detail2.json' });
      }
    }).as('GetNestedPoolsDetail');
    cy.get('[data-cy="pool-alex-children"]').click(); // click CHILDREN for alex child pool
    cy.contains('h2', 'Nested pools');
    cy.get('table').eq(0).contains('tr td', 'alex');
    cy.get('table').eq(0).find('tr').should('have.length', 2);
    cy.get('table').eq(1).contains('tr td', 'alex 4');
    cy.get('table').eq(1).find('tr').should('have.length', 2);
  });

  it('Pool detail page - Search by alternative id', () => {
    cy.contains('h1', 'Pools');

    // click config button
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPoolDetail')) {
        req.reply({ fixture: 'resource-manager/pools/ga/get-pool-detail.json' });
      }
    }).as('GetPoolDetail');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetResourceTypeByName')) {
        req.reply({ fixture: 'resource-manager/pools/preset1/get-resource-types.json' });
      }
    }).as('GetResourceTypeByName');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AllocatedResources')) {
        req.reply({ fixture: 'resource-manager/pools/ga/allocated-resources.json' });
      }
    }).as('AllocatedResources');
    cy.get('[data-cy="config-pool-ga"]').click();

    cy.contains('h1', 'ga');

    cy.contains('button', 'Show alternative ids').eq(0).click();
    cy.contains('header', 'Alternative Ids');
    cy.contains('table tr td', 'alfa');
    cy.contains('button', 'Close').click();
    cy.contains('h1', 'ga');

    // Allocated Resources - table
    cy.get('[data-cy="pool-details-table"]')
      .find('tr')
      .should('have.length', 1 + 3);

    // Allocated Resources
    // By clicking at the Add alternative id button you can add alternative id by which you can filter allocated resources
    cy.get('[data-cy="resource-pool-alternative-id"]').click(); // Add alternative id
    // appears following controls: Key Value etc
    cy.get('[data-cy="resource-pool-claim-key-0"]').clear(); // Key:
    cy.get('[data-cy="resource-pool-claim-key-0"]').type('alfa'); // Key:
    cy.get('[data-cy="resource-pool-tag-active"]').click(); // Value: [x] active - click to remove
    // cy.get('[data-cy="resource-pool-label-value"]').type('');  // Value (press Enter to add value)
    cy.get('[data-cy="alternative-id-0"]').click(); // Delete Alternative Id

    // Allocated Resources
    // By clicking at the Add alternative id button you can add alternative id by which you can filter allocated resources
    cy.get('[data-cy="resource-pool-alternative-id"]').click(); // Add alternative id
    // appears following controls: Key Value etc
    cy.get('[data-cy="resource-pool-claim-key-0"]').clear(); // Key:
    cy.get('[data-cy="resource-pool-claim-key-0"]').type('alfa'); // Key:
    cy.get('[data-cy="resource-pool-tag-active"]').click(); // Value: [x] active - click to remove
    // cy.get('[data-cy="resource-pool-label-value"]').type('');  // Value (press Enter to add value)
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AllocatedResources')) {
        req.reply({ fixture: 'resource-manager/pools/ga/alfa/allocated-resources.json' });
      }
    }).as('AllocatedResources');
    cy.get('[data-cy="resource-pool-search-by-id"]').click(); // Search by alternative id
    // Allocated Resources - table
    cy.get('[data-cy="pool-details-table"]')
      .find('tr')
      .should('have.length', 1 + 1);

    cy.get('[data-cy="resource-pool-claim-key-0"]').should('not.exist'); // Key:
    cy.get('[data-cy="resource-pool-search-by-id"]').click(); // Search by alternative id
    // Allocated Resources - table
    cy.get('[data-cy="pool-details-table"]')
      .find('tr')
      .should('have.length', 1 + 3);
  });

  it('Pool detail page - Nested pools detail page - Allocated Resources - pager', () => {
    cy.contains('h1', 'Pools');

    // click config button
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPoolDetail')) {
        req.reply({ fixture: 'resource-manager/pools/ga/get-pool-detail.json' });
      }
    }).as('GetPoolDetail');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetResourceTypeByName')) {
        req.reply({ fixture: 'resource-manager/pools/preset1/get-resource-types.json' });
      }
    }).as('GetResourceTypeByName');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AllocatedResources')) {
        req.reply({ fixture: 'resource-manager/pools/ga/allocated-resources.json' });
      }
    }).as('AllocatedResources');
    cy.get('[data-cy="config-pool-ga"]').click();

    cy.contains('h1', 'ga');

    // Nested Pools
    cy.contains('h2', 'Nested Pools');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPoolDetail')) {
        req.reply({ fixture: 'resource-manager/pools/mik/get-pool-detail.json' });
      }
    }).as('GetPoolDetail');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AllocatedResources')) {
        req.reply({ fixture: 'resource-manager/pools/mik/allocated-resources.json' });
      }
    }).as('AllocatedResources');
    cy.get('[data-cy="config-pool-mik"]').click(); // click config button of mik pool

    cy.contains('h1', 'mik');
    cy.contains('0 / 16'); // Utilized capacity
    cy.get('[data-cy="resource-pool-claim-resource"]').should('be.disabled'); // Claim resource
    // Allocated Resources - table
    cy.get('[data-cy="pool-details-table"]')
      .find('tr')
      .should('have.length', 1 + 10);
    cy.contains('p', 'Previous');
    cy.contains('button', 'Next');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AllocatedResources')) {
        req.reply({ fixture: 'resource-manager/pools/mik/allocated-resources_page2.json' });
      }
    }).as('AllocatedResources');
    cy.contains('button', 'Next').click(); // Next
    // Allocated Resources - table
    cy.get('[data-cy="pool-details-table"]')
      .find('tr')
      .should('have.length', 1 + 6);
    cy.contains('button', 'Previous');
    cy.contains('p', 'Next');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AllocatedResources')) {
        req.reply({ fixture: 'resource-manager/pools/mik/allocated-resources.json' });
      }
    }).as('AllocatedResources');
    cy.contains('button', 'Previous').click(); // Previous
    // Allocated Resources - table
    cy.get('[data-cy="pool-details-table"]')
      .find('tr')
      .should('have.length', 1 + 10);
    cy.contains('p', 'Previous');
    cy.contains('button', 'Next');
  });

  it('IPAM / IPAM', () => {
    cy.contains('h1', 'Pools');
    cy.get('table').find('tr').should('have.length', 21);

    cy.contains('button span', 'IPAM').click({ force: true });
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetAllIPPools')) {
        req.reply({ fixture: 'resource-manager/pools/ipam/ipam-pools.json' });
      }
    }).as('GetAllIPPools');
    cy.contains('a', 'IPAM').click();
    cy.contains('h1', 'Pools');
    cy.get('table')
      .find('tr')
      .should('have.length', 1 + 3);

    // try if controls work as expected
    // Click Create Pool
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectPools')) {
        req.reply({ fixture: 'resource-manager/pools/ipam/select-pools.json' });
      }
    }).as('SelectPools');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectAllocationStrategies')) {
        req.reply({ fixture: 'resource-manager/pools/select-allocation-strategies.json' });
      }
    }).as('SelectAllocationStrategies');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'SelectResourceTypes')) {
        req.reply({ fixture: 'resource-manager/pools/ipam/select-resource-types.json' });
      }
    }).as('SelectResourceTypes');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'RequiredPoolProperties')) {
        req.reply({ fixture: 'resource-manager/pools/create/required-pool-properties.json' });
      }
    }).as('RequiredPoolProperties');
    cy.get('[data-cy="create-pool-btn"]').click(); // Create Pool
    cy.contains('h1', 'Create new Pool');
    cy.get('[data-cy="create-pool-type"]')
      .find('option')
      .then((options) => {
        const actual = Array.from(options).map((o) => o.text);
        // console.log(options);
        // console.log(actual);
        // console.log(['Select resource type', 'ipv6_prefix', 'ipv4', 'ipv4_prefix', 'ipv6']);
        expect(actual).to.deep.eq(['Select resource type', 'ipv6_prefix', 'ipv4', 'ipv4_prefix', 'ipv6']);
      });
  });

  it('IPAM / Aggregates', () => {
    cy.contains('h1', 'Pools');
    cy.get('table').find('tr').should('have.length', 21);

    cy.contains('button span', 'IPAM').click({ force: true });
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetIpPools')) {
        req.reply({ fixture: 'resource-manager/pools/ipam/get-ip-pools.json' });
      }
    }).as('GetIpPools');
    // cy.contains('a', 'Aggregates').click();
    // TODO
  });

  it('IPAM / IP Ranges', () => {
    cy.contains('h1', 'Pools');
    cy.get('table').find('tr').should('have.length', 21);

    cy.contains('button span', 'IPAM').click({ force: true });
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetResourceTypes')) {
        req.reply({ fixture: 'resource-manager/pools/preset1/get-resource-types.json' });
      }
    }).as('GetResourceTypes');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPoolIpRanges')) {
        req.reply({ fixture: 'resource-manager/pools/ipam/get-pool-ip-ranges.json' });
      }
    }).as('GetPoolIpRanges');
    cy.contains('a', 'IP Ranges').click();
    cy.contains('h1', 'IP Ranges');
    cy.get('table')
      .find('tr')
      .should('have.length', 1 + 5);

    // click tag
    cy.get('[data-cy="range-tag-ga"]').click(); // in column TAGS click a tag
    cy.get('table')
      .find('tr')
      .should('have.length', 1 + 1);
    cy.get('[data-cy="clear-all-btn"]').click(); // Clear all
    cy.get('table')
      .find('tr')
      .should('have.length', 1 + 5);

    // click tag
    cy.get('[data-cy="range-tag-tt"]').click(); // in column TAGS click a tag
    cy.get('table')
      .find('tr')
      .should('have.length', 1 + 1);
    cy.contains('button', 'Clear tags').click(); // Clear tags
    cy.get('table')
      .find('tr')
      .should('have.length', 1 + 5);

    // click ip address - ga & tt pools are nested -> there are clickable IPs
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'GetPoolDetail')) {
        req.reply({ fixture: 'resource-manager/pools/ga/get-pool-detail.json' });
      }
    }).as('GetPoolDetail');
    cy.intercept('POST', 'http://localhost:3000/api/resource', (req) => {
      if (req.body.hasOwnProperty('query') && hasOperationName(req, 'AllocatedResources')) {
        req.reply({ fixture: 'resource-manager/pools/ga/allocated-resources.json' });
      }
    }).as('AllocatedResources');
    cy.contains('td', 'ga').parent().find('td a').first().click();
    cy.contains('h1', 'IP Ranges of ga');
    cy.url().should('include', '/nested-ranges');
    cy.contains('table tr td', 'alex');
    cy.screenshot();
  });
});
