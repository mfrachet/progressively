describe("/dashboard/what-s-your-name", () => {
  before(cy.seed);
  after(cy.cleanup);

  describe("not authenticated", () => {
    beforeEach(() => {
      cy.visit("/dashboard/what-s-your-name");
    });

    it("checks that the route is protected", () => {
      cy.checkProtectedRoute();
    });
  });

  describe("authenticated", () => {
    beforeEach(() => {
      cy.signIn("WithoutFullname");
      cy.visit("/dashboard");
      cy.injectAxe();
    });

    it("shows an onboarding layout", () => {
      cy.title().should("eq", "Progressively | What's your name?");
      cy.findByText("Hey, welcome around! What's your name?").should(
        "be.visible"
      );

      cy.findByLabelText("Fullname").should("be.visible");
      cy.findByRole("button", { name: "Set my fullname" }).should("be.visible");

      cy.checkA11y();
    });

    it("shows an error when submitting an empty form", () => {
      cy.findByRole("button", { name: "Create the project" }).click();
      cy.get(".error-box")
        .should("have.focus")
        .and(
          "contain.text",
          "The name field is required, make sure to have one."
        );

      cy.checkA11y();
    });

    it("creates a new project", () => {
      cy.get("input").type("My new project");
      cy.findByRole("button", { name: "Create the project" }).click();
      cy.get(".success-box")
        .should("have.focus")
        .and("contain.text", "The project has been successfully created.");

      cy.findByText("My new project").should("be.visible");

      cy.url().should("include", "/dashboard?newProjectId");
      cy.checkA11y();
    });
  });
});
