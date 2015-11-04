const config = require('../../package.json').babelBoilerplateOptions;

window.mocha.setup('bdd');
window.onload = () => {
  window.mocha.checkLeaks();
  window.mocha.globals(config.mochaGlobals);
  window.mocha.run();
  require('./setup')(window);
};
