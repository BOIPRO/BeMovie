const { Piscina } = require('piscina');
const path = require('path');
const piscina = new Piscina({
  filename: path.resolve(__dirname, 'metadata.bot.mjs'),
   minThreads: 1,
  maxThreads: 1,
});
(async () => {
  console.log('--- Starting Bot ---');
  try {
    const config = {
      dbUrl: "mongodb+srv://boiDev:Boi3112007100@cluster0.ko9cetb.mongodb.net/",
    };
    await piscina.run(config);
  } catch (err) {
    console.error('--- Error bot: ---', err);
  }
})();