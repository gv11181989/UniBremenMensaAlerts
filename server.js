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
var finalMessage ="";

setInterval(function(){ // Set interval for checking
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

var dateNumber = date.replace(/\D/g, '');

if (dateNumber === new Date().getDate().toString()){
    messageDate = "Heutiges Angebot";
}
else {
    messageDate = "Angebot am " + date;
}


 finalMessage = messageDate+message;
console.log(finalMessage);
    }
    catch (e) {
      console.log("error");
      finalMessage = "Sorry, can't reach the menu today.The resident nerd" +nerd+ "is looking into this issue" +runEmoji;
    }

 
});

}).on("error", ()=> {
  console.log("Sorry can't reach the menu today")
  finalMessage = "Sorry, can't reach the menu today.The resident nerd " +nerd+ " is looking into this issue " +runEmoji;
  
});

//****Telegram bot start*****
bot.hears('?', ctx => {
  return ctx.reply(finalMessage);
  
});

  checkTime = new Date(); // Date object to find out what time it is
    if(checkTime.getHours() === 5 && checkTime.getMinutes() === 0){ // Check the time
           // Code
bot.telegram.sendMessage('@UniBMensaMenu', finalMessage);
console.log(new Date().getHours());
}
bot.startPolling();
//****Telegram bot end*****

message = "";
},60000);




