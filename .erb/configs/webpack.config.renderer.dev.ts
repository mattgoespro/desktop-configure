import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { execSync } from "child_process";
import fs from "fs";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import webpack from "webpack";
import "webpack-dev-server";
import { merge } from "webpack-merge";
import checkNodeEnv from "../scripts/check-node-env";
import baseConfig from "./webpack.config.base";
import webpackPaths from "./webpack.paths";
import { killSubprocessesMiddleware, startPreloadTaskMiddleware } from "./webpack.middleware";

if (process.env.NODE_ENV === "production") {
  checkNodeEnv("development");
}

const port = process.env.PORT || 1212;
const manifest = path.resolve(webpackPaths.dllPath, "renderer.json");
const skipDLLs =
  require.main?.filename.includes("webpack.config.renderer.dev.dll") ||
  require.main?.filename.includes("webpack.config.eslint");

/**
 * Warn if the DLL is not built
 */
if (!skipDLLs && !(fs.existsSync(webpackPaths.dllPath) && fs.existsSync(manifest))) {
  console.warn(
    'The DLL files are missing. Sit back while we build them for you with "npm run build-dll"'
  );
  execSync("npm run postinstall");
}

const configuration: webpack.Configuration = {
  devtool: "inline-source-map",
  mode: "development",
  target: ["web", "electron-renderer"],
  entry: [
    `webpack-dev-server/client?http://localhost:${port}/dist`,
    "webpack/hot/only-dev-server",
    path.join(webpackPaths.srcRendererPath, "index.tsx")
  ],
  output: {
    path: webpackPaths.distRendererPath,
    publicPath: "/",
    filename: "renderer.dev.js",
    library: {
      type: "umd"
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: "@teamsupercell/typings-for-css-modules-loader",
            options: {
              formatter: "prettier",
              prettierConfigFile: path.resolve(__dirname, ".prettierrc.js")
            }
          },
          {
            loader: "css-loader",
            options: { modules: true }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.css$/,
        exclude: "/node_modules/",
        use: ["@teamsupercell/typings-for-css-modules-loader", "css-loader"]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource"
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: "asset/resource"
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              prettier: false,
              svgo: false,
              svgoConfig: {
                plugins: [{ removeViewBox: false }]
              },
              titleProp: true,
              ref: true
            }
          },
          "file-loader"
        ]
      }
    ]
  },
  plugins: [
    ...(skipDLLs
      ? []
      : [
          new webpack.DllReferencePlugin({
            context: webpackPaths.dllPath,
            manifest: require(manifest),
            sourceType: "var"
          })
        ]),

    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development"
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new ReactRefreshWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: path.join("index.html"),
      template: path.join(webpackPaths.srcRendererPath, "index.ejs"),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
      },
      isBrowser: false,
      env: process.env.NODE_ENV,
      isDevelopment: process.env.NODE_ENV !== "production",
      nodeModules: webpackPaths.appNodeModulesPath
    })
  ],
  node: {
    __dirname: false,
    __filename: false
  },
  devServer: {
    port,
    compress: true,
    hot: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    static: {
      publicPath: "/"
    },
    historyApiFallback: {
      verbose: true
    },
    setupMiddlewares(middlewares) {
      const { preloadProcess, args } = startPreloadTaskMiddleware();
      killSubprocessesMiddleware(args, [preloadProcess]);
      return middlewares;
    }
  }
};

export default merge(baseConfig, configuration);
