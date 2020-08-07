import React, { useMemo, useCallback } from "react";

import TimeFormatter from "../../lib/utils/time";
import { setFieldValue, animate } from "../../lib/field";

import "./Snapshot.css";

function changeLinkedElement(fields, snapshot, fieldState) {
  const { contents } = snapshot;
  for (let fieldHash in contents) {
    const field = fields[fieldState][fieldHash];
    const content = contents[fieldHash];
    setFieldValue(field, content);
    animate(field, "pulse", 300);
  }
}

function changeActiveLinkedElement(fields, snapshot) {
  return changeLinkedElement(fields, snapshot, "active");
}

const prettifyTime = ts => {
  const date = new Date(parseInt(ts));
  const timefmt = new TimeFormatter(date);
  return timefmt.getPrettyString();
};

function SnapshotItem({ index, style, data, fields, isVisible}) {
  const snapshot = data[index];
  const ts = snapshot.time.ts;
  //const dispatch = useContext(FieldsDispatch);

  const time = useMemo(() => {
    if (isVisible) {
      return prettifyTime(ts);
    }
  }
  , [ts, isVisible]);

  const handleClick = useCallback(() => {
    changeActiveLinkedElement(fields, snapshot);
  }, [fields, snapshot]);

  return (
    <div className="snapshot" style={style} onClick={handleClick}>
      <h3>{time}</h3>
    </div>
  );
}

export default SnapshotItem;