import React from "react";
import { FixedSizeList as List } from "react-window";

import SnapshotItem from "./Snapshot";

const SnapshotKey = (index, data) =>
  data[index].time.ts;

function SnapshotList({ snapshots, isVisible, fields}) {
  return (
    <div className="snapshot-list">
      <List
        height={600}
        itemCount={snapshots.length}
        itemSize={50}
        width={200}
        itemKey={SnapshotKey}
        itemData={snapshots}
      >
        {({ index, style, data}) =>
          <SnapshotItem
            index={index}
            style={style}
            data={data}
            fields={fields}
            isVisible={isVisible}
          />
        }
      </List>
    </div>
  );
}

export default SnapshotList;