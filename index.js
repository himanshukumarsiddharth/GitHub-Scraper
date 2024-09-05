const express = require('express');
const request = require("request");
const cheerio = require("cheerio");
const getReposPageHtml = require("./reposPage");

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    const url = 'https://github.com/topics';

    request(url, (err, response, html) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching the page' });
        } else if (response.statusCode === 404) {
            return res.status(404).json({ error: 'Page not found' });
        } else {
            try {
                getTopicLinks(html);
            } catch (error) {
                res.status(500).json({ error: 'Error processing the page' });
            }
        }
    });
});

function getTopicLinks(html) {
    let $ = cheerio.load(html);
    let linkElemArr = $(".no-underline.d-flex.flex-column.flex-justify-center");
    for (let i = 0; i < linkElemArr.length; i++) {
        let href = $(linkElemArr[i]).attr("href");
        let topic = href.split("/").pop();
        let fullLink = `https://github.com/${href}`;
        console.log("topic",linkElemArr,href,topic,fullLink);
        getReposPageHtml(fullLink, topic);

    }

}

app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
});
