import React from "react";
import VirtualField from "./VirtualField";

function VirtualFieldList({ fields }) {
  return (
    <div className="fieldbar-wrapper">
      {Object.keys(fields.active).map(fieldHash =>
        <VirtualField
          field={fields.active[fieldHash]}
          fieldHash={fieldHash}
          key={fieldHash}/>
      )}
    </div>
  );
}

export default VirtualFieldList;