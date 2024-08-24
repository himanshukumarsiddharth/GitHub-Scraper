const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const pdfkit = require("pdfkit");
const os = require('os');

function getIssuesPageHtml(url, topic, repoName) {
    request(url, cb);
    function cb(err, response, html) {
        if (err) {
            console.log(err);
        } else if (response.statusCode == 404) {
            console.log("page not found");
        }
        else {
            getIssues(html);
        }
    }
    function getIssues(html) {
        let $ = cheerio.load(html);
        let issuesElemArr = $(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title");
        let arr = [];
        for (let i = 0; i < issuesElemArr.length; i++) {
            let link = $(issuesElemArr[i]).attr("href");
            arr.push(link);
        }
        const downloadsPath = getDownloadsFolder();
        let folderpath = path.join(downloadsPath, topic);
        dirCreater(folderpath);
        let filePath = path.join(folderpath, repoName + ".pdf");
        let text = JSON.stringify(arr);
        let pdfDoc = new pdfkit();
        pdfDoc.pipe(fs.createWriteStream(filePath));
        pdfDoc.text(text);
        pdfDoc.end();
    }
}
module.exports = getIssuesPageHtml;
function dirCreater(folderpath) {
    if (fs.existsSync(folderpath) == false) {
        fs.mkdirSync(folderpath);
    }
}

function getDownloadsFolder() {
    const homeDir = os.homedir();
    const platform = os.platform();
    
    if (platform === 'win32') {
        return path.join(homeDir, 'Downloads');
    } else if (platform === 'darwin') {
        return path.join(homeDir, 'Downloads');
    } else if (platform === 'linux') {
        // On Linux, Downloads folder can be in different locations based on the distro, but it is commonly in home directory.
        return path.join(homeDir, 'Downloads');
    } else {
        console.log('Unsupported OS');
    }
}
