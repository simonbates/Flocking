/*
 * Flocking Media Element Input Demo
 *   Copyright 2013-2014, Colin Clark
 *
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */

/*global fluid, flock*/

(function () {
    "use strict";

    flock.init({
        chans: 2,
        numInputBuses: 2
    });

    fluid.defaults("flock.demo.mediaElementInput", {
        gradeNames: ["fluid.viewComponent", "flock.band", "autoInit"],

        granulatorDef: {
            ugen: "flock.ugen.granulator",
            numGrains: {
                ugen: "flock.ugen.lfNoise",
                freq: 1/5,
                mul: 50,
                add: 52,
                options: {
                    interpolation: "linear"
                }
            },
            grainDur: {
                ugen: "flock.ugen.sinOsc",
                freq: {
                    ugen: "flock.ugen.lfNoise",
                    freq: 1/2,
                    mul: 1/3,
                    add: 1/3,
                    options: {
                        interpolation: "linear"
                    }
                },
                mul: 0.1,
                add: 0.2
            },
            source: {
                ugen: "flock.ugen.mediaIn",
                options: {}
            }
        },

        synthDef: {
            expander: {
                funcName: "flock.demo.mediaElementInput.granulators",
                args: ["{that}.options.granulatorDef", "{that}.options.selectors"]
            }
        },

        components: {
            synth: {
                type: "flock.synth",
                options: {
                    synthDef: "{mediaElementInput}.options.synthDef"
                }
            }
        },

        listeners: {
            onCreate: [
                {
                    funcName: "flock.demo.mediaElementInput.setHalfSpeed",
                    args: ["{that}.dom.slow"]
                },
                {
                    func: "{that}.play"
                }
            ]
        },

        selectors: {
            regular: "#regular",
            slow: "#slow"
        }
    });

    flock.demo.mediaElementInput.setHalfSpeed = function (audio) {
        audio[0].playbackRate = 0.5;
    };

    flock.demo.mediaElementInput.granulators = function (def, elementSelectors) {
        var defs = [];

        fluid.each(elementSelectors, function (selector, selectorName) {
            var defForAudio = fluid.copy(def);
            defForAudio.source.options.element = selector;
            defForAudio.id = selectorName;
            defs.push(defForAudio);
            defForAudio.source.bus = flock.enviro.shared.audioSettings.chans + defs.length - 1;
        });

        return defs;
    };
}());
