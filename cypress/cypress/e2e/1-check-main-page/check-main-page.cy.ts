/* global cy,it,describe,Cypress,beforeEach */

/// <reference types="cypress" />

describe('check main page of Frinx-machine', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('host'));
  });

  it('Check title of the main page', () => {
    cy.title().should('eq', 'FRINX Dashboard');
  });
});
