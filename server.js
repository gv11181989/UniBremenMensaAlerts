
const https = require("https");
const Telegraf = require('telegraf');
const url = "https://api.mensa.legacymo.de/0";
const config = require('./config.json');
const bot = new Telegraf(config.bot_token);
const emoji = require('node-emoji');
const noIdea = emoji.get('woman-shrugging');
const runEmoji = emoji.get('woman-running');
const nerd = emoji.get('nerd_face');
var message = "";
var checkTime = "";
var finalMessage = "";
console.log("App running");
// setInterval(() => {
  try {
    //var fromScraperjs = require('./scraper.js');
    //fromScraperjs.toServerjs.then(function (result) {
    //  console.log(result);
    //});
    setInterval(() => {
    const cheerio = require('cheerio'),
      axios = require('axios'),
      scraperurl = 'https://www.stw-bremen.de/de/mensa/uni-mensa';
    var mealArray = [];
    axios.get(scraperurl).then(function (response) {
      const $ = cheerio.load(response.data);
      const count = $("body").find('div').eq(13).find('.l-main').find('div > div > div > div').eq(43).find('table').last().index();
      const table = $("table");


      for (i = 0; i < count; i++) {
        //var areaType = table.eq(i).find("thead > tr >th").eq(0).text();//.replace(/[\s]/g, "");
        var mealType = table.eq(i).find("tbody > tr > td > img").eq(0).attr("alt");
        //var mealName = table.eq(i).find("tbody > tr > td").eq(1).text().replace(/[\s]/g, "");

        if (typeof mealType == 'undefined') {
          mealType = " ";
        }
        else {
          mealType = mealType;
        }
        var meal = {
          // "areaType": areaType,
          "mealType": mealType,
          // "mealName": mealName
        };
        mealArray.push(meal);
      }
      https.get(url, res => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", data => {
          body += data;
        });
        res.on("end", () => {
          try {
            body = JSON.parse(body);
            var count = Object.keys(body.food).length;
            var i = 0;
            var isEmpty = 0;

            for (i = 0; i < count; i++) {
              isEmpty = Object.keys(body.food[i].meal).length;
              if (isEmpty !== 0) {

                var date = body.date;
                var type = (body.food[i].type);
                var mealType = mealArray[i].mealType;
                var mealName = (body.food[i].meal[0].name);
                var mealCostS = (body.food[i].meal[0].costs.a);
                var mealCostB = (body.food[i].meal[0].costs.b);
                var cost;
                var messageDate;
                if (mealCostS === "" && mealCostB === "") {
                  cost = noIdea
                }
                else {
                  cost = "Studierende- " + mealCostS + "\nBedienstete- " + mealCostB;
                }
                message += "\n\n" + type + "\n" + mealType + "\n" + mealName + "\n" + "Preis - " + cost;

              }
            }

            var dateNumber = date.replace(/\D/g, '');

            if (Number(dateNumber) === new Date().getDate()) {
              messageDate = "Heutiges Angebot";
            }
            else {
              messageDate = "Angebot am " + date;
            }


            finalMessage = messageDate + message;
            console.log(finalMessage);
          }
          
          catch (e) {
            console.log(e);
            finalMessage = "Sorry, can't reach the menu today.The resident nerd" + nerd + "is looking into this issue" + runEmoji;
          }
        });
      });
    })
  }, 6000);
  } catch (e) {
    console.log(e);
    finalMessage = "Sorry, can't reach the menu today.The resident nerd" + nerd + "is looking into this issue" + runEmoji;
  }
setInterval(() => {
  //****Telegram bot start*****
  bot.hears('?', ctx => {
    return ctx.reply(finalMessage);

  });

  checkTime = new Date(); // Date object to find out what time it is
  if (checkTime.getHours() === 6 && checkTime.getMinutes() === 0) { // Check the time

    bot.telegram.sendMessage('@UniBMensaMenu', finalMessage);
    console.log(new Date().getHours());
  }
  bot.startPolling();
  //****Telegram bot end*****  
  message = "";

  }, 60000);

