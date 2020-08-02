import React from "react";

import Sidebar from "../sidebar/Sidebar";
import FieldBarWrapper from "../field/FieldBarWrapper";

import useExtensionLocation from "../../hooks/useExtensionLocation";
import useCollector from "../../hooks/useCollector";
import { StorageDispatch } from "../../global/context";
import ChromeStorage from "../../lib/storage/chrome";
import { removeProtocol } from "../../lib/utils/common";

function Page({ window, fields, snapshots }) {
  const location = useExtensionLocation(window);
  const storage = new ChromeStorage(removeProtocol(location));

  useCollector(storage, location);

  return (
    <div id="sidebar-wrapper">
      <StorageDispatch.Provider value={storage}>
        <Sidebar snapshots={snapshots}/>
        <FieldBarWrapper fields={fields}/>
      </StorageDispatch.Provider>
    </div>
  );
}

export default Page;