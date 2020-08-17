const { Cluster } = require('./node_modules/puppeteer-cluster/dist');

const fs = require('fs');
const util = require('util');
const chalk = require("chalk");

const error = chalk.bold.red;
const success = chalk.keyword("green");

var request = require('request');

var seq_limit = process.argv[2];

const readFile = util.promisify(fs.readFile);

var count = 0;
var file_seq = 1;

(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 2,

        puppeteerOptions: {
            headless: true,
            args: [
                '--proxy-server="direct://"',
                '--proxy-bypass-list=*'
              ]
        },

        monitor: true,
    });

    // Extracts download link from the crawled pages
    await cluster.task(async ({ page, data: url }) => {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitFor(10000);
        await page.click('#w-pdf');
        await page.waitFor(10000);
        for (const frame of page.mainFrame().childFrames()) {
          if (frame.name().includes('pdf_iframe')) {
            let urllink = await frame.evaluate(() => {
              return document.getElementsByClassName('btn btn-pf btn-xl btn-success js-pdf-download pdf-download')[0].href;
            }, 'homepage-project-image');

            if(count == seq_limit-1) {
                file_seq += 1;
                count = 0;
            }

            if(urllink.indexOf("pdfs/make") > -1) {
                console.log(error('Error crawling: pdfs/make' + data+":"+err.message));
                fs.appendFile('outurls_errors.txt', url.replace('https://www.printfriendly.com/print/?source=homepage&url=','') + "\r\n", function (err) {
                    if (err) throw err;
                });

                fs.appendFile('url_log.txt',"Result: Failed!\r\nOriginal Link: " + url.replace('https://www.printfriendly.com/print/?source=homepage&url=','') + "\r\n" + "Error Message: " + 'pdfs/make' + "\r\n", function (err) {
                    if (err) throw err;
                        console.log(success());
                });
            }
            else {
                var req3 = 'http://localhost:3128/linkcollector/addLinksAndStartDownload?' + urllink + '&PDFS&&'
                var r = request(req3);
                r.on('response',  function (res) {
                    console.log(url.replace('https://www.printfriendly.com/print/?source=homepage&url=','') + "=" + res.statusMessage + "\n");
                });

                fs.appendFile('outurls' + file_seq + '.txt', urllink + "\r\n", function (err) {
                    if (err) throw err;
                        console.log(success("Result: Success!\r\nOriginal Link: " + url.replace('https://www.printfriendly.com/print/?source=homepage&url=','') + "\r\n" + "Download Link: " + urllink));
                        count += 1;
                });

                fs.appendFile('url_log.txt',"Result: Success!\r\nOriginal Link: " + url.replace('https://www.printfriendly.com/print/?source=homepage&url=','') + "\r\n" + "Download Link: " + urllink + "\r\n", function (err) {
                    if (err) throw err;
                        console.log(success());
                });
            }
          }
        }
    });

    // In case of problems, log them
    await cluster.on('taskerror', (err, data) => {
        
        fs.appendFile('outurls_errors.txt', data.replace('https://www.printfriendly.com/print/?source=homepage&url=','') + "\r\n", function (err) {
            if (err) throw err;
        });

        fs.appendFile('url_log.txt',"Result: Failed!\r\nOriginal Link: " + data.replace('https://www.printfriendly.com/print/?source=homepage&url=','') + "\r\n" + "Error Message: " + err.message + "\r\n", function (err) {
            if (err) throw err;
                console.log(success());
        });
        console.log(error('Error crawling: ' + data+":"+err.message));
    });

    // Read the input file file from the current directory
    const csvFile = await readFile(__dirname + '/in.txt', 'utf8');
    const lines = csvFile.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        await cluster.queue('https://www.printfriendly.com/print/?source=homepage&url=' + line);
    }

    await cluster.idle();
    await cluster.close();
})();