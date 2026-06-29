const { Piscina } = require('piscina');
const path = require('path');
const piscina = new Piscina({
  filename: path.resolve(__dirname, 'newflowm3u8.mjs'),
   minThreads: 1,
  maxThreads: 1,
});
(async () => {
  console.log('--- Starting Bot ---');
  try {
    await piscina.run();
  } catch (err) {
    console.error('--- Error bot: ---', err);
  }
})();