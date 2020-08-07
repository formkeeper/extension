import React from "react";

import useExtensionVisibility from "../../hooks/useExtensionVisibility";
import SnapshotList from "../snapshot/SnapshotList";
import "./Sidebar.css";

function Sidebar({ snapshots, fields }) {
  const isVisible = useExtensionVisibility();
  return (
    <div className="sidebar">
      <div className="prev">↑</div>
      <SnapshotList
        snapshots={snapshots}
        isVisible={isVisible}
        fields={fields}
      />
      <div className="next">↓</div>
    </div>
  );
}

export default Sidebar;