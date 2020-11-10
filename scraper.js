// Scraper code start

const cheerio = require('cheerio'),
 axios = require('axios'),
 scraperurl = 'https://www.stw-bremen.de/de/mensa/uni-mensa';
var mealArray = [];
var scraper = axios.get(scraperurl).then(function (response) {
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
  console.log(mealArray);
  return mealArray;     
  });
  exports.toServerjs = scraper;





