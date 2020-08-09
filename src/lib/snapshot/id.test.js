import { getSnapshotsListID } from "./id";

import store from "../../../cypress/fixtures/fields/with_snapshots/after_collected.json";

describe("snapshots", () => {
  const { snapshots } = store;
  it("returns the right ID", async () => {
    const id = await getSnapshotsListID(snapshots.current);
    expect(id).toBe(snapshots.id);
  });
});