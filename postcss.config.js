module.exports = {
    plugins: {
      'postcss-px-to-viewport': {
        viewportWidth: 375,
        selectorBlackList: ['#ampp','.btn_item'],
        minPixelValue: 1,
        // exclude: /vant/
      },
    },
  };