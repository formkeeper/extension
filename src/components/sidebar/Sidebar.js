import React from "react";

import useExtensionVisibility from "../../hooks/useExtensionVisibility";
import SnapshotListWrapper from "../snapshot/SnapshotList";
import "./Sidebar.css";

function Sidebar({ snapshots, fields }) {
  const isVisible = useExtensionVisibility();

  return (
    <div className="sidebar">
      <SnapshotListWrapper
        snapshots={snapshots}
        isVisible={isVisible}
        fields={fields}
      />
    </div>
  );
}

export default Sidebar;