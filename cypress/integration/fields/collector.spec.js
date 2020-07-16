import newSetup from "../helpers/setup";
import ID from "../../../src/lib/collector/id";
import AsyncQueue from "../../../src/lib/collector/queue";
import collect from "../../../src/lib/collector";

function removeDOMElems(elems) {
  for (let hash in elems) {
    delete elems[hash].el;
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
        id.generate($input).then(() => {
          expect(id.isUnique()).to.equal(true);
          expect(id.get()).to.equal("98060994718edaa7d52f2e6e164792a891bf8b84a7944be87db0ccc92c704867");
          expect(id.getSelector()).to.equal("input[type='text'][id='test-1']");
        });
      })
    });

    it("async queue should add work functions and wait asynchronously for group to finish", () => {
      const queue = new AsyncQueue();

      function asyncWorkFactory(cb, timeout) {
        return function asyncWork(resolve, reject) {
          setTimeout(() => {
            cb();
            resolve();
          }, timeout);
        }
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
      })
      // nonBlockedWork shouldn't be blocked by waitForGroup
      nonBlockedWork();
      expect(nonBlockedWork).to.be.calledBefore(result2);

    });

    it("should collect all the fields on the page", () => {
      cy.fixture("fields/store.json").then(store => {

        const emptyFields = {
          active: {},
          missing: [],
        }
        cy.document().then($doc => {
          cy.wrap(collect(emptyFields, $doc)).then(results => {
            removeDOMElems(results.fields.active);
            expect(results.fields.active).to.deep.equal(store.fields.active);
          });
        })

      })
    });

    it("should merge with old data and find missing elements", () => {
      cy.fixture("fields/with_missing/after_collected.json").then(collected => {
        cy.fixture("fields/with_missing/store.json").then(store => {

          cy.document().then($doc => {
            const { fields } = store;

            cy.wrap(collect(fields, $doc)).then(results => {
              removeDOMElems(results.fields.active);
              expect(results.fields.active).to.deep.equal(collected.fields.active);
              expect(results.fields.missing).to.deep.equal(collected.fields.missing);
            })
          })

        })
      })
    });


    it("should merge with old data and snapshots", () => {
      cy.fixture("fields/with_snapshots/after_collected.json").then(collected => {-
        cy.fixture("fields/with_snapshots/store.json").then(store => {

          cy.document().then($doc => {
            const { fields } = store;

            cy.wrap(collect(fields, $doc)).then(results => {
              removeDOMElems(results.fields.active);
              expect(results.fields.active).to.deep.equal(collected.fields.active);
              expect(results.fields.missing).to.deep.equal(collected.fields.missing);
            });
          })

        })
      })
    });

  });
});