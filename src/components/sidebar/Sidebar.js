import React from "react";
import "./Sidebar.css";
import TimeFormatter from "../../lib/utils/time";

function prettifyTime(ts) {
  const date = new Date(parseInt(ts));
  const timefmt = new TimeFormatter(date);
  return timefmt.getPrettyString();
}

function Sidebar({ snapshots }) {
  return (
    <div className="sidebar">
      {snapshots.map(snapshot => {
        return (
          <div key={snapshot.time.ts}>
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
      })}
    </div>
  );
}

export default Sidebar;