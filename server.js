const https = require("https");
const Telegraf = require('telegraf');
const url = "https://api.mensa.legacymo.de/0";
const config = require('./config.json');
const bot = new Telegraf(config.bot_token);
const emoji = require('node-emoji');
const noIdea = emoji.get('woman-shrugging');
var message = "";
var checkTime = "";

setInterval(function(){ // Set interval for checking
    checkTime = new Date(); // Date object to find out what time it is
      if(checkTime.getHours() === 7 /*&& date.getMinutes() === 0*/){ // Check the time
             // Code

https.get(url, res => {
  res.setEncoding("utf8");
  let body = "";
  res.on("data", data => {
    body += data;
  });
  res.on("end", () => {
    body = JSON.parse(body);
    var count = Object.keys(body.food).length;
    var i = 0;
    var isEmpty = 0;
    
for (i = 0; i < count ; i++) {
    isEmpty = Object.keys(body.food[i].meal).length;   
    if( isEmpty  !== 0){
   
    var date = body.date;      
    var type = (body.food[i].type);
    var mealName = (body.food[i].meal[0].name);
    var mealCostS = (body.food[i].meal[0].costs.a);
    var mealCostB = (body.food[i].meal[0].costs.b);
    var cost;
    var messageDate;
    if (mealCostS === "" && mealCostB === "" ){
     cost = noIdea
    }
    else {
        cost = "Studierende- " + mealCostS+"\nBedienstete- "+mealCostB;
    }
    message += "\n\n"+type+ "\n" +mealName+ "\n" +"Preis - "+cost;
   
    }
}

if (date === new Date().getDate()){
    messageDate = "Heutiges Angebot";
}
else {
    messageDate = "Angebot am " + date;
}


var finalMessage = messageDate+message;
console.log(finalMessage);

//****Telegram bot start*****
bot.hears('Supp?', ctx => {
    return ctx.reply(finalMessage);
    
  });
  bot.telegram.sendMessage('@UniBMensaMenu', finalMessage);
  bot.startPolling();
//****Telegram bot end*****
message = "";
 
});
});


}
},3600010); // Repeat every day

console.log(new Date().getHours());
