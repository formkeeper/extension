class Setup {
  static() {
    beforeEach(() => {
      cy.visit('http://localhost:3798');
    });

    it('static server is up', () => {
      cy.get('#healthcheck')
      .should("exist");
    });

    it("browser extension's content script is injected", () => {
      cy.get('#formkeeper-root')
      .should("exist");
    });
    return this;
  }
}

function newSetup() {
  return new Setup();
}

export default newSetup;