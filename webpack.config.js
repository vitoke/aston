const path = require("path");

const serverConfig = {
  mode: "production",
  entry: "./src/lib/index.js",
  target: "node",
  output: {
    library: "aston",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "dist"),
    filename: "aston.node.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/env",
              {
                targets: {
                  node: "current"
                }
              }
            ]
          ]
        }
      }
    ]
  }
};

const clientConfig = {
  entry: "./src/lib/index.js",
  target: "web",
  output: {
    library: "aston",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "dist"),
    filename: "aston.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/env"]
        }
      }
    ]
  }
};

module.exports = [serverConfig, clientConfig];
