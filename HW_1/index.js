/***
 * primary file for Api
 */

const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoer = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');


const httpServer = http.createServer(function(req, res) {
    unifiedServer(req, res);
});

httpServer.listen(config.httpPort, function() {
    console.log(`The server is listening on port ${config.httpPort} now in ${config.envName} mode`);
});

const httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem'),
};

const httpsServer = https.createServer(httpsServerOptions, function(req, res) {
    unifiedServer(req, res);
});
httpsServer.listen(config.httpsPort, function() {
    console.log(`The server is listening on port ${config.httpsPort} now in ${config.envName} mode`);
});


const unifiedServer = (req, res) => {

// get the URL and parse it
    const parsedUrl = url.parse(req.url, true);

    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // get query string as an object
    // const queryStringObject = Object.assign({}, parsedUrl.query);
    const queryStringObject = parsedUrl.query;

    //get the HttP method
    const method = req.method.toLowerCase();
    const headers = req.headers;


    // Get the payload if any
    const decoder = new StringDecoer('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data)
    });
    req.on('end', () => {
        buffer += decoder.end();
        const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct data object for  the handlers
        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer,
        };

        chosenHandler(data, (statusCode, payload) => {
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
            payload = typeof (payload) == 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

            // Send rhe response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log(`Returning response: `, statusCode, payloadString)
        });
    })
};


// handlers
const handlers = {};

handlers.ping = (data, callback) => {
    callback(200)
};
handlers.hello = (data, callback) => {
    callback(200, {message: "greetings from the hello World example"})
};

handlers.notFound = (data, callback) => {
    callback(404);
};

//define a request router
const router = {
    'ping': handlers.ping,
    'hello': handlers.hello
};


