const Telegraf = require('telegraf');
const app = new Telegraf(1365921717:AAHk5O8b5REDgqtMhg6zb6vF0mUC2n5nisE);

app.hears('hi', ctx => {
  return ctx.reply('Hey!');
});

app.startPolling();