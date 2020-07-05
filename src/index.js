// This file is remnant piece of the create-react-app boilerplate. Useful for developing UI in development mode with hot reloading
// but completely useless within chrome extension development.

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App isExt={false}/>, document.getElementById('root'));
registerServiceWorker();
