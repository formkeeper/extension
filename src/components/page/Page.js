import React from "react";

import Sidebar from "../sidebar/Sidebar";

import useExtensionLocation from "../../hooks/useExtensionLocation";
import useFieldCollector from "../../hooks/useFieldCollector";

function Page({ window, document }) {
  const location = useExtensionLocation(window);
  useFieldCollector({ document, location });

  return (
    <div id="sidebar-wrapper">
      <Sidebar />
    </div>
  );
}

export default Page;