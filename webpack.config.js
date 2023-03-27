// Version if the local Node.js version supports async/await
// webpack.config.js
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");
const path = require("path");
const slsw = require("serverless-webpack");

module.exports = (async () => {
  const accountId = await slsw.lib.serverless.providers.aws.getAccountId();
  return {
    mode: slsw.lib.webpack.isLocal ? "development" : "production",
    stats: "minimal",
    entry: slsw.lib.entries,
    target: "node",
    plugins: [
      new webpack.DefinePlugin({
        AWS_ACCOUNT_ID: `${accountId}`,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".json"],
      plugins: [new TsconfigPathsPlugin()],
    },
    // we use webpack-node-externals to excludes all node deps.
    // You can manually set the externals too.
    externals: [nodeExternals()],
    output: {
      libraryTarget: "commonjs",
      path: path.resolve(__dirname, ".webpack"),
      filename: "[name].js",
    },
  };
})();