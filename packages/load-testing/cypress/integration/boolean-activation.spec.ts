const userCount = 10;

describe("Boolean activation", () => {
  before(() => {
    cy.seed(userCount);
  });

  after(() => {
    cy.cleanup();
  });

  for (let i = 0; i < userCount; i++) {
    it(`running for user ${i}`, () => {
      cy.visit(`http://localhost:3000?id=${i}`);

      cy.findByText("User " + i).should("be.visible");
    });
  }
});
