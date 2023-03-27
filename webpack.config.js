// webpack.config.js
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const slsw = require("serverless-webpack");

module.exports = (async () => {
  const accountId = await slsw.lib.serverless.providers.aws.getAccountId();
  return {
    ...(slsw.lib.webpack.isLocal && { devtool: "eval" }),
    mode: slsw.lib.webpack.isLocal ? "development" : "production",
    entry: slsw.lib.entries,
    stats: "minimal",
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
    externals: ["aws-sdk", "bufferutil", "express", "utf-8-validate"],
    output: {
      libraryTarget: "commonjs",
      path: path.resolve(__dirname, ".webpack"),
      filename: "[name].js",
    },
  };
})();
