// https://github.com/AlloyTeam/eslint-config-alloy/blob/master/README.zh-CN.md
module.exports = {
  root: true,
  extends: ['alloy', 'alloy/vue'],
  env: {
    // 你的环境变量（包含多个预定义的全局变量）
    //
    browser: true,
    node: true,
    // mocha: true,
    // jest: true,
    // jquery: true
  },
  globals: {
    // 你的全局变量（设置为 false 表示它不允许被重新赋值）
    //
    // myGlobal: false
  },
  rules: {
    // 自定义你的规则
  },
};
