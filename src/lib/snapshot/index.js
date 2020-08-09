export function getSnapshotsListID(snapshots) {
  const allTs = snapshots.reduce((all, snapshot) => all += snapshot.time.ts, "");
  return btoa(allTs);
}