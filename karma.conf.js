const parts = require("./webpack.parts");
const path = require("path");

module.exports = config => {
  const tests = "tests/*.test.js";
  process.env.BABEL_ENV = "karma";
  config.set({
    frameworks: ["mocha"],
    files: [{ pattern: tests }],
    preprocessors: { [tests]: ["webpack"] },
    browsers: ["PhantomJS"],
    reporters: ["coverage"],
    coverageReporter: {
      dir: "build",
      reporters: [{ type: "html" }, { type: "lcov" }]
    },
    webpack: parts.loadJavaScript(),
    singleRun: true // Terminates execution of build after the first run
  });
};
