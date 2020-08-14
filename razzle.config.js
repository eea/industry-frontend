const path = require('path');

// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
// const autoprefixer = require('autoprefixer');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer');
// const projectRootPath = path.resolve('.');
// const voltoConfig = require(`${voltoPath}/razzle.config`);
// const voltoPath = base.resolveVoltoPath('.');

const base = require('./src/develop/volto-base/src').razzle;

const config = base.BaseConfig(path.resolve('.'));

const localSvgPlugin = config => {
  const SVGLOADER = {
    test: /icons\/.*\.svg$/,
    use: [
      {
        loader: 'svg-loader',
      },
      {
        loader: 'svgo-loader',
        options: {
          plugins: [
            { removeTitle: true },
            { convertPathData: false },
            { removeUselessStrokeAndFill: true },
            { removeViewBox: false },
          ],
        },
      },
    ],
  };

  config.module.rules.push(SVGLOADER);
  return config;
};

module.exports = {
  plugins: { ...base.plugins, localSvgPlugin },
  modify: config.modify, //razzleModify(voltoPath),
};
