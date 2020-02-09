const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require("path");
const glob = require("glob");

const parts = require("./webpack.parts");

const PATHS = {
  app: path.join(__dirname, "src")
};

const commonConfig = merge([
  {
    plugins: [
      new HtmlWebpackPlugin({
        title: "Webpack demo"
      })
    ]
  },
  parts.loadFonts(),
  parts.loadJavaScript({ include: PATHS.app })
]);

const productionConfig = merge([
  parts.extractCSS({
    use: ["css-loader", parts.autoprefix()]
  }),
  parts.purifyCSS({
    paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true })
  }),
  /* It's essential the PurifyCSSPlugin plugin is used after
     the MiniCssExtractPlugin; otherwise, it doesn't work. The order
     matters, CSS extraction has to happen before purifying.
  */
  parts.loadImages({
    options: {
      limit: 15000,
      name: "[name].[ext]"
    }
  })
]);

const developmentConfig = merge([
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT
    // The 'process' module is exposed by node as a global. In addition to 'env',
    // it provides other functionality to get more info of the host system.
  }),
  parts.loadCSS(),
  parts.loadImages()
]);

module.exports = mode => {
  process.env.BABEL_ENV = mode;
  if (mode === "production") {
    return merge(commonConfig, productionConfig, { mode });
  }
  return merge(commonConfig, developmentConfig, { mode });
};
