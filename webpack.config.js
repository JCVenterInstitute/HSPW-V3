const webpack = require('webpack');

module.exports = {
module: {
rules: [
{
test: /.svg$/i,
loader: 'svg-inline-loader',
}
]
},
devServer: {
    client: {
      overlay: {
        runtimeErrors: (error) => {
          if (error.message === "ResizeObserver loop limit exceeded") {
            return false;
          }
          return true;
        },
      },
    },
  },
};
