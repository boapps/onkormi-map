const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const nextConfig = {
  reactStrictMode: true,
  // transpilePackages: ["react-leaflet-cluster"],
  output: 'export',
  webpack: (config, options) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: 'node_modules/leaflet/dist/images',
            to: path.resolve(__dirname, 'public', 'leaflet', 'images')
          },
        ],
      }),
    )
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: true,
          },
        },
      ],
    });
    return config
  }
}

module.exports = nextConfig;
