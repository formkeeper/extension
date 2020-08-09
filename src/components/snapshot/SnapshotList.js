import React, { memo, Fragment, useRef, useState, useEffect, useCallback } from "react";
import { FixedSizeList as List } from "react-window";

import { areFieldsEqual, areShallowEqual, areSnapshotsEqual } from "../../lib/diff/areEqual";
import SnapshotItem from "./Snapshot";

const SnapshotKey = (index, data) =>
  data[index].time.ts;

function areSnapshotListEqual(prevProps, nextProps) {
  const {
    fields: prevFields,
    snapshots: prevSnapshots,
    ...prevRestProps
  } = prevProps;
  const {
    fields: nextFields,
    snapshots: nextSnapshots,
    ...nextRestProps
  } = nextProps;

  return areSnapshotsEqual(prevSnapshots, nextSnapshots)
    && areShallowEqual(prevRestProps, nextRestProps)
    && areFieldsEqual(prevFields, nextFields);
}

const ListNavButton = memo(({ handler, children, className, isVisible}) => {
  const style = isVisible ? { display: "block" } : { display: "none"};
  return (
    <div className={className} onClick={handler} style={style}>
      {children}
    </div>
  );
});

const ListPrevButton = memo(({ handler, isVisible }) => {
  return (
    <ListNavButton
      className="prev"
      handler={handler}
      isVisible={isVisible}
    >
    ↑
    </ListNavButton>
  );
});

const ListNextButton = memo(({ handler, isVisible }) => {
  return (
    <ListNavButton
      className="next"
      handler={handler}
      isVisible={isVisible}
    >
    ↓
    </ListNavButton>
  );
});


const SnapshotList = memo(({
  snapshots,
  fields,
  isVisible,
  setPosition,
  listRef
}) => {
  const all = snapshots.current;
  const len = all.length;

  useEffect(() => {
    listRef.current.scrollToItem(len - 1);
  });

  const onItemsRendered = ({ visibleStartIndex, visibleStopIndex }) => {
    setPosition({
      start: visibleStartIndex,
      end: visibleStopIndex,
    });
  };

  return (
    <div className="snapshot-list">
      <List
        height={600}
        itemCount={len}
        itemSize={50}
        width={200}
        itemKey={SnapshotKey}
        itemData={all}
        onItemsRendered={onItemsRendered}
        ref={listRef}
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
}, areSnapshotListEqual);

function SnapshotListWrapper({ snapshots, fields, isVisible }) {
  const all = snapshots.current;
  const len = all.length;

  const listRef = useRef(null);

  const [position, setPosition] = useState({
    start:  0,
    end: len,
  });

  const { start, end } = position;

  const handlePrev = useCallback(() => {
    listRef.current.scrollToItem(start - 1);
  }, [start]);

  const handleNext = useCallback(() => {
    listRef.current.scrollToItem(end + 1);
  }, [end]);

  return (
    <Fragment>
      <ListPrevButton
        isVisible={start > 0}
        handler={handlePrev}
      />
      <SnapshotList
        snapshots={snapshots}
        fields={fields}
        isVisible={isVisible}
        setPosition={setPosition}
        listRef={listRef}
      />
      <ListNextButton
        isVisible={end < len - 1}
        handler={handleNext}
      />
    </Fragment>
  );
}

export default SnapshotListWrapper;