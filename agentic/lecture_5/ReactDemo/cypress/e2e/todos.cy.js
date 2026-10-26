describe('Todo list', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('adds a todo and marks it complete', () => {
    cy.get('input[placeholder="Enter a todo"]').type('Review Cypress')
    cy.contains('button', 'Add Todo').click()

    cy.get('tbody tr')
      .should('have.length', 1)
      .and('contain', 'Review Cypress')
      .and('contain', 'Not completed')

    cy.contains('tr', 'Review Cypress')
      .contains('button', 'Mark as completed')
      .click()

    cy.contains('tr', 'Review Cypress')
      .should('contain', 'Completed')
      .and('not.contain', 'Mark as completed')
  })

  it('edits, cancels editing, and deletes a todo', () => {
    cy.get('input[placeholder="Enter a todo"]').type('Draft title')
    cy.contains('button', 'Add Todo').click()

    cy.contains('tr', 'Draft title').contains('button', 'Edit').click()
    cy.get('input[placeholder="Enter a todo"]').clear().type('Updated title')
    cy.contains('button', 'Save').click()
    cy.contains('tbody tr', 'Updated title').should('exist')

    cy.contains('tr', 'Updated title').contains('button', 'Edit').click()
    cy.get('input[placeholder="Enter a todo"]').clear().type('Discard this title')
    cy.contains('button', 'Cancel').click()
    cy.contains('tbody tr', 'Updated title').should('exist')
    cy.get('input[placeholder="Enter a todo"]').should('have.value', '')

    cy.contains('tr', 'Updated title').contains('button', 'Delete').click()
    cy.get('tbody tr').should('have.length', 0)
  })
})
