var fs = require('fs'),
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    NaiveBayesClassifier = require('./naiveBayesClassifier'),
    dataSet = JSON.parse(fs.readFileSync('./classifier.json', 'utf-8')),
    classifier = NaiveBayesClassifier.load(dataSet),
    port = process.env.PORT || 80;

app.use(bodyParser.json({
    'limit': '30MB'
}));

app.post('/', function(request, response) {
    if (!request.accepts('application/json')) {
        response.status(406).send('application/json');
    }
    
    if (!request.body) {
        response.status(415).send('Please send application/json');
    }
});

app.listen(port);