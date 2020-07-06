/*global chrome*/

import React, { useEffect } from 'react';
import './Sidebar.css';

function Sidebar ({ location }) {
  return (
    <div className="sidebar">
      <p>
        {location}
      </p>
    </div>
  );
}

export default Sidebar;
