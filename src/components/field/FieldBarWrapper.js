import React from "react";
import FieldBar from "./FieldBar";

/**
 * FieldBarWrapper is a component which contains all the FieldBars components.
 * Each FieldBar is positioned near the linked field element so think of this
 * component more like a wrapper than an actual list of items: FieldBarWrapper
 * doesn't have styling (it's not a list) nor positioning.
 */
function FieldBarWrapper({ fields }) {
  return (
    <div className="fieldbar-wrapper">
      {Object.keys(fields.active).map(fieldHash =>
        <FieldBar
          field={fields.active[fieldHash]}
          fieldHash={fieldHash}
          key={fieldHash}/>
      )}
    </div>
  );
}

export default FieldBarWrapper;