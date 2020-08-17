var request = require('request');

var url2 = 'https://pdf.printfriendly.com/pdfs/1554081163_e86626/download';
var req3 = 'http://localhost:3129/linkcollector/addLinksAndStartDownload?' + "http://www.google.com.au" + '&PDFS&&'

var r = request(req3);

r.on('response',  function (res) {
  console.log(res.statusMessage);
});

function get_page_title(url) {
  var title = '';
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      title = $("title").text();
    }
  });
  return title;
}

function titleCase(str) {
  str = str.slice(1).replace(/-/g," ").replace(/\s+/g,"");
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  return splitStr.join(' '); 
}

