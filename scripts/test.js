'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const argv = process.argv;
const paths = require('../config/paths');

const modes = {
  E2E: 'e2e-mode',
  UNIT: 'unit-mode',
  BOTH: 'both-mode',
}

// Build dev

async function runUnitTests(mode) {
  const jest = require('jest');
  let argv = process.argv.slice(2);

  // print all test results
  argv.push('--verbose');

  if (mode === modes.UNIT) {
    argv.push('--watch');
  } else {
  }
  await jest.run(argv);
}

async function runIntegrationTests(mode) {
  const cy = require('cypress');
  const { buildDev } = require('./build-dev');
  await buildDev();
  const bs = require('browser-sync').create();
  bs.init({
    server: paths.testWebsitePublic,
    port: 3798,
    open: false,
  })

  if (mode === modes.E2E) {
    await cy.open();
  } else {
    await cy.run({
      browser: "chrome",
    });
  }
  bs.exit();
}



async function run() {
  let mode;

  const unitIdx = argv.indexOf('--unit');
  const e2eIdx = argv.indexOf('--e2e')

  if (unitIdx > 0) {
    mode = modes.UNIT;
    argv.splice(unitIdx, 1);
    await runUnitTests(mode);
  } else if (e2eIdx > 0) {
    mode = modes.E2E;
    argv.splice(e2eIdx, 1);
    await runIntegrationTests(mode);
  } else {
    mode = modes.BOTH;
    await runUnitTests(mode);
    await runIntegrationTests(mode);
  }
}

run();