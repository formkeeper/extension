const paths = require('../config/paths');
const fs = require('fs-extra');

function copyPublicFolder() {
  const isProd = process.env.NODE_ENV === "production";
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: function copyFile(src) {
      switch(src) {
        case paths.appHtml:
          return false;
        case paths.cyhook:
        case paths.cyinject:
        case paths.manifestDevJson:
          return !isProd;
        case paths.manifestProdJson:
          return isProd;

        default:
          return true;
      }
    }
  });
}

function renameManifest() {
  return new Promise((resolve, reject) => {
    function ignoreDoesntExistError(err) {
      if (err.code === "ENOENT") {
        return resolve();
      }
      reject(err);
      throw err;
    }

    // Rename manifest.prod.json to manifest.json
    fs.rename(paths.manifestBuildProdJson, paths.manifestBuildJson)
      .then(resolve)
      .catch(ignoreDoesntExistError);

    // Rename manifest.dev.json to manifest.json
    fs.rename(paths.manifestBuildDevJson, paths.manifestBuildJson)
      .then(resolve)
      .catch(ignoreDoesntExistError);
  });
}

module.exports = {
  renameManifest,
  copyPublicFolder
}