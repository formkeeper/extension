import React from "react";
import "./Sidebar.css";
import TimeFormatter from "../../lib/utils/time";

function prettifyTime(ts) {
  const date = new Date(parseInt(ts));
  const timefmt = new TimeFormatter(date);
  return timefmt.getPrettyString();
}

function Snapshot({ snapshot }) {
  return (
    <div className="snapshot">
      <h3>{prettifyTime(snapshot.time.ts)}</h3>
      <ul>
        {Object.keys(snapshot.contents).map(fieldHash => {
          return (
            <li key={fieldHash}>{snapshot.contents[fieldHash]}</li>
          );
        })}
      </ul>
    </div>
  );
}

function SnapshotList({ snapshots }) {
  return (
    <div className="snapshot-list">{
      snapshots.map(snapshot =>
        <Snapshot
          key={snapshot.time.ts}
          snapshot={snapshot}
        />
      )}
    </div>
  );
}

function Sidebar({ snapshots }) {
  return (
    <div className="sidebar">
      <div className="prev">↑</div>
      <SnapshotList snapshots={snapshots}/>
      <div className="next">↓</div>
    </div>
  );
}

export default Sidebar;