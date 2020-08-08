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
  as they're collected within app startup. Fields only change when the
  whole extension is re-rendered (e.g. upon page change), because collection
  is retriggered.
  */
  return true;
}

export function areSnapshotsEqual(prevSnapshots, nextSnapshots) {
  const prevLen = prevSnapshots.length;
  if (prevLen !== nextSnapshots.length) {
    return false;
  }

  if (prevLen === 0) {
    // Both have the same length and are empty
    return true;
  }

  let i = prevLen - 1;
  while(i--) {
    // If this is too expensive we could just calculate a hash upon snapshot
    // insertion of every snapshot timestamp in the list and check the hashes
    if (prevSnapshots[i].time.ts !== nextSnapshots[i].time.ts) {
      return false;
    }
  }
  return true;
}