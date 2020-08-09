import React from "react";

import Sidebar from "../sidebar/Sidebar";
import VirtualFieldList from "../field/VirtualFieldList";

import useExtensionLocation from "../../hooks/useExtensionLocation";
import useCollector from "../../hooks/useCollector";
import { StorageDispatch } from "../../global/context";
import ChromeStorage from "../../lib/storage/chrome";
import { removeProtocol } from "../../lib/utils/common";

/*
  Page is the top parent component (apart from App).

  Page uses the useExtensionLocation so the extension behaviour (and the react
  flow) depends on the context, e.g. whenever a new page is visited (including
  SPA and server side pages), this component (and the whole extension,
  consequently) will be re-rendered.
*/
function Page({ window, fields, snapshots }) {
  const location = useExtensionLocation(window);
  const storage = new ChromeStorage(removeProtocol(location));

  useCollector(storage, location);

  return (
    <div id="sidebar-wrapper">
      <StorageDispatch.Provider value={storage}>
        <Sidebar snapshots={snapshots} fields={fields}/>
        <VirtualFieldList fields={fields}/>
      </StorageDispatch.Provider>
    </div>
  );
}

export default Page;