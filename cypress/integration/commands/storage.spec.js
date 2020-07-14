import newSetup from '../helpers/setup';

context('Commands', () => {
  describe('storage', () => {
   newSetup()
    .serve();

    const key = "test-key";
    const value = "sample-1";

    it("(get|set)LocalExtensionStorage should relay to chrome.storage.local.(get|set)", () => {
      cy.getLocalExtensionStorage(key).then(result => {
        expect(result).to.equal(false)

        cy.setLocalExtensionStorage(key, value).then(() => {
          cy.getLocalExtensionStorage(key).then(result => {
            expect(result).to.deep.equal({[key]: value})
          });
        })
      });
    });

    it("clearLocalExtensionStorage should relay to chrome.storage.local.clear", () => {
      cy.setLocalExtensionStorage(key, value).then(() => {
        cy.getLocalExtensionStorage(key).then(result => {
          expect(result).to.deep.equal({[key]: value})

          cy.clearLocalExtensionStorage().then(() => {
            cy.getLocalExtensionStorage(key).then(result => {
            expect(result).to.equal(false)
          })
        });
       });
      });
    });

  });
});