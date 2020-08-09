import SHA256 from "../utils/hash";

export async function getSnapshotsListID(snapshots) {
  const allTs = snapshots.reduce((all, snapshot) => all += snapshot.time.ts, "");
  return await SHA256(allTs);
}