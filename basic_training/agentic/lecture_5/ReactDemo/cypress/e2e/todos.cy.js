const incompleteTable = () => cy.contains('h3', 'Incomplete').next('table')
const completedTable = () => cy.contains('h3', 'Completed').next('table')

const addTodo = (title) => {
  cy.get('input[placeholder="Enter a todo"]').type(title)
  cy.contains('button', 'Add Todo').click()
}

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

  it('moves completed todos from the Incomplete table to the Completed table', () => {
    addTodo('First')
    addTodo('Second')
    addTodo('Third')

    incompleteTable().find('tbody tr').should('have.length', 3)
    completedTable().find('tbody tr').should('have.length', 0)

    incompleteTable().contains('tr', 'Second').contains('button', 'Mark as completed').click()

    incompleteTable().find('tbody tr').should('have.length', 2)
    incompleteTable().should('not.contain', 'Second')
    completedTable().find('tbody tr').should('have.length', 1)
    completedTable()
      .contains('tr', 'Second')
      .should('contain', 'Completed')
      .and('not.contain', 'Mark as completed')

    // Serial numbers are per table
    incompleteTable().find('tbody tr').eq(1).find('td').first().should('have.text', '2')
    completedTable().find('tbody tr').first().find('td').first().should('have.text', '1')
  })

  it('edits and deletes a todo in the Completed table', () => {
    addTodo('Done task')
    incompleteTable().contains('tr', 'Done task').contains('button', 'Mark as completed').click()

    completedTable().contains('tr', 'Done task').contains('button', 'Edit').click()
    cy.get('input[placeholder="Enter a todo"]').clear().type('Done task renamed')
    cy.contains('button', 'Save').click()

    completedTable().contains('tr', 'Done task renamed').should('exist')
    incompleteTable().find('tbody tr').should('have.length', 0)

    completedTable().contains('tr', 'Done task renamed').contains('button', 'Delete').click()
    completedTable().find('tbody tr').should('have.length', 0)
  })

  it('wraps long titles without stretching the table', () => {
    addTodo('a'.repeat(300))

    incompleteTable().invoke('outerWidth').should('be.at.most', 900)
    incompleteTable()
      .find('tbody td')
      .eq(1)
      .then(($td) => {
        expect($td[0].scrollWidth).to.be.at.most($td[0].clientWidth)
      })
  })
})
