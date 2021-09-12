const fs = require('fs');
const http = require("http");
const url = require("url")
const replaceTemp = require("./modules/replace")
const port = process.env.PORT || 3000

const tempOverview = fs.readFileSync(`${__dirname}/templates/my-overview.html`, "utf-8")
const tempProduct = fs.readFileSync(`${__dirname}/templates/my-product.html`, "utf-8")
const tempCard = fs.readFileSync(`${__dirname}/templates/temp-card.html`, "utf-8")
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8")
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const baseUrl = `http://${req.headers.host}`
    const requestUrl = req.url
    const myUrl = new URL(requestUrl, baseUrl);
    const {pathname} = myUrl
    const queryID = myUrl.searchParams.get("id")
    // const {query, pathname} = url.parse(req.url, true)
    // overview page
    if(pathname === "/" || pathname === "/overview") {
        res.writeHead(200, {
            "Content-type": "text/html"
        });

    const cardsHtml = dataObj.map(product => replaceTemp(tempCard, product)).join("");
    const output = tempOverview.replace(/{%PRODUCT_CARD%}/g, cardsHtml)
    res.end(output)

        // product page
    } else if(pathname === "/product") {
        const product = dataObj[queryID]
        const output = replaceTemp(tempProduct, product)
        res.writeHead(200, {
            "Content-type": "text/html"
        });
        res.end(output);
        // api
    } else if(pathname === "/api") {
        res.writeHead(200, {
            "Content-type": "application/json"
        });
        res.end(data)
        // not found
    } else {
        res.writeHead(404, {
            "Content-type": "text/html"
        });
        res.end("page not found")
    }
});

server.listen(port, () => console.log(`Listening to requests on port ${port}`))

// const text = fs.readFileSync("./txt/input.txt", "utf8", (err, data) => console.log(data));
// fs.writeFileSync("./txt/output.txt", text)
// fs.writeFile("./txt/output.txt", 'Hello Node.js', 'utf8', (err, data) => console.log(data));

// fs.readFile("./txt/input.txt", "utf8", (err, data) => {
//     console.log("first callback");
//     fs.readFile("./txt/output.txt", "utf-8", (err, data) => {
//         console.log("second callback")
//     })
// })