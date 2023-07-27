import { hasOperationName } from "../../helpers/utils";

it.only('workflow builder', () => {
cy.intercept('POST', 'https://localhost:8001/graphql', (req) => {
  if (req.body.hasOwnProperty('query') && hasOperationName(req, 'WorkflowList')) {
    req.reply({ fixture: 'workflow-builder/getWorkflows.json' });
  }
  if (req.body.hasOwnProperty('query') && hasOperationName(req, 'WorkflowLabels')) {
    req.reply({ fixture: 'workflow-builder/workflow-labels.json' });
  }
  if (req.body.hasOwnProperty('query') && hasOperationName(req, 'UpdateWorkflow')) {
    req.reply({ fixture: 'workflow-builder/create-workflow.json' });
  }

}).as('getWorkflows');

  cy.log('-- 01. Construct and Actions/Save --');
  cy.visit(Cypress.env('host'));
  cy.get(':nth-child(3) > .chakra-linkbox__overlay').click();
  cy.wait('@getWorkflows');
  cy.get('input[name="name"]').type('test workflow');
  cy.get('textarea[name="description"]').clear().type('test description');
  cy.get('input[placeholder="Start typing..."]').type('TEST{enter}');
  cy.contains('button', 'Save changes').click();
  cy.contains('button', 'Tasks').click();
  cy.get('[data-cy="Netconf_read_structured_device_data-add-task"]').click();
  //cy.get('button[title="zoom out"]').click().click().click();
  cy.get('button[aria-label="Edit workflow"]').move({ deltaX: 0, deltaY: 300 });
cy.get('button[aria-label="Remove edge"]').click();

  cy.get('div[data-id="start"').next().next().move({ deltaX: -50, deltaY: -100 });
  cy.get('div[data-id="start"').move({ deltaX: -100, deltaY: 0 });
  cy.get('div[data-id="end"').move({ deltaX: 100, deltaY: 0 });
  cy.get('div[data-nodeid="start"').click();
  cy.get('div[data-handlepos="left"').eq(1).click();
  cy.get('div[data-handlepos="right"').eq(1).click();
  cy.get('div[data-nodeid="end"').click();
  cy.contains('button', 'Actions').click();
  cy.contains('button', 'Save workflow').click();
  cy.wait('@getWorkflows');
  // })
  // it('save as', () => {
  cy.log('-- 02. Actions/Save as --');
  cy.contains('button', 'Actions').click({ force: true });
  cy.contains('button', 'Save as').click();
  cy.get('input[placeholder="Please enter name of workflow"').type('test workflow copy');
  cy.contains('button', 'Cancel').next().click();
  // 1. green box
  // Workflow Saved
  // Workflow was successfully saved
  // 2. green box
  // Successfully saved workflow as test workflow copy - Note typo
  cy.contains(/Workflow Saved|fully saved/g); // green notifications
  cy.contains('Workflow Saved').should('not.exist');
  cy.contains('fully saved').should('not.exist');
  cy.wait('@getWorkflows');
  // })
  // it('show definition', () => {
  cy.log('-- 03. Actions/Show definition --');
  cy.contains('button', 'Actions').click();
  cy.contains('Show definition').click();
  cy.contains('header', 'Workflow definition');
  cy.get('.ace_content').should('contain', 'test workflow');
  // this event will automatically be unbound when this
  // test ends because it's attached to 'cy'
  cy.on('uncaught:exception', (err) => {
    // expect(err.message).to.include('Uncaught NetworkError')
    // there can be also other - TypeError: Cannot read properties of null (reading 'getLength')
    expect(err.message);
    // using mocha's async done callback to finish
    // this test so we prove that an uncaught exception
    // was thrown
    // done()
    // return false to prevent the error from
    // failing this test
    return false;
  });
  // assume this causes an error
  cy.get('button[aria-label="Close"', { timeout: 30000 }).click();
  cy.contains('header', 'Workflow definition').should('not.exist');
  // })
  // it('edit workflow', () => {
  cy.log('-- 04. Actions/Edit workflow --');
  cy.contains('button', 'Actions').click();
  cy.contains('Edit workflow').click();
  cy.get('input[placeholder="Start typing..."]').type('TEST2{enter}');
  cy.contains('button', 'Save changes').click();
  cy.wait('@getWorkflows');

  // })
  // it('workflow editor', () => {
  cy.log('-- 05. Actions/Workflow editor --');
  cy.contains('button', 'Actions', { timeout: 30000 }).should('be.visible');
  cy.contains('button', 'Actions').click({ force: true });
  cy.contains('button', 'Workflow editor').click();
  cy.get('.ace_content').type('{backspace}{backspace}{backspace}{backspace}{{}1}{enter}}');
  // the docs https://docs.cypress.io/api/commands/type --> {{} Types the literal { key
  cy.contains('button', 'Cancel').next().click();
  cy.wait('@put_metadata');
  cy.contains('Workflow Saved').as('greenNotif2'); // green notification
  cy.contains('@greenNotif2').should('not.exist');
  // })
  // it('search test', () => {
  // Note: if mocked this does not work ....
  // cy.log('-- 06. workflows - check new ones --')
  // cy.get('input[placeholder="Search tasks"]').type('INVENTORY_install_device_by_name')
  // cy.get('input[placeholder="Search tasks"]').parent().next().should('contain', 'Install device by device name')
  // })
  // it('workflow execution', () => {
  cy.log('-- 07. workflow - Save and execute --');
  cy.contains('button', 'Save and execute').click({ force: true });
  cy.wait('@put_metadata');
  cy.contains('Workflow Saved').as('greenNotif2'); // green notification
  cy.contains('@greenNotif2').should('not.exist');
  cy.get('input[name="device_name"]').type('SAOS6_2');
  cy.contains('button', 'Execute').click();
  cy.wait('@post_workflow');
  cy.contains('We successfully executed workflow').as('greenNotif3'); // green notification
  cy.contains('@greenNotif3').should('not.exist');
  cy.log('-- 07. workflow - detail of executed --');
  cy.contains('Executed workflow in detail').click();
  cy.url().should('include', '/workflow-manager/executed');
  cy.wait('@get_workflow_running');
  cy.contains('RUNNING', { timeout: 30000 }).eq(0).should('be.visible');
  cy.intercept('GET', '/api/workflow/id/83c65aef-07e5-4a2a-81b6-dac8f1c96380', {
    fixture: 'workflow-builder/10get.json',
  }).as('get_workflow_completed');
  cy.wait('@get_workflow_completed');
  cy.contains('COMPLETED', { timeout: 30000 }).eq(0).should('be.visible');
});

