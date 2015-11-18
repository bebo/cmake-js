"use strict";
/* global it */
let lib = require("../../");
let environment = lib.environment;
let Bluebird = require("bluebird");
let async = Bluebird.coroutine;
let _ = require("lodash");
let log = require("npmlog");
let util = require("util");

function* generateRuntimeOptions() {
    function* generateForNode(arch) {
        // Old:
        yield {
            runtime: "node",
            runtimeVersion: "0.10.36",
            arch: arch
        };

        // LTS:
        yield {
            runtime: "node",
            runtimeVersion: "4.2.2",
            arch: arch
        };

        // Current:
        if (environment.runtimeVersion !== "5.1.0") {
            yield {
                runtime: "node",
                runtimeVersion: "5.1.0",
                arch: arch
            };
        }
    }

    function* generateForIojs(arch) {
        // Latest:
        yield {
            runtime: "iojs",
            runtimeVersion: "3.3.1",
            arch: arch
        };
    }

    function* generateForNWJS(arch) {
        // Latest:
        yield {
            runtime: "nw",
            runtimeVersion: "0.12.3",
            arch: arch
        };
    }

    function* generateForElectron(arch) {
        // Latest:
        yield {
            runtime: "electron",
            runtimeVersion: "0.34.0",
            arch: arch
        };
    }

    function* generateForArch(arch) {
        yield* generateForNode(arch);
        yield* generateForIojs(arch);
        yield* generateForNWJS(arch);
        yield* generateForElectron(arch);
    }

    if (environment.isWin) {
        yield* generateForArch("x64");
        yield* generateForArch("ia32");
    }
    else {
        yield* generateForArch();
    }

    // Actual:
    yield {};
}

function* generateOptions() {
    for (let runtimeOptions of generateRuntimeOptions()) {
        if (environment.isWin) {
            // GNU:
            yield _.extend({}, runtimeOptions, {noMSVC: true});

            // VS (default):
            yield runtimeOptions;
        }
        else {
            // Default:
            yield runtimeOptions;

            // Clang, Make
            yield _.extend({}, runtimeOptions, {preferClang: true, referMake: true});

            // Clang, Ninja
            yield _.extend({}, runtimeOptions, {preferClang: true});

            // g++, Make
            yield _.extend({}, runtimeOptions, {preferGnu: true, referMake: true});

            // g++, Ninja
            yield _.extend({}, runtimeOptions, {preferGnu: true});
        }
    }
}

let testRunner = {
    runCase: function (testCase, options) {
        for (let testOptions of generateOptions()) {
            let currentOptions = _.extend({}, testOptions, options || {});
            it("should build with: " + util.inspect(currentOptions), function (done) {
                async(function*() {
                    log.info("TEST", "Running case for options of: " + util.inspect(currentOptions));
                    yield testCase(currentOptions);
                })().nodeify(done);
            });
        }
    }
};

module.exports = testRunner;