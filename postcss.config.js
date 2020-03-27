module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      unitToConvert: 'px',
      viewportWidth: 750,
      viewportHeight: 1334,
      unitPrecision: 3,
      propList: ['*'],
      viewportUnit: 'vw',
      fontViewportUnit: 'vw',
      selectorBlackList: ['icon, app'],
      minPixelValue: 1,
      mediaQuery: false,
      replace: true,
      exclude: /(vant)/,
    },
  },
};
