"use strict";
var _ = require("lodash");
var assert = require("assert");
var semver = require("semver");
var runtimePaths = {
  node: function(targetOptions) {
    if (semver.lt(targetOptions.runtimeVersion, "4.0.0")) {
      return {
        externalPath: "https://nodejs.org/dist/v" + targetOptions.runtimeVersion + "/",
        winLibs: [{
          dir: targetOptions.isX64 ? "x64" : "",
          name: targetOptions.runtime + ".lib"
        }],
        tarPath: targetOptions.runtime + "-v" + targetOptions.runtimeVersion + ".tar.gz",
        headerOnly: false
      };
    } else {
      return {
        externalPath: "https://nodejs.org/dist/v" + targetOptions.runtimeVersion + "/",
        winLibs: [{
          dir: targetOptions.isX64 ? "win-x64" : "win-x86",
          name: targetOptions.runtime + ".lib"
        }],
        tarPath: targetOptions.runtime + "-v" + targetOptions.runtimeVersion + "-headers.tar.gz",
        headerOnly: true
      };
    }
  },
  iojs: function(targetOptions) {
    return {
      externalPath: "https://iojs.org/dist/v" + targetOptions.runtimeVersion + "/",
      winLibs: [{
        dir: targetOptions.isX64 ? "win-x64" : "win-x86",
        name: targetOptions.runtime + ".lib"
      }],
      tarPath: targetOptions.runtime + "-v" + targetOptions.runtimeVersion + ".tar.gz",
      headerOnly: false
    };
  },
  nw: function(targetOptions) {
    const distUrl = targetOptions.distUrl || "https://node-webkit.s3.amazonaws.com";
    if (semver.gte(targetOptions.runtimeVersion, "0.13.0")) {
      return {
        externalPath: distUrl + "/v" + targetOptions.runtimeVersion + "/",
        winLibs: [{
          dir: targetOptions.isX64 ? "x64" : "",
          name: targetOptions.runtime + ".lib"
        }, {
          dir: targetOptions.isX64 ? "x64" : "",
          name: "node.lib"
        }],
        tarPath: "nw-headers-v" + targetOptions.runtimeVersion + ".tar.gz",
        headerOnly: false
      };
    }
    return {
      externalPath: distUrl + "/v" + targetOptions.runtimeVersion + "/",
      winLibs: [{
        dir: targetOptions.isX64 ? "x64" : "",
        name: targetOptions.runtime + ".lib"
      }],
      tarPath: "nw-headers-v" + targetOptions.runtimeVersion + ".tar.gz",
      headerOnly: false
    };
  },
  electron: function(targetOptions) {
    return {
      externalPath: "https://atom.io/download/atom-shell/v" + targetOptions.runtimeVersion + "/",
      winLibs: [{
        dir: targetOptions.isX64 ? "x64" : "",
        name: "node.lib"
      }],
      tarPath: "node" + "-v" + targetOptions.runtimeVersion + ".tar.gz",
      headerOnly: false
    };
  },
  get: function(targetOptions) {
    assert(_.isObject(targetOptions));
    var runtime = targetOptions.runtime;
    var func = runtimePaths[runtime];
    var paths;
    if (_.isFunction(func) && _.isPlainObject(paths = func(targetOptions))) {
      return paths;
    }
    throw new Error("Unknown runtime: " + runtime);
  }
};
module.exports = runtimePaths;

//# sourceMappingURL=runtimePaths.js.map