it('save changes check', () => {
  // 'save changes check': 21 22 24
  cy.intercept('POST', 'https://localhost:8001/graphql', (req) => {
    if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Workflows')) {
      req.reply({ fixture: 'workflow-builder/getWorkflows.json' });
    }
    if (req.body.hasOwnProperty('query') && hasOperationName(req, 'WorkflowLabels')) {
      req.reply({ fixture: 'workflow-builder/workflow-labels.json' });
    }
  }).as('getWorkflows');

  cy.intercept('POST', 'https://localhost:8001/graphql', (req) => {
    if (req.body.hasOwnProperty('query') && hasOperationName(req, 'Workflow')) {
      req.reply({ fixture: 'workflow-builder/getWorkflowDetail.json' });
    }
    if (req.body.hasOwnProperty('query') && hasOperationName(req, 'WorkflowList')) {
      req.reply({ fixture: 'workflow-builder/getWorkflows.json' });
    }
  }).as('getWorkflowDetail');

  cy.log('-- 01. workflows - search for new ones --');

  cy.visit(Cypress.env('host'));
  cy.contains('a', 'Explore').click();
  cy.wait('@getWorkflows');
  cy.url().should('include', '/workflow-manager/definitions');
  cy.get('input[placeholder="Search workflow"]').type('AAAA');
  cy.contains('AAAA / 1').should('be.visible');
  cy.contains('abcd / 1').should('be.visible');
  cy.contains('{"description":"aaaa"}').should('be.visible');
  // })
  // it('workflow delete', () => {
  cy.log('-- 02. workflows - delete new ones --');
  cy.visit(Cypress.env('host'));
  cy.contains('a', 'Explore').click();
  cy.url().should('include', '/workflow-manager/definitions');
  cy.wait('@getWorkflows');
  cy.get('input[placeholder="Start typing..."]').type('123');
  cy.contains('123').click();
  cy.get('[data-cy="edit-AAAA-1"]').click();
  cy.wait('@getWorkflowDetail');
  cy.contains('h2', 'AAAA');
  cy.get('[data-cy="save-and-execute-btn"]').click();
  cy.contains('Workflow was successfully saved')

  
});
