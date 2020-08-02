import newSetup from "../helpers/setup";
import ID from "../../../src/lib/collector/id";
import AsyncQueue from "../../../src/lib/collector/queue";
import retrieveAndCollect from "../../../src/lib/collector";
import Storage from "../../../src/lib/storage";

function removeDOMElems(elems) {
  for (let hash in elems) {
    delete elems[hash].el;
  }
}

class FakeStorage extends Storage {
  constructor(store) {
    super(store);
    this._store = store;
  }

  async get() {
    return Promise.resolve(this._store);
  }
}

class EmptyStorage extends Storage {
  async get() {
    return Promise.resolve(null);
  }
}

context("Fields", () => {

  describe("collector", () => {
    newSetup()
      .serve();

    it("ID should create an unique ID for a given element", () => {
      cy.document().then($doc => {
        const $input = $doc.getElementById("test-1");

        const id = new ID($doc);
        cy.wrap(id.generate($input)).then(() => {
          expect(id.isUnique())
            .to.equal(true);
          expect(id.getSelector())
            .to.equal("input[type=\"text\"][id=\"test-1\"]");
          expect(id.get())
            .to.equal("72218321173abf46b0c0282d4c53cb9ba721ff5a949212e228b5c11a552b1b6d");
        });
      });
    });

    it("async queue should add work functions and wait asynchronously for group to finish", () => {
      const queue = new AsyncQueue();

      function asyncWorkFactory(cb, timeout) {
        return function asyncWork(resolve, reject) {
          setTimeout(() => {
            cb();
            resolve();
          }, timeout);
        };
      }

      const result1 = cy.spy();
      const result2 = cy.spy();
      const work1 = asyncWorkFactory(result1, 200);
      const work2 = asyncWorkFactory(result2, 100);
      const blockedWork = cy.spy();
      const nonBlockedWork = cy.spy();

      queue
        .add(work1)
        .add(work2);

      expect(result1).to.not.be.called;
      expect(result2).to.not.be.called;
      cy.wrap(queue.waitForGroup()).then(() => {
        blockedWork();
        expect(result1).to.be.called;
        // work2 should finish before
        expect(result2).to.be.calledBefore(result1);
        // blockedWork should wait for group to finish
        expect(blockedWork).to.be.calledAfter(result1);
        expect(blockedWork).to.be.calledAfter(result2);
      });
      // nonBlockedWork shouldn't be blocked by waitForGroup
      nonBlockedWork();
      expect(nonBlockedWork).to.be.calledBefore(result2);

    });

    it("should collect all the fields on the page", () => {
      cy.fixture("fields/store.json").then(store => {
        cy.document().then($doc => {
          const storage = new EmptyStorage();
          cy.wrap(retrieveAndCollect(storage, $doc)).then(results => {
            removeDOMElems(results.fields.active);
            expect(results.fields.active).to.deep.equal(store.fields.active);
          });
        });

      });
    });

    it("should reconciliate with old data from storage and find missing elements", () => {
      cy.fixture("fields/with_missing/after_collected.json").then(collected => {
        cy.fixture("fields/with_missing/store.json").then(store => {

          cy.document().then($doc => {
            const storage = new FakeStorage(store);

            cy.wrap(retrieveAndCollect(storage, $doc)).then(results => {
              removeDOMElems(results.fields.active);
              expect(results.fields.active)
                .to.deep.equal(collected.fields.active);
              expect(results.fields.missing)
                .to.deep.equal(collected.fields.missing);
            });
          });

        });
      });
    });

    it("should reconciliate with old data and snapshots", () => {
      cy.fixture("fields/with_snapshots/after_collected.json").then(collected => {
        cy.fixture("fields/with_snapshots/store.json").then(store => {

          cy.document().then($doc => {
            const storage = new FakeStorage(store);

            cy.wrap(retrieveAndCollect(storage, $doc)).then(results => {
              removeDOMElems(results.fields.active);
              expect(results.fields.active)
                .to.deep.equal(collected.fields.active);
              expect(results.fields.missing)
                .to.deep.equal(collected.fields.missing);
            });
          });

        });
      });
    });


    /*
      Can't test collect function directly with ChromeStorage layer
      since we need access to chrome.storage. We need to test the actual
      full component from the contentScript.

      So we better test this when basic UI is finished and test the UI
      directly.

      TODO: Test UI for a reconciliation from real storage

    it("should reconciliate with old data from real storage", () => {
      cy.fixture("fields/with_missing/after_collected.json").then(collected => {
        cy.fixture("fields/with_missing/store.json").then(store => {

          cy.document().then($doc => {
            cy.setLocalExtensionStorage(STORAGE_KEY, { store }).then(() => {
              cy.wrap(collect($doc)).then(results => {
                removeDOMElems(results.fields.active);
                expect(results.fields.active)
                  .to.deep.equal(collected.fields.active);
                expect(results.fields.missing)
                  .to.deep.equal(collected.fields.missing);
              });
            });
          });

        });
      });
    });
    */

  });
});