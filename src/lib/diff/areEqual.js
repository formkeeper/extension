export function areShallowEqual(prevObj, nextObj) {
  for (let prop in prevObj) {
    if (prevObj[prop] !== nextObj[prop]) {
      return false;
    }
  }
  return true;
}

export function areFieldsEqual(prevFields, nextFields) {
  /*
  Fields never change in the react flow with the current state of the extension
  as they're collected during app startup. Fields only change when the whole
  extension is re-rendered (e.g. upon page change), because collection is
  retriggered.
  */
  return true;
}

export function areSnapshotsEqual(prevSnapshots, nextSnapshots) {
  return prevSnapshots.id === nextSnapshots.id;
}