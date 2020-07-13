import newSetup from '../helpers/setup';

context('Commands', () => {

  describe('storage', () => {
   newSetup()
    .static();

    it("(get|set)LocalExtensionStorage should relay to chrome.storage.local.(get|set)", () => {
      const key = "test-key";
      const value = "sample-1";

      cy.getLocalExtensionStorage(key).then(result => {
        expect(result).to.equal(false)

        cy.setLocalExtensionStorage(key, value).then(() => {
          cy.getLocalExtensionStorage(key).then(result => {
            expect(result).to.deep.equal({[key]: value})
          });
        })
      });
    });
  });
});