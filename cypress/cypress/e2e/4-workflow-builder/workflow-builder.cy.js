/* global cy,it,describe,Cypress */

describe('Create workflow, test and delete it', () => {
  function clickOnButtons () {
    cy.contains('button', 'Actions').click()
    cy.contains('button', 'Save workflow').click()
  }

  function deleteButton () {
    cy.contains('button', 'Actions').click()
    cy.contains('button', 'Delete workflow').click()
    cy.contains('header', 'Delete workflow').should('be.visible')
    // Note: here we need to use regexp to identify button "Delete" because
    //       there is also detached button "Delete workflow" which is ALSO intercepted by cy.contains('button', 'Delete')
    //       in case that we do not use explicit wait !!!
    cy.contains('button', /Delete$/).click()
    // Note: this also works: cy.contains('button', 'Cancel').next().contains('button', 'Delete').click()
  }

  it('workflow builder', () => {
    // 'workflow builder': 1 && 'save changes check': 32
    cy.intercept('GET', '/api/workflow/metadata/workflow', { fixture: 'workflow-builder/00get.json', }).as('get_metadata')
    // 'workflow builder': 2  && 'save changes check': 25, 30
    cy.intercept('GET', '/api/workflow/metadata/taskdefs', { fixture: 'workflow-builder/00get_taskdef.json', }).as('get_taskdef')
    // 'workflow builder': 3 4 5 6 7
    cy.intercept('PUT', '/api/workflow/metadata/workflow', { fixture: 'workflow-builder/01put.json', }).as('put_metadata')
    // 'workflow builder': 8
    cy.intercept('POST', '/api/workflow/workflow', { fixture: 'workflow-builder/08post.json', }).as('post_workflow')
    // 'workflow builder': 9 RUNNING
    cy.intercept('GET', '/api/workflow/id/83c65aef-07e5-4a2a-81b6-dac8f1c96380', { fixture: 'workflow-builder/09get.json', }).as('get_workflow_running')
    // 'workflow builder': 10 COMPLETED
    // cy.intercept('GET', '/api/workflow/id/83c65aef-07e5-4a2a-81b6-dac8f1c96380', { fixture: 'workflow-builder/10get.json', }).as('get_workflow_completed')

    cy.log('-- 01. Construct and Actions/Save --')
    cy.visit(Cypress.env('host'))
    cy.get(':nth-child(3) > .chakra-linkbox__overlay').click()
    cy.wait('@get_metadata')
    cy.wait('@get_taskdef')

    cy.get('input[name="name"]').type('test workflow')
    cy.get('input[name="description"]').clear().type('test description')
    cy.get('input[placeholder="Add Labels (press Enter to add)"]').type('TEST{enter}')
    cy.contains('button', 'Save changes').click()
    cy.contains('button', 'Tasks').click()
    cy.contains('Install device by device name').parent().next().click()
    cy.get('button[title="zoom out"]').click().click().click()
    cy.get('div[data-id="start"').next().next().move({ deltaX: -50, deltaY: -100 })
    cy.get('button[aria-label="Remove edge"]').click()
    cy.get('div[data-id="start"').move({ deltaX: -100, deltaY: 0 })
    cy.get('div[data-id="end"').move({ deltaX: 100, deltaY: 0 })
    cy.get('div[data-nodeid="start"').click()
    cy.get('div[data-handlepos="left"').eq(1).click()
    cy.get('div[data-handlepos="right"').eq(1).click()
    cy.get('div[data-nodeid="end"').click()
    cy.contains('button', 'Actions').click()
    cy.contains('button', 'Save workflow').click()
    cy.wait('@put_metadata')
    // })

    // it('save as', () => {
    cy.log('-- 02. Actions/Save as --')
    cy.contains('button', 'Actions').click()
    cy.contains('button', 'Save as').click()
    cy.get('input[placeholder="Please enter name of workflow"').type('test workflow copy')
    cy.contains('button', 'Cancel').next().click()
    // 1. green box
    // Workflow Saved
    // Workflow was successfully saved
    // 2. green box
    // Successfully saved workflow as test workflow copy - Note typo
    cy.contains(/Workflow Saved|fully saved/g) // green notifications
    cy.contains('Workflow Saved').should('not.exist')
    cy.contains('fully saved').should('not.exist')
    cy.wait('@put_metadata')
    // })

    // it('show definition', () => {
    cy.log('-- 03. Actions/Show definition --')
    cy.contains('button', 'Actions').click()
    cy.contains('Show definition').click()
    cy.contains('header', 'Workflow definition')
    cy.get('.ace_content').should('contain', 'test workflow')

    // this event will automatically be unbound when this
    // test ends because it's attached to 'cy'
    cy.on('uncaught:exception', (err, runnable) => {
      // expect(err.message).to.include('Uncaught NetworkError')
      // there can be also other - TypeError: Cannot read properties of null (reading 'getLength')
      expect(err.message)

      // using mocha's async done callback to finish
      // this test so we prove that an uncaught exception
      // was thrown
      // done()

      // return false to prevent the error from
      // failing this test
      return false
    })

    // assume this causes an error
    cy.get('button[aria-label="Close"', { timeout: 30000 }).click()

    cy.contains('header', 'Workflow definition').should('not.exist')
    // })

    // it('edit workflow', () => {
    cy.log('-- 04. Actions/Edit workflow --')
    cy.contains('button', 'Actions').click()
    cy.contains('Edit workflow').click()
    cy.get('input[placeholder="Add Labels (press Enter to add)"]').type('TEST2{enter}')
    cy.contains('button', 'Save changes').click()
    clickOnButtons()
    cy.wait('@put_metadata')
    cy.contains('Workflow Saved').as('greenNotif2') // green notification
    cy.contains('@greenNotif2').should('not.exist')
    // })

    // it('workflow editor', () => {
    cy.log('-- 05. Actions/Workflow editor --')
    cy.contains('button', 'Actions').click()
    cy.contains('button', 'Workflow editor').click()
    cy.get('.ace_content').type('{backspace}{backspace}{backspace}{backspace}{{}1}{enter}}')
    // the docs https://docs.cypress.io/api/commands/type --> {{} Types the literal { key
    cy.contains('button', 'Cancel').next().click()
    clickOnButtons()
    cy.wait('@put_metadata')
    cy.contains('Workflow Saved').as('greenNotif2') // green notification
    cy.contains('@greenNotif2').should('not.exist')
    // })

    // it('search test', () => {
    // Note: if mocked this does not work ....
    // cy.log('-- 06. workflows - check new ones --')
    // cy.get('input[placeholder="Search tasks"]').type('INVENTORY_install_device_by_name')
    // cy.get('input[placeholder="Search tasks"]').parent().next().should('contain', 'Install device by device name')
    // })

    // it('workflow execution', () => {
    cy.log('-- 07. workflow - Save and execute --')
    cy.contains('button', 'Save and execute').click()
    cy.wait('@put_metadata')
    cy.contains('Workflow Saved').as('greenNotif2') // green notification
    cy.contains('@greenNotif2').should('not.exist')
    cy.get('input[name="device_name"]').type('SAOS6_2')
    cy.contains('button', 'Execute').click()
    cy.wait('@post_workflow')
    cy.contains('We successfully executed workflow').as('greenNotif3') // green notification
    cy.contains('@greenNotif3').should('not.exist')
    cy.log('-- 07. workflow - detail of executed --')
    cy.contains('Executed workflow in detail').click()
    cy.url().should('include', '/frinxui/workflow-manager/executed')
    cy.wait('@get_workflow_running')
    cy.contains('RUNNING', { timeout: 30000 }).eq(0).should('be.visible')

    cy.intercept('GET', '/api/workflow/id/83c65aef-07e5-4a2a-81b6-dac8f1c96380', { fixture: 'workflow-builder/10get.json', }).as('get_workflow_completed')
    cy.wait('@get_workflow_completed')
    cy.contains('COMPLETED', { timeout: 30000 }).eq(0).should('be.visible')
  })

  it('save changes check', () => {
    // 'save changes check': 21 22 24
    cy.intercept('GET', '/api/workflow/metadata/workflow', { fixture: 'workflow-builder/21get.json', }).as('get_metadata_plus2')
    // 'workflow builder': 2  && 'save changes check': 25, 30
    cy.intercept('GET', '/api/workflow/metadata/taskdefs', { fixture: 'workflow-builder/00get_taskdef.json', }).as('get_taskdef')

    // 'save changes check': 23
    cy.intercept('GET', '/api/workflow/metadata/workflow/test%20workflow?version=1', { fixture: 'workflow-builder/23get_workflow1.json', }).as('get_workflow1')
    // 'save changes check': 26
    cy.intercept('DELETE', '/api/workflow/metadata/workflow/test%20workflow/1', { fixture: 'workflow-builder/26del_workflow1.json', }).as('del_workflow1')

    // 'save changes check': 27 - after del one wrkflw def less + also 29
    // cy.intercept('GET', '/api/workflow/metadata/workflow', { fixture: 'workflow-builder/27get.json', }).as('get_metadata_plus1')

    // 'save changes check': 28
    cy.intercept('GET', '/api/workflow/metadata/workflow/test%20workflow%20copy?version=1', { fixture: 'workflow-builder/28get_workflow2.json', }).as('get_workflow2')
    // 'save changes check': 31
    cy.intercept('DELETE', '/api/workflow/metadata/workflow/test%20workflow%20copy/1', { fixture: 'workflow-builder/31del_workflow2.json', }).as('del_workflow2')

    // 'workflow builder': 1 && 'save changes check': 32
    // cy.intercept('GET', '/api/workflow/metadata/workflow', { fixture: 'workflow-builder/00get.json', }).as('get_metadata')

    cy.log('-- 01. workflows - search for new ones --')
    cy.visit(Cypress.env('host'))
    cy.contains('a', 'Explore').click()
    cy.wait('@get_metadata_plus2')
    cy.url().should('include', '/frinxui/workflow-manager/definitions')
    cy.get('input[placeholder="Search by keyword."]').type('test workflow')
    cy.contains('test workflow / 1').should('be.visible')
    cy.contains('test workflow copy / 1').should('be.visible')
    cy.contains('test description').should('be.visible')
    cy.contains('TEST').should('be.visible')
    cy.contains('TEST2').should('be.visible')
    // })

    // it('workflow delete', () => {
    cy.log('-- 02. workflows - delete new ones --')
    cy.visit(Cypress.env('host'))
    cy.contains('a', 'Explore').click()
    cy.url().should('include', '/frinxui/workflow-manager/definitions')
    cy.wait('@get_metadata_plus2')
    cy.get('input[placeholder="Search by label."]').type('test')
    cy.contains('TEST').click()
    cy.get('a[href="/frinxui/workflow-manager/builder/test workflow/1"]').click()
    cy.wait('@get_workflow1')
    cy.wait('@get_metadata_plus2')
    cy.wait('@get_taskdef')
    cy.url().should('include', '/frinxui/workflow-manager/builder/test')
    deleteButton()
    cy.wait('@del_workflow1')
    cy.intercept('GET', '/api/workflow/metadata/workflow', { fixture: 'workflow-builder/27get.json', }).as('get_metadata_plus1')
    cy.wait('@get_metadata_plus1')
    cy.url().should('include', '/frinxui/workflow-manager/definitions')
    cy.contains('Reset search').click()
    cy.get('input[placeholder="Search by keyword."]').type('test workflow')
    cy.get('a[href="/frinxui/workflow-manager/builder/test workflow copy/1"]').click()
    cy.wait('@get_workflow2')
    cy.wait('@get_metadata_plus1')
    cy.wait('@get_taskdef')
    cy.url().should('include', '/frinxui/workflow-manager/builder/test')
    deleteButton()
    cy.wait('@del_workflow2')
    cy.intercept('GET', '/api/workflow/metadata/workflow', { fixture: 'workflow-builder/00get.json', }).as('get_metadata')
    cy.url().should('include', '/frinxui/workflow-manager/definitions')
    cy.wait('@get_metadata')
    cy.contains('Reset search').click()
    cy.get('input[placeholder="Search by keyword."]').type('test workflow')
    cy.contains('test workflow / 1').should('not.exist')
    cy.contains('test workflow copy / 1').should('not.exist')
  })
})
