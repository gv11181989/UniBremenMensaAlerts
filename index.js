const https = require("https");
const Telegraf = require('telegraf');
const url = "https://api.mensa.legacymo.de/0";
const config = require('./config.json');
const app = new Telegraf(config.bot_token);

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
    var result = [];
    
for (i = 0; i < count ; i++) {
    isEmpty = Object.keys(body.food[i].meal).length;   
    if( isEmpty  !== 0){
    var veganCheck = JSON.stringify(body.food[i].meal[0].name).toLowerCase().includes("vegan",0);   
        if(veganCheck)
        {
    var type = JSON.stringify(body.food[i].type);
    var mealName = JSON.stringify(body.food[i].meal[0].name);
    var mealCost = JSON.stringify(body.food[i].meal[0].costs.a);
    var array = {
        type : type,
        mealname : mealName,
        cost : mealCost
    }
     result.push(array);
        }
    }
}
console.log(result);





  });
});
