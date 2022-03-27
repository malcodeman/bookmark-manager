/// <reference types="cypress" />

describe("Auth", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("can sign in", () => {
    cy.get("[data-cy=email-input]").type(`test@gmail.com`);
    cy.get("[data-cy=cta-button]").click();
    cy.contains("Email sent.").should("be.visible");
  });
});
