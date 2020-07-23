import React from "react";
import "./Sidebar.css";

function Sidebar({ fields }) {
  return (
    <div className="sidebar">
      <ul>
        { Object.keys(fields.active).map(fieldHash => {
          return (<li key={fieldHash}>{fieldHash}</li>);
        })}
      </ul>
    </div>
  );
}

export default Sidebar;