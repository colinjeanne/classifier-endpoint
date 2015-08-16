var fs = require('fs'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    createError = require('http-errors'),
    app = express(),
    NaiveBayesClassifier = require('./naiveBayesClassifier'),
    dataSet = JSON.parse(fs.readFileSync('./classifier.json', 'utf-8')),
    classifier = NaiveBayesClassifier.load(dataSet),
    port = process.env.PORT || 80;

app.use(bodyParser.json({
    limit: '30MB'
}));

var corsMiddleware = cors({
    origin: '*'
});

app.use(corsMiddleware);

app.options('/', corsMiddleware);

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/assets/index.html');
});

app.post('/',
    function(request, response, next) {
        var hasBadDocument = false;
        
        if (!request.body) {
            return next(createError(415, 'Expected application/json'));
        } else if (!Array.isArray(request.body)) {
            return next(createError(415, 'Expected array of documents'));
        } else {
            request.body.forEach(function(document) {
                if (!document.full_text) {
                    hasBadDocument = true;
                }
            });
        }
        
        if (hasBadDocument) {
            return next(createError(415, 'Expected each document to have a full_text property'));
        }

        next();
    },
    function(request, response) {
        var classifiedDocuments = [];
        
        request.body.forEach(function(document) {
            var classification = classifier.classify(document.full_text);
            document.category = classification;
            classifiedDocuments.push(document);
        });
        
        response.status(200).json(classifiedDocuments);
    });

app.use(function(err, request, response, next) {
    if (err.status) {
        response.status(err.status).send(err.message);
    }
});

app.listen(port);