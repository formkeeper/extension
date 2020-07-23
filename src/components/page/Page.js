import React from "react";

import Sidebar from "../sidebar/Sidebar";

import useExtensionLocation from "../../hooks/useExtensionLocation";
import useFieldCollector from "../../hooks/useFieldCollector";

function Page({ window, document, fields }) {
  const location = useExtensionLocation(window);
  useFieldCollector(location);

  return (
    <div id="sidebar-wrapper">
      <Sidebar fields={fields}/>
    </div>
  );
}

export default Page;