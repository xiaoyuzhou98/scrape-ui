const isProd = process.env.NODE_ENV == "production";
module.exports = {
  publicPath: "./",
  devServer: {
    disableHostCheck: true,
    proxy: {
      "/api": {
        target: "http://localhost:8083",
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },

  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: "scrape",
        appId: "scrape",
        compression: "store",
        directories: {
          output: "build",
        },
        extraResources: {
          from: "./resources/server",
          to: "./server",
        },
        nsis: {
          oneClick: false, // 一键安装
          allowToChangeInstallationDirectory: true, // 允许更改安装目录
          createDesktopShortcut: true,
        },
      },
    },
  },
  lintOnSave: true,
  productionSourceMap: false,
  css: isProd
    ? {
        extract: {
          filename: `css/[name].[chunkhash].css`,
          chunkFilename: `css/[name].[chunkhash].css`,
        },
      }
    : {},
  configureWebpack: (config) => {
    config.optimization = {
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `npm.${packageName.replace("@", "")}`;
            },
          },
        },
      },
    };
    if (isProd) {
      Object.assign(config, {
        output: {
          ...config.output,
          filename: `js/[name].[chunkhash].js`,
          chunkFilename: `js/[name].[chunkhash].js`,
        },
      });
    }
  },
};
