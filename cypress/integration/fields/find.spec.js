import newSetup from '../helpers/setup';

context('Fields', () => {

  describe('find and add new/existing fields', () => {
   newSetup()
    .static();

    it("should receive msg", () => {
      cy.getLocalExtensionStorage("test-key").then(result => {
        expect(result["test-key"]).to.equal("This is an example msg of storage")
      })
    });
  });
});